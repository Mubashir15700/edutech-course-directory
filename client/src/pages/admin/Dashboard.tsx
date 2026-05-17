import { Link } from "react-router-dom";
import { useGetCoursesQuery, useDeleteCourseMutation } from "../../features/courses/coursesApi";

export default function Dashboard() {
    const [deleteCourse] = useDeleteCourseMutation();

    const { data, isLoading } = useGetCoursesQuery({
        page: 1,
        limit: 50,
        search: "",
        category: "",
    });

    const handleDelete = async (id: string) => {
        try {
            await deleteCourse(id).unwrap(); // only succeeds if API success
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <Link
                to="/admin/add"
                className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
            >
                Add Course
            </Link>

            <div className="grid gap-4">
                {data?.data.map((course) => (
                    <div key={course._id} className="border p-4 rounded">
                        <h2 className="font-semibold">{course.name}</h2>

                        <div className="flex gap-3 mt-2">
                            <Link
                                to={`/admin/edit/${course._id}`}
                                className="text-blue-500"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(course._id)}
                                className="text-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
