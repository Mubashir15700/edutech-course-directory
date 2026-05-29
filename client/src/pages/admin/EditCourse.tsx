import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useGetCoursesQuery,
    useUpdateCourseMutation,
} from "../../features/courses/coursesApi";
import CourseForm from "../../components/admin/CourseForm/CourseForm";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { ToastType } from "../../components/Toast";
import Toast from "../../components/Toast";

export default function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    const { data, isLoading } = useGetCoursesQuery({
        page: 1,
        limit: 100,
        search: "",
        category: "",
    });

    const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

    const course = data?.data.find((c) => c._id === id);

    const handleUpdate = async (form: any) => {
        try {
            await updateCourse({ id, ...form }).unwrap();
            showToast("Edited course successfully", "success");
            navigate("/admin");
        } catch (err) {
            showToast("Failed to update course", "error");
        }
    };

    if (isLoading || !course) {
        return (
            <div className="flex justify-center items-center h-screen col-span-full">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <>
            <CourseForm
                title="Edit Course ✏️"
                initialData={course}
                onSubmit={handleUpdate}
                isLoading={isUpdating}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}
