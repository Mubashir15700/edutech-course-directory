import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";
import Course from "../models/Course";

export const getLearners = async (req: Request, res: Response) => {
    const { page = "1", limit = "6", search = "" } = req.query;

    const searchFilter = { $regex: search, $options: "i" };

    const query: any = {
        role: req.query.role || "learner",
        $or: [
            { name: searchFilter },
            { email: searchFilter }
        ]
    };

    const learners = await User.find(query)
        .select("-password")
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
        data: learners,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
    });
};

export const deleteUser = async (req: Request, res: Response) => {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
        res.status(404);
        throw new Error("User not found");
    }

    res.json({
        success: true,
        message: "User deleted",
    });
};

export const getUserProfile = async (req: any, res: Response) => {
    const user = await User.findById(req.user._id).populate("enrolledCourses.courseId");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const coursesWithProgress = user.enrolledCourses.map((enrollment: any) => {
        const course = enrollment.courseId;

        // Handle edge case where a reference course might have been deleted from DB
        if (!course) return null;

        const totalLessons = course.lessons?.length || 0;
        const completedCount = enrollment.completedLessons?.length || 0;

        const percentage = totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0;

        return {
            _id: course._id,
            name: course.name,
            instructor: course.instructor,
            thumbnail: course.thumbnail,
            category: course.category,
            progress: percentage,
            totalLessons,
            completedLessonsCount: completedCount,

            // 🚀 CRITICAL FIX: Pass down raw lessons & raw completion state array to front-end
            lessons: course.lessons,
            completedLessons: enrollment.completedLessons || []
        };
    }).filter(Boolean); // Clears empty null entries cleanly

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrolledCourses: coursesWithProgress
    });
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name },
        { new: true }
    ).select("-password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    res.json({
        success: true,
        message: "Profile updated successfully",
        user
    });
};

export const enrollInFreeCourse = async (req: any, res: any) => {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    if (course.price > 0) {
        return res.status(400).json({ message: "This course is premium and requires checkout." });
    }

    await User.findByIdAndUpdate(userId, {
        $addToSet: {
            enrolledCourses: { courseId: courseId, completedLessons: [] }
        }
    });

    res.status(200).json({ message: "Enrolled successfully!", courseId });
};

export const markLessonComplete = async (req: AuthRequest, res: Response) => {
    const { courseId, lessonId } = req.body;

    await User.updateOne(
        { _id: req.user._id, "enrolledCourses.courseId": courseId },
        {
            // Adds the lesson ID to the tracking array safely without duplication
            $addToSet: { "enrolledCourses.$.completedLessons": lessonId }
        }
    );

    res.status(200).json({ message: "Lesson marked complete successfully." });
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error("Current and new passwords are required");
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.json({
        success: true,
        message: "Password updated successfully",
    });
};
