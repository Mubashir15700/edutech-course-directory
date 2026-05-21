import { Request, Response } from "express";
import User from "../models/User";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";

export const getDashboardStats = async (req: Request, res: Response) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const activeUsersCount = await User.countDocuments({
        lastActiveAt: { $gte: sevenDaysAgo },
        role: "learner"
    });

    const totalLearners = await User.countDocuments({ role: "learner" });
    const totalCourses = await Course.countDocuments();

    const revenueStats = await Enrollment.aggregate([
        { $match: { status: "completed" } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amountPaid" }
            }
        }
    ]);

    const totalRevenue = revenueStats[0]?.totalRevenue || 0;

    // Recent Completed Purchases with sub-document data populated
    const recentSales = await Enrollment.find({ status: "completed" })
        .populate("user", "name email")
        .populate("course", "name")
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        totalCourses,
        totalLearners,
        activeUsers: activeUsersCount,
        totalRevenue,
        recentSales
    });
};
