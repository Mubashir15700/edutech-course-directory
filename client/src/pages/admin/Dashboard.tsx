import { useGetDashboardStatsQuery } from "../../features/dashboard/dashboardApi";

export default function Dashboard() {
    const { data, isLoading } = useGetDashboardStatsQuery();

    const totalCourses = data?.totalCourses || 0;
    const totalLearners = data?.totalLearners || 0;
    const activeUsers = data?.activeUsers || 0;

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-120px)] flex justify-center items-center">
                <p className="text-lg font-semibold">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Courses</p>

                    <h3 className="text-3xl font-bold mt-2">{totalCourses}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Learners</p>

                    <h3 className="text-3xl font-bold mt-2">{totalLearners}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Active Users</p>

                    <h3 className="text-3xl font-bold mt-2">
                        {activeUsers}
                    </h3>
                </div>
            </div>
        </div>
    );
}
