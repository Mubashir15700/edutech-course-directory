import type { CourseFormState } from "../../../types/course";

interface MetadataSectionProps {
    durationError: string;
    categoryError: string;
    levelError: string;
    form: CourseFormState,
    setForm: (value: React.SetStateAction<CourseFormState>) => void;
}

const MetadataSection = ({ form, setForm, durationError, categoryError, levelError }: MetadataSectionProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Duration</label>
                <input
                    placeholder="e.g., 24 hours total"
                    value={form.duration}
                    className="border p-3 rounded-lg focus:outline-blue-500"
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
                {durationError && <p className="text-red-600 text-xs mt-1">{durationError}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Category</label>
                <input
                    placeholder="e.g., Web Development"
                    value={form.category}
                    className="border p-3 rounded-lg focus:outline-blue-500"
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
                {categoryError && <p className="text-red-600 text-xs mt-1">{categoryError}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Difficulty Level</label>
                <select
                    value={form.level}
                    className="border p-3 rounded-lg bg-white focus:outline-blue-500"
                    onChange={(e) => setForm({ ...form, level: e.target.value as any })}
                >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
                {levelError && <p className="text-red-600 text-xs mt-1">{levelError}</p>}
            </div>
        </div>
    );
}

export default MetadataSection;
