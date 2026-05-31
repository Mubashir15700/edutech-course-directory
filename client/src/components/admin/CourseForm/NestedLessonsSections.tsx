import { useRef, useState } from "react";
import axios from "axios";
import { emptyLesson } from "./CourseForm.utils";
import type { CourseFormState } from "../../../types/course";
import type { LessonInput } from "../../../validations/courseValidation";

interface NestedLessonsSectionsProps {
    isUploadingVideo: boolean;
    setIsUploadingVideo: React.Dispatch<React.SetStateAction<boolean>>;
    errors: {
        [key: string]: string;
    };
    setErrors: React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>;
    form: CourseFormState,
    setForm: (value: React.SetStateAction<CourseFormState>) => void;
}

const NestedLessonsSections = ({ isUploadingVideo, setIsUploadingVideo, errors, setErrors, form, setForm }: NestedLessonsSectionsProps) => {
    const videoInputRef = useRef<HTMLInputElement>(null);

    const [videoProgress, setVideoProgress] = useState(0);
    const [currentLesson, setCurrentLesson] = useState<LessonInput>(emptyLesson);

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

    return (
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
    );
}

export default NestedLessonsSections;
