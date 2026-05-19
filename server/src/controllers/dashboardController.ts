import { Request, Response } from "express";
import Course from "../models/Course";
import User from "../models/User";

export const getDashboardStats = async (req: Request, res: Response) => {
    const totalCourses = await Course.countDocuments();

    const totalLearners = await User.countDocuments({
        role: "learner",
    });

    const activeUsers = await User.countDocuments({
        isActive: true,
    });

    res.status(200).json({
        success: true,
        data: {
            courses: totalCourses,
            learners: totalLearners,
            activeUsers,
        },
    });
};
