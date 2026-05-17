import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    useGetCoursesQuery,
    useUpdateCourseMutation,
} from "../../features/courses/coursesApi";

export default function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data } = useGetCoursesQuery({
        page: 1,
        limit: 100,
        search: "",
        category: "",
    });

    const [updateCourse] = useUpdateCourseMutation();

    const [form, setForm] = useState<any>({});

    useEffect(() => {
        const course = data?.data.find((c) => c._id === id);
        if (course) setForm(course);
    }, [data, id]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await updateCourse({ id, ...form }).unwrap(); // throws if error
            navigate("/admin"); // only runs on success
        } catch (err) {
            console.error("Failed to update course", err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl mb-4">Edit Course</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
                <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input value={form.instructor || ""} onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
                <input value={form.duration || ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                <input value={form.category || ""} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <input type="number" value={form.rating || 0} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />

                <button className="bg-blue-500 text-white py-2 rounded">
                    Update
                </button>
            </form>
        </div>
    );
}
