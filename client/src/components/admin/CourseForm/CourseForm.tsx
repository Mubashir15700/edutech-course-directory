import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { createCourseSchema } from "../../../validations/courseValidation";
import { useGetCourseByIdQuery } from "../../../features/courses/coursesApi";
import type { Course } from "../../../features/courses/types";
import CourseLoading from "../../LoadingSpinner";
import CourseNotFound from "../../CourseNotFound";
import type { CourseFormState, LessonInput } from "../../../types/course";
import { createInitialFormState, emptyLesson, initialFormState } from "./CourseForm.utils";

type CourseFormProps = {
    initialData?: Partial<CourseFormState> | Course;
    onSubmit: (data: CourseFormState) => void;
    isLoading?: boolean;
    title: string;
};

export default function CourseForm({
    initialData,
    onSubmit,
    isLoading,
    title,
}: CourseFormProps) {
    const videoInputRef = useRef<HTMLInputElement>(null);

    // If 'id' is empty or missing, RTK Query will skip the network request entirely
    const { data: course, isLoading: isCourseLoading, error } = useGetCourseByIdQuery({ id: initialData?._id || "" }, {
        skip: !initialData?._id,
    });

    const [form, setForm] = useState<CourseFormState>(initialFormState);
    const [tagInput, setTagInput] = useState("");
    // States for video processing loaders
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    // Dynamic state for adding a single lesson to the array
    const [currentLesson, setCurrentLesson] = useState<LessonInput>(emptyLesson);

    useEffect(() => {
        // Prioritize the freshly fetched async data from RTK Query, fallback to initialData
        const sourceData = course?.data || initialData;

        if (sourceData) {
            setForm(createInitialFormState(sourceData as Partial<CourseFormState>));
        }
    }, [course, initialData]);

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

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm({ ...form, thumbnail: e.target.files[0] as any }); // Save the binary File object directly
        }
    };

    const handleAddLesson = () => {
        if (!currentLesson.title || !currentLesson.duration) {
            setErrors(prev => ({ ...prev, lessons: "Lesson Title and Duration are required." }));
            return;
        }
        setForm({ ...form, lessons: [...form.lessons, currentLesson] });
        setCurrentLesson({ title: "", duration: "", videoUrl: "", isFreePreview: false });
        setErrors(prev => {
            const { lessons, ...rest } = prev;
            return rest;
        });
    };

    const handleRemoveLesson = (indexToRemove: number) => {
        setForm({ ...form, lessons: form.lessons.filter((_, i) => i !== indexToRemove) });
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("video", file); // Must match backend uploadVideo.single("video")

        try {
            setIsUploadingVideo(true);
            setVideoProgress(10);

            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/uploads/video", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
                    setVideoProgress(percent);
                }
            });

            // Save the clean returned Cloudinary URL string straight into the current lesson template
            setCurrentLesson({ ...currentLesson, videoUrl: response.data.videoUrl });
        } catch (error) {
            setErrors({
                ...errors,
                videoUrl: "Failed to upload the video file to the asset cloud library."
            });

            // Wipe the selected file path value clean out of DOM memory 
            if (videoInputRef.current) {
                videoInputRef.current.value = "";
            }

            // Reset the state string value just in case partial text was injected
            setCurrentLesson({ ...currentLesson, videoUrl: "" });
        } finally {
            setIsUploadingVideo(false);
            setVideoProgress(0);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure errors clear before fresh validation execution
        setErrors({});
        const result = createCourseSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        onSubmit(form);
    };

    if (isCourseLoading) return <CourseLoading />;
    if (error) return <CourseNotFound />;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {title}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-[70vh] max-h-[70vh] overflow-y-auto pr-2">
                    {/* Course Identity Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Course Name</label>
                            <input
                                placeholder="e.g., Full-Stack React Mastery"
                                value={form.name}
                                className="border p-3 rounded-lg focus:outline-blue-500"
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Instructor</label>
                            <input
                                placeholder="e.g., Sarah Jenkins"
                                value={form.instructor}
                                className="border p-3 rounded-lg focus:outline-blue-500"
                                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                            />
                            {errors.instructor && <p className="text-red-600 text-xs mt-1">{errors.instructor}</p>}
                        </div>
                    </div>

                    {/* Description Block */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            placeholder="Provide a comprehensive syllabus overview..."
                            value={form.description}
                            rows={3}
                            className="border p-3 rounded-lg focus:outline-blue-500"
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Metadata Options Line */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Duration</label>
                            <input
                                placeholder="e.g., 24 hours total"
                                value={form.duration}
                                className="border p-3 rounded-lg focus:outline-blue-500"
                                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                            />
                            {errors.duration && <p className="text-red-600 text-xs mt-1">{errors.duration}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Category</label>
                            <input
                                placeholder="e.g., Web Development"
                                value={form.category}
                                className="border p-3 rounded-lg focus:outline-blue-500"
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            />
                            {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
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
                            {errors.level && <p className="text-red-600 text-xs mt-1">{errors.level}</p>}
                        </div>
                    </div>

                    {/* Price, Thumbnail & Rating */}
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
                            {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
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
                            {errors.thumbnail && <p className="text-red-600 text-xs mt-1">{errors.thumbnail}</p>}
                        </div>
                    </div>

                    {/* Interactive Tag Management */}
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
                        {errors.tags && <p className="text-red-600 text-xs mt-1">{errors.tags}</p>}
                    </div>

                    <hr className="my-2 border-gray-200" />

                    {/* Interactive Nested Lessons Manager */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                        <h3 className="text-md font-bold text-gray-700">Curriculum Structure ({form.lessons.length} Lessons Added)</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                placeholder="Lesson Title"
                                value={currentLesson.title}
                                className="border p-2 rounded-lg text-sm bg-white"
                                onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                            />
                            <input
                                placeholder="Duration (e.g., 15 mins)"
                                value={currentLesson.duration}
                                className="border p-2 rounded-lg text-sm bg-white"
                                onChange={(e) => setCurrentLesson({ ...currentLesson, duration: e.target.value })}
                            />
                        </div>

                        {/* Single video tracking handler instead of typing arbitrary streaming strings */}
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col md:flex-row gap-3 items-center justify-between w-full">
                                <div className="flex-1 w-full border p-1.5 rounded-lg bg-white flex items-center gap-3">
                                    <input
                                        type="file"
                                        ref={videoInputRef}
                                        accept="video/mp4,video/mkv,video/quicktime"
                                        disabled={isUploadingVideo}
                                        className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer disabled:opacity-50 flex-1 w-full"
                                        onChange={handleVideoUpload}
                                    />
                                    {currentLesson.videoUrl && (
                                        <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-1 rounded truncate max-w-[220px]">
                                            🎥 Asset Cloud Linked
                                        </span>
                                    )}
                                </div>

                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none self-start md:self-auto shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={currentLesson.isFreePreview}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        onChange={(e) => setCurrentLesson({ ...currentLesson, isFreePreview: e.target.checked })}
                                    />
                                    Free Preview Video
                                </label>
                            </div>

                            {errors.videoUrl && <p className="text-red-600 text-xs mt-1">{errors.videoUrl}</p>}

                            {/* ⏳ Async Loading Progress UI Bar */}
                            {isUploadingVideo && (
                                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
                                    <div className="bg-blue-600 h-1.5 transition-all duration-300" style={{ width: `${videoProgress}%` }}></div>
                                    <p className="text-[11px] text-blue-600 font-semibold mt-1">Encoding and uploading video stream asset: {videoProgress}%</p>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleAddLesson}
                            className="bg-gray-800 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-900 transition-colors self-end"
                        >
                            + Add Lesson to Curriculum
                        </button>
                        {errors.lessons && <p className="text-red-600 text-xs font-semibold">{errors.lessons}</p>}

                        {/* List of currently added lessons inside state */}
                        {form.lessons.length > 0 && (
                            <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg bg-white divide-y">
                                {form.lessons.map((lesson, idx) => (
                                    <div key={idx} className="p-2.5 text-xs flex justify-between items-center hover:bg-gray-50">
                                        <div>
                                            <span className="font-semibold text-gray-700">{idx + 1}. {lesson.title}</span>
                                            <span className="text-gray-400 ml-2">({lesson.duration})</span>
                                            {lesson.isFreePreview && <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded font-semibold text-[10px]">PREVIEW</span>}
                                        </div>
                                        <button type="button" onClick={() => handleRemoveLesson(idx)} className="text-red-500 hover:underline font-medium">Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Final Form Execution Trigger */}
                    <button
                        disabled={isLoading || isUploadingVideo}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-md shadow transition-colors disabled:bg-blue-300 mt-2"
                    >
                        {isLoading ? "Saving changes..." : "Submit Course"}
                    </button>
                </form>
            </div>
        </div>
    );
}
