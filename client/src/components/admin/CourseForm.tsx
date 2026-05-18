import { useState, useEffect } from "react";

type Props = {
    initialData?: any;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
    title: string;
};

export default function CourseForm({
    initialData,
    onSubmit,
    isLoading,
    title,
}: Props) {
    const [form, setForm] = useState({
        name: "",
        instructor: "",
        duration: "",
        category: "",
        rating: 0,
    });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {title}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        placeholder="Course Name"
                        value={form.name}
                        className="border p-3 rounded-lg"
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    <input
                        placeholder="Instructor"
                        value={form.instructor}
                        className="border p-3 rounded-lg"
                        onChange={(e) =>
                            setForm({ ...form, instructor: e.target.value })
                        }
                    />

                    <input
                        placeholder="Duration"
                        value={form.duration}
                        className="border p-3 rounded-lg"
                        onChange={(e) =>
                            setForm({ ...form, duration: e.target.value })
                        }
                    />

                    <input
                        placeholder="Category"
                        value={form.category}
                        className="border p-3 rounded-lg"
                        onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                        }
                    />

                    <input
                        type="number"
                        value={form.rating}
                        className="border p-3 rounded-lg"
                        onChange={(e) =>
                            setForm({
                                ...form,
                                rating: Number(e.target.value),
                            })
                        }
                    />

                    <button
                        disabled={isLoading}
                        className="bg-blue-600 text-white py-3 rounded-lg"
                    >
                        {isLoading ? "Saving..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
