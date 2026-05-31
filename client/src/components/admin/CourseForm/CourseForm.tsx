import { useState, useEffect } from "react";
import { createCourseSchema } from "../../../validations/courseValidation";
import { useGetCourseByIdQuery } from "../../../features/courses/coursesApi";
import type { Course } from "../../../features/courses/types";
import CourseLoading from "../../LoadingSpinner";
import CourseNotFound from "../../CourseNotFound";
import type { CourseFormState } from "../../../types/course";
import { createInitialFormState, initialFormState } from "./CourseForm.utils";
import IdentityDetailsSection from "./IdentityDetailsSection";
import MetadataSection from "./MetadataSection";
import PriceThumbnailSection from "./PriceThumbnailSection";
import TagSection from "./TagSection";
import NestedLessonsSections from "./NestedLessonsSections";
import BackButton from "../../BackButton";

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
    // If 'id' is empty or missing, RTK Query will skip the network request entirely
    const { data: course, isLoading: isCourseLoading, error } = useGetCourseByIdQuery({ id: initialData?._id || "" }, {
        skip: !initialData?._id,
    });

    const [form, setForm] = useState<CourseFormState>(initialFormState);
    // States for video processing loaders
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    // Dynamic state for adding a single lesson to the array

    useEffect(() => {
        // Prioritize the freshly fetched async data from RTK Query, fallback to initialData
        const sourceData = course?.data || initialData;

        if (sourceData) {
            setForm(createInitialFormState(sourceData as Partial<CourseFormState>));
        }
    }, [course, initialData]);

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
        <div className="min-h-screen bg-gray-50 flex justify-center items-center flex-col py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                <BackButton goTo="/admin/courses" text="Go Back" />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    {title}
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-[70vh] max-h-[70vh] overflow-y-auto pr-2">
                    {/* Course Identity Details */}
                    <IdentityDetailsSection
                        nameError={errors.name}
                        instructorError={errors.instructor}
                        form={form}
                        setForm={setForm}
                    />

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
                    <MetadataSection
                        durationError={errors.duration}
                        categoryError={errors.category}
                        levelError={errors.level}
                        form={form}
                        setForm={setForm}
                    />

                    {/* Price, Thumbnail & Rating */}
                    <PriceThumbnailSection
                        priceError={errors.price}
                        thumbnailError={errors.thumbnail}
                        form={form}
                        setForm={setForm}
                    />

                    {/* Interactive Tag Management */}
                    <TagSection
                        form={form}
                        setForm={setForm}
                        tagsError={errors.tags}
                    />

                    <hr className="my-2 border-gray-200" />

                    {/* Interactive Nested Lessons Manager */}
                    <NestedLessonsSections
                        isUploadingVideo={isUploadingVideo}
                        setIsUploadingVideo={setIsUploadingVideo}
                        errors={errors}
                        setErrors={setErrors}
                        form={form}
                        setForm={setForm}
                    />

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
