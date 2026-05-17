import { useState } from "react";
import { useCreateCourseMutation } from "../../features/courses/coursesApi";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
    const [form, setForm] = useState({
        name: "",
        instructor: "",
        duration: "",
        category: "",
        rating: 0,
    });

    const [createCourse] = useCreateCourseMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await createCourse(form).unwrap(); // throws if error
            navigate("/admin"); // only runs on success
        } catch (err) {
            console.error("Failed to create course", err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl mb-4">Add Course</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
                <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Instructor" onChange={(e) => setForm({ ...form, instructor: e.target.value })} />
                <input placeholder="Duration" onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                <input placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <input type="number" placeholder="Rating" onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />

                <button className="bg-blue-500 text-white py-2 rounded">
                    Create
                </button>
            </form>
        </div>
    );
}
