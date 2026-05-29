import { useState } from "react";
import { Link } from "react-router-dom";
import {
    useGetCoursesQuery,
    useToggleArchiveCourseMutation,
} from "../../features/courses/coursesApi";
import type { Course } from "../../features/courses/types";
import Table, { type Column } from "../../components/admin/Table";
import Pagination from "../../components/Pagination";
import Filters from "../../components/Filters";
import LoadingSpinner from "../../components/LoadingSpinner";
import ConfirmationModal from "../../components/ConfirmationModal";
import type { ToastType } from "../../components/Toast";
import Toast from "../../components/Toast";

export default function CoursesPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [toggleData, setToggleData] = useState<{
        courseId: string | null,
        isArchived: boolean
    }>({
        courseId: null,
        isArchived: false
    });
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    const [toggleArchiveCourse, { isLoading: isArchiving }] = useToggleArchiveCourseMutation();

    const { data, isLoading, error } = useGetCoursesQuery({
        page: currentPage,
        limit: 10,
        search,
        category,
        isAdmin: true,
    });

    const sortedCourses = [...(data?.data || [])].sort((a, b) => {
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "name") return a.name.localeCompare(b.name);
        return 0;
    });

    const handleShowConfirmModal = (id: string, isArchived: boolean) => {
        setToggleData({
            courseId: id,
            isArchived
        });

        setShowModal(true);
    }

    const handleToggleArchive = async () => {
        try {
            await toggleArchiveCourse(toggleData.courseId).unwrap();

            showToast("Toggle archive success", "success");
        } catch (err) {
            showToast("Toggle archive failed", "error");

        }

        setShowModal(false);
    };

    if (isLoading) return <LoadingSpinner />;

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
                                onClick={() => handleShowConfirmModal(course._id, course.isArchived)}
                                className="text-red-600"
                            >
                                {isArchiving ? "Toggling..." : course.isArchived ? "Unarchive" : "Archive"}
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

            <ConfirmationModal
                isOpen={showModal}
                isLoading={isLoading || isArchiving}
                onClose={() => setShowModal(false)}
                onConfirm={handleToggleArchive}
                title={toggleData.isArchived ? "Unarchive Course Catalog" : "Archive Course Catalog"}
                message={toggleData.isArchived
                    ? "Are you sure you want to unarchive this course? It will immediately become visible to search metrics and active learners."
                    : "Are you sure you want to archive this course? This hides the module from discovery pages without deleting existing learner histories."}
                confirmLabel={toggleData.isArchived ? "Yes, Restore" : "Yes, Archive"}
                cancelLabel="Go Back"
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
