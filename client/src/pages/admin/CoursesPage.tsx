import { Link } from "react-router-dom";
import {
    useGetCoursesQuery,
    useDeleteCourseMutation,
} from "../../features/courses/coursesApi";
import type { Course } from "../../features/courses/types";
import Table, { type Column } from "../../components/admin/Table";

export default function CoursesPage() {
    const [deleteCourse, { isLoading: isDeleting }] =
        useDeleteCourseMutation();

    const { data, isLoading, error } = useGetCoursesQuery({
        page: 1,
        limit: 50,
        search: "",
        category: "",
    });

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;

        try {
            await deleteCourse(id).unwrap();
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex justify-center items-center">
                <p className="text-lg font-medium">Loading courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex justify-center items-center">
                <p className="text-red-500 text-lg">Failed to load courses</p>
            </div>
        );
    }

    const columns: Column<Course>[] = [
        { header: "Course", accessor: "name" },
        { header: "Instructor", accessor: "instructor" },
        { header: "Category", accessor: "category" },
        { header: "Duration", accessor: "duration" },
        {
            header: "Rating",
            accessor: "rating",
            render: (value: number) => `⭐ ${value}`,
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Courses</h1>

                <Link
                    to="/admin/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                >
                    + Add Course
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <Table
                    columns={columns}
                    data={data?.data || []}
                    renderActions={(course) => (
                        <div className="flex justify-end gap-3">
                            <Link to={`/admin/edit/${course._id}`} className="text-blue-600">
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(course._id)}
                                className="text-red-600"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )}
                />

                {/* Empty state */}
                {data?.data.length === 0 && (
                    <div className="p-6 text-center text-gray-500">
                        No courses available
                    </div>
                )}
            </div>
        </div>
    );
}
