import { useState } from "react";
import type { CourseFormState } from "../../../types/course";

interface TagSectionProps {
    tagsError: string;
    form: CourseFormState,
    setForm: (value: React.SetStateAction<CourseFormState>) => void;
}

const TagSection = ({ tagsError, form, setForm }: TagSectionProps) => {
    const [tagInput, setTagInput] = useState("");

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
            e.preventDefault();
            const cleanedTag = tagInput.replace(",", "").trim();
            if (!form.tags.includes(cleanedTag)) {
                setForm({ ...form, tags: [...form.tags, cleanedTag] });
            }
            setTagInput("");
        }
    };

    const handleRemoveTag = (indexToRemove: number) => {
        setForm({ ...form, tags: form.tags.filter((_, i) => i !== indexToRemove) });
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Course Tags</label>
            <input
                placeholder="Type a tag and press Enter or Comma (,)"
                value={tagInput}
                className="border p-3 rounded-lg focus:outline-blue-500"
                onKeyDown={handleAddTag}
                onChange={(e) => setTagInput(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 border border-gray-200">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(idx)} className="text-gray-400 hover:text-red-500 font-bold ml-1">×</button>
                    </span>
                ))}
            </div>
            {tagsError && <p className="text-red-600 text-xs mt-1">{tagsError}</p>}
        </div>
    )
}

export default TagSection