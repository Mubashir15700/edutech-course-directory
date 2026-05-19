import { Request, Response } from "express";
import Course from "../models/Course";
import User from "../models/User";

export const getDashboardStats = async (req: Request, res: Response) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const activeUsersCount = await User.countDocuments({
        lastActiveAt: { $gte: sevenDaysAgo },
        role: "learner"
    });

    const totalLearners = await User.countDocuments({ role: "learner" });
    const totalCourses = await Course.countDocuments();

    res.json({
        totalCourses,
        totalLearners,
        activeUsers: activeUsersCount
    });
};
