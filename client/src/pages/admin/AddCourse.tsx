import { useNavigate } from "react-router-dom";
import { useCreateCourseMutation } from "../../features/courses/coursesApi";
import CourseForm from "../../components/admin/CourseForm";

export default function AddCourse() {
    const [createCourse, { isLoading }] = useCreateCourseMutation();
    const navigate = useNavigate();

    const handleCreate = async (data: any) => {
        try {
            await createCourse(data).unwrap();
            navigate("/admin");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <CourseForm
            title="Add Course 📚"
            onSubmit={handleCreate}
            isLoading={isLoading}
        />
    );
}
