import { Request, Response } from "express";
import User from "../models/User";
import Course from "../models/Course";
import Enrollment from "../models/Enrollment";

export const getDashboardStats = async (req: Request, res: Response) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Fetch baseline metrics counters simultaneously
    const [activeUsersCount, totalLearners, totalCourses, recentSales] = await Promise.all([
        User.countDocuments({ lastActiveAt: { $gte: sevenDaysAgo }, role: "learner" }),
        User.countDocuments({ role: "learner" }),
        Course.countDocuments(),
        Enrollment.find({ status: "completed" })
            .populate("user", "name email")
            .populate("course", "name")
            .sort({ createdAt: -1 })
            .limit(5)
    ]);

    // Aggregate Chart Data: Group completions by calendar day
    const chartDataArray = await Enrollment.aggregate([
        {
            $match: {
                status: "completed",
                createdAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
                revenue: { $sum: "$amountPaid" },
                enrollments: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } } // Chronological sort
    ]);

    // Format chart structure for Recharts frontend ingestion
    const formattedChartData = chartDataArray.map(item => ({
        date: item._id,
        Revenue: item.revenue,
        Enrollments: item.enrollments
    }));

    // Calculate cumulative earnings
    const totalRevenue = chartDataArray.reduce((acc, item) => acc + item.revenue, 0);

    res.json({
        totalCourses,
        totalLearners,
        activeUsers: activeUsersCount,
        totalRevenue,
        recentSales,
        chartData: formattedChartData // Injected into your global dashboard response payload
    });
};
