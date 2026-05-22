export type DashboardStats = {
    activeUsers: number;
    totalCourses: number;
    totalLearners: number;
    totalRevenue: number;
    recentSales: {
        _id: string;
        user: {
            name: string;
            email: string;
        } | null;
        course: {
            name: string;
        } | null;
        amountPaid: number;
        createdAt: string;
    }[];
    chartData: {
        date: string;
        Revenue: number;
        Enrollments: number;
    }[];
};
