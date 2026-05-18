import { useGetCoursesQuery } from "../../features/courses/coursesApi";

export default function Dashboard() {
    const { data } = useGetCoursesQuery({
        page: 1,
        limit: 100,
        search: "",
        category: "",
    });

    const totalCourses = data?.total || 0;

    // fake for now (later from API)
    const totalLearners = 120;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Courses</p>
                    <h3 className="text-2xl font-bold">{totalCourses}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Total Learners</p>
                    <h3 className="text-2xl font-bold">{totalLearners}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Active Users</p>
                    <h3 className="text-2xl font-bold">89</h3>
                </div>

            </div>
        </div>
    );
}
