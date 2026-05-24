import { Request, Response } from "express";
import Course from "../models/Course";
import Review from "../models/Review";
import { AuthRequest } from "../middleware/authMiddleware";
import { triggerGlobalNotification } from "../utils/notify";

export const getCourses = async (req: Request, res: Response) => {
    const { page = "1", limit = "6", search = "", category = "", isAdmin = "false" } = req.query;

    const isAdminBool = isAdmin === "true";

    // Define exactly what fields the Course Card grid component needs
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

    const courses = await Course.find(query)
        .select(selectedFields)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
        data: courses,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
    });
};

export const getCourseById = async (req: AuthRequest, res: Response) => {
    const courseId = req.params.id;
    const userId = req.query.userId;

    const fetchReviews = req.query.fetchReviews === "true";

    const course = await Course.findById(courseId);

    if (!course) {
        res.status(404);
        throw new Error("Course not found");
    }

    // Convert Mongoose document to a plain JavaScript object 
    // so we can dynamically attach properties to it safely
    const courseData = course.toObject() as any;

    // CONDITIONAL LOOKUP: Fetch reviews only if the client is a learner
    if (fetchReviews) {
        const reviews = await Review.find({ course: courseId })
            .populate("user", "name")
            .sort({ createdAt: -1 })
            .lean(); // Converts documents to plain JS objects immediately, shedding Mongoose internals

        // Transform the clean array
        courseData.reviews = reviews.map(review => ({
            ...review,
            likes: review.likes?.length || 0, // Sends a pure numerical count to your UI
            hasLiked: review.likes?.some((id: any) => id.toString() === String(userId)) || false,
        }));
    } else {
        courseData.reviews = [];
    }

    // Send the unified data object back
    res.json({
        data: courseData,
    });
};

export const createCourse = async (req: Request, res: Response) => {
    const course = new Course(req.body);
    const saved = await course.save();

    res.status(201).json(saved);

    // Fire and forget the global notification background pipeline safely
    triggerGlobalNotification(
        "New Course Available! 🎓",
        `"${saved.name}" has just been published. Start learning today!`,
        "course"
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

    // 3. Save the document — this triggers pre-save hooks and nested validations!
    const updated = await course.save();

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

    res.json({
        success: true,
        message: `Course has been successfully ${course.isArchived ? "archived" : "restored and made public"}.`,
        isArchived: course.isArchived,
    });
};
