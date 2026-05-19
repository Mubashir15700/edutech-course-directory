import { useState } from "react";
import { Link } from "react-router-dom";
import {
    useGetCoursesQuery,
    useDeleteCourseMutation,
} from "../../features/courses/coursesApi";
import type { Course } from "../../features/courses/types";
import Table, { type Column } from "../../components/admin/Table";
import Pagination from "../../components/Pagination";
import Filters from "../../components/Filters";

export default function CoursesPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

    const { data, isLoading, error } = useGetCoursesQuery({
        page: currentPage,
        limit: 10,
        search,
        category,
    });

    const sortedCourses = [...(data?.data || [])].sort((a, b) => {
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "name") return a.name.localeCompare(b.name);
        return 0;
    });

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this course?"))
            return;

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

            <Filters
                search={search}
                category={category}
                setCategory={setCategory}
                setSearch={setSearch}
                setSort={setSort}
                sort={sort}
            />

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <Table
                    columns={columns}
                    data={sortedCourses}
                    renderActions={(course) => (
                        <div className="flex justify-end gap-3">
                            <Link
                                to={`/admin/edit/${course._id}`}
                                className="text-blue-600"
                            >
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
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                setCurrentPage={setCurrentPage}
                marginTop="mt-6"
            />
        </div>
    );
}
