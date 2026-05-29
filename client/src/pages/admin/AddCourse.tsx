import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCourseMutation } from "../../features/courses/coursesApi";
import CourseForm from "../../components/admin/CourseForm/CourseForm";
import type { ToastType } from "../../components/Toast";
import Toast from "../../components/Toast";

export default function AddCourse() {
    const [createCourse, { isLoading }] = useCreateCourseMutation();
    const navigate = useNavigate();

    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    const handleCreate = async (data: any) => {
        try {
            await createCourse(data).unwrap();
            showToast("Created course successfully", "success");
            navigate("/admin");

        } catch (err) {
            showToast("Failed to create course", "error");
        }
    };

    return (
        <>
            <CourseForm
                title="Add Course 📚"
                onSubmit={handleCreate}
                isLoading={isLoading}
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
