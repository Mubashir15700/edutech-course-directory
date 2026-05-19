import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetCourseByIdQuery } from "../features/courses/coursesApi";
import CourseLoading from "../components/CourseLoading";
import CourseNotFound from "../components/CourseNotFound";

export default function CourseDetails() {
    const { id } = useParams<{ id: string }>();
    const { data: course, isLoading, error } = useGetCourseByIdQuery(id || "");

    // UI State to toggle curriculum view visibility
    const [isCurriculumOpen, setIsCurriculumOpen] = useState(true);

    if (isLoading) return <CourseLoading />;
    if (error || !course) return <CourseNotFound />;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-16">
            {/* Top Navigation Banner */}
            <div className="max-w-6xl mx-auto px-4 mb-6 sm:px-6 lg:px-8">
                <Link to="/courses" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2">
                    ← Back to Course Directory
                </Link>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN: Main course content detailed breakdowns */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold tracking-wide uppercase">
                                {course.data.category}
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3 mb-4 leading-tight">
                                {course.data.name}
                            </h1>

                            {/* Meta Info row */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-4">
                                <p>Instructed by <span className="font-semibold text-gray-900">{course.data.instructor}</span></p>
                                <span className="text-gray-300">•</span>
                                <p className="flex items-center gap-1">⭐ <span className="font-semibold text-gray-900">{course.data.rating}</span></p>
                                <span className="text-gray-300">•</span>
                                <p className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase">{course.data.level}</p>
                            </div>

                            <h2 className="text-lg font-bold text-gray-900 mb-2">About This Course</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {course.data.description}
                            </p>

                            {/* Tags list component */}
                            <div className="flex flex-wrap gap-2 mt-6">
                                {course.data.tags.map((tag) => (
                                    <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* ACCORDION MODULE: Syllabus/Lessons array visualization */}
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setIsCurriculumOpen(!isCurriculumOpen)}
                                className="w-full flex items-center justify-between p-6 bg-white border-b border-gray-100 font-bold text-lg text-gray-900 hover:bg-gray-50/50 transition text-left"
                            >
                                <span>Course Curriculum ({course.data.lessons.length} lessons)</span>
                                <span className="text-gray-400 text-xl">{isCurriculumOpen ? "▲" : "▼"}</span>
                            </button>

                            {isCurriculumOpen && (
                                <div className="divide-y divide-gray-100">
                                    {course.data.lessons.map((lesson, idx) => (
                                        <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/30 transition">
                                            <div className="flex items-start gap-3">
                                                <span className="text-sm font-semibold text-gray-400 mt-0.5 w-5">
                                                    {String(idx + 1).padStart(2, "0")}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                                                    {lesson.isFreePreview && (
                                                        <span className="inline-block bg-green-50 text-green-700 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded mt-1">
                                                            Free Preview Lecture
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                                ⏱️ {lesson.duration}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky floating Purchase/Call to action card */}
                    <div className="lg:col-span-1 lg:sticky lg:top-6">
                        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden">
                            <img
                                src={course.data.thumbnail}
                                alt={course.data.name}
                                className="w-full h-48 object-cover border-b border-gray-100"
                            />

                            <div className="p-6">
                                <div className="mb-4">
                                    <span className="text-xs text-gray-400 uppercase font-bold block mb-0.5">Course Access</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-gray-900">
                                            {course.data.price === 0 ? "Free" : `$${course.data.price}`}
                                        </span>
                                        {course.data.price > 0 && <span className="text-sm text-gray-400 line-through">$149.99</span>}
                                    </div>
                                </div>

                                <ul className="space-y-3 text-sm text-gray-600 mb-6">
                                    <li className="flex items-center gap-2">⏱️ <span>{course.data.duration} structured video contents</span></li>
                                    <li className="flex items-center gap-2">♾️ <span>Full lifetime access guaranteed</span></li>
                                    <li className="flex items-center gap-2">📜 <span>Certificate of completion included</span></li>
                                </ul>

                                {/* Enrollment CTA with direct routing to mock checkout flow or auth login prompt */}
                                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition duration-200 text-center block">
                                    {course.data.price === 0 ? "Enroll for Free Now" : "Buy This Course"}
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    30-Day Money-Back Guarantee
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
