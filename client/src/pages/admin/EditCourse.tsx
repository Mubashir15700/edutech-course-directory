import { useNavigate, useParams } from "react-router-dom";
import {
    useGetCoursesQuery,
    useUpdateCourseMutation,
} from "../../features/courses/coursesApi";
import CourseForm from "../../components/admin/CourseForm";

export default function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();

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
            navigate("/admin");
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading || !course)
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-lg font-semibold">Loading course...</p>
            </div>
        );

    return (
        <CourseForm
            title="Edit Course ✏️"
            initialData={course}
            onSubmit={handleUpdate}
            isLoading={isUpdating}
        />
    );
}
