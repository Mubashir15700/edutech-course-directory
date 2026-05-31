import type { CourseFormState } from "../../../types/course";

interface IdentityDetailsSectionProps {
    nameError: string;
    instructorError: string;
    form: CourseFormState,
    setForm: (value: React.SetStateAction<CourseFormState>) => void;
};

const IdentityDetailsSection = ({ nameError, instructorError, form, setForm }: IdentityDetailsSectionProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Course Name</label>
                <input
                    placeholder="e.g., Full-Stack React Mastery"
                    value={form.name}
                    className="border p-3 rounded-lg focus:outline-blue-500"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {nameError && <p className="text-red-600 text-xs mt-1">{nameError}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Instructor</label>
                <input
                    placeholder="e.g., Sarah Jenkins"
                    value={form.instructor}
                    className="border p-3 rounded-lg focus:outline-blue-500"
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                />
                {instructorError && <p className="text-red-600 text-xs mt-1">{instructorError}</p>}
            </div>
        </div>
    );
}

export default IdentityDetailsSection;
