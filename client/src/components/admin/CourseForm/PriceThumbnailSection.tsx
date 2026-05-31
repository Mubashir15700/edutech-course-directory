import type { CourseFormState } from "../../../types/course";

interface PriceThumbnailSectionProps {
    priceError: string;
    thumbnailError: string;
    form: CourseFormState,
    setForm: (value: React.SetStateAction<CourseFormState>) => void;
}

const PriceThumbnailSection = ({ priceError, thumbnailError, form, setForm }: PriceThumbnailSectionProps) => {
    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm({ ...form, thumbnail: e.target.files[0] as any }); // Save the binary File object directly
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Price ($)</label>
                <input
                    type="number"
                    step="0.01"
                    placeholder="0 for Free"
                    value={form.price}
                    className="border p-3 rounded-lg focus:outline-blue-500"
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                />
                {priceError && <p className="text-red-600 text-xs mt-1">{priceError}</p>}
            </div>

            {/* URL String input transformed into binary multi-part File Selector */}
            <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Course Thumbnail Image</label>
                <div className="border p-2 rounded-lg bg-white flex items-center gap-3">
                    <input
                        type="file"
                        accept="image/*"
                        className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer flex-1 w-full"
                        onChange={handleThumbnailChange}
                    />
                    {form.thumbnail && typeof form.thumbnail !== "string" && (
                        <span className="text-[11px] bg-blue-50 text-blue-600 font-medium px-2 py-1 rounded truncate max-w-[180px]">
                            📁 {(form.thumbnail as any).name}
                        </span>
                    )}
                </div>
                {thumbnailError && <p className="text-red-600 text-xs mt-1">{thumbnailError}</p>}
            </div>
        </div>
    );
}

export default PriceThumbnailSection;
