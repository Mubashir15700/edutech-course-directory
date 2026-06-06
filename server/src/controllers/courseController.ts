import { Request, Response } from "express";
import Course from "../models/Course";
import Review from "../models/Review";
import { AuthRequest } from "../middleware/authMiddleware";
import { redisClient } from "../config/redis";
import { emailQueue } from "../queues/emailQueue";
import { triggerGlobalNotification } from "../utils/notify";
import { clearCourseCache } from "../utils/cacheInvalidator";
import { logger } from "../utils/logger";

const CACHE_TTL = 900; // 15 minutes in seconds

export const getCourses = async (req: Request, res: Response) => {
    const {
        page = "1", limit = "6", search = "", category = "", tag = "", isAdmin = "false"
    } = req.query;
    const isAdminBool = isAdmin === "true";

    // Generate a unique cache key based on query filters and page indexing
    const cacheKey = `courses:page=${page}:limit=${limit}:search=${search}:cat=${category}:tag=${tag}:admin=${isAdmin}`;

    try {
        // Try fetching from Redis RAM
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.json(JSON.parse(cachedData)); // Return cached payload instantly
        }
    } catch (err) {
        logger.error("Redis Read Error:", err); // Fail gracefully if Redis hiccups
    }

    // --- DATABASE FALLBACK ---
    let selectedFields = "name instructor duration category price level thumbnail rating numReviews";
    const query: any = {
        isArchived: false,
        name: { $regex: search, $options: "i" },
    };

    if (isAdminBool) {
        delete query.isArchived;
        selectedFields += " isArchived";
    }
    if (category) {
        query.category = category;
    }
    if (tag) {
        query.tags = {
            $in: [tag]
        };
    }

    const courses = await Course.find(query)
        .select(selectedFields)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    const responsePayload = {
        data: courses,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
    };

    // Save the fresh MongoDB query payload to Redis
    try {
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(responsePayload));
    } catch (err) {
        logger.error("Redis Write Error:", err);
    }

    res.json(responsePayload);
};

export const getCourseById = async (req: AuthRequest, res: Response) => {
    const courseId = req.params.id;
    const userId = req.query.userId || "guest";
    const fetchReviews = req.query.fetchReviews === "true";

    // Generate key. We track userId in the key because 'hasLiked' status changes per-user.
    const cacheKey = `course:${courseId}:user=${userId}:reviews=${fetchReviews}`;

    try {
        const cachedCourse = await redisClient.get(cacheKey);
        if (cachedCourse) {
            return res.json(JSON.parse(cachedCourse));
        }
    } catch (err) {
        logger.error("Redis Read Error:", err);
    }

    // --- DATABASE FALLBACK ---
    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    const courseData = course.toObject() as any;

    if (fetchReviews) {
        const reviews = await Review.find({ course: courseId })
            .populate("user", "name")
            .sort({ createdAt: -1 })
            .lean();

        courseData.reviews = reviews.map(review => ({
            ...review,
            likes: review.likes?.length || 0,
            hasLiked: review.likes?.some((id: any) => id.toString() === String(userId)) || false,
        }));
    } else {
        courseData.reviews = [];
    }

    const responsePayload = { data: courseData };

    // Store payload to Redis
    try {
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(responsePayload));
    } catch (err) {
        logger.error("Redis Write Error:", err);
    }

    res.json(responsePayload);
};

export const createCourse = async (req: Request, res: Response) => {
    const course = new Course(req.body);
    const saved = await course.save();

    if (saved) {
        await clearCourseCache(saved._id.toString());
    }

    res.status(201).json(saved);

    // This runs completely in the background without making the admin wait!
    triggerGlobalNotification(
        "New Course Available! 🎓",
        `"${saved.name}" has just been published. Start learning today!`,
        "course"
    );

    // Offload the massive email blast to Redis/BullMQ safely
    await emailQueue.add(
        `blast_course_${saved._id}`,
        {
            courseName: saved.name,
            courseId: saved._id.toString()
        },
        {
            attempts: 3, // Automatically retry 3 times if the job fails
            backoff: { type: "exponential", delay: 5000 } // Wait 5s, then 10s...
        }
    );
};

export const updateCourse = async (req: Request, res: Response) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    // Using .set() forces Mongoose to merge arrays cleanly while retaining 
    // sub-document IDs for items that match, or creating them for items that are new.
    course.set(req.body);

    // Save the document — this triggers pre-save hooks and nested validations!
    const updated = await course.save();

    if (updated) {
        await clearCourseCache(updated._id.toString());
    }

    res.json(updated);
};

export const toggleCourseArchiveStatus = async (req: Request, res: Response) => {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    // Flip the archive boolean flag
    course.isArchived = !course.isArchived;
    await course.save();

    if (course) {
        await clearCourseCache(course._id.toString());
    }

    res.json({
        success: true,
        message: `Course has been successfully ${course.isArchived ? "archived" : "restored and made public"}.`,
        isArchived: course.isArchived,
    });
};
