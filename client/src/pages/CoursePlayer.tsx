import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompleteLessonMutation, useGetProfileQuery } from "../features/users/usersApi";
import { LessonQuiz } from "../components/LessonQuiz";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast, { type ToastType } from "../components/Toast";
import { useGetCourseByIdQuery } from "../features/courses/coursesApi";

export default function CoursePlayer() {
    const { id: courseId, lessonId } = useParams();
    const navigate = useNavigate();

    // Public Course Fetch: Always get the layout details regardless of login status
    const { data: course, isLoading: isCourseLoading } = useGetCourseByIdQuery({ id: courseId as string });

    // Lazy User Profile Fetch: Used for completing lessons & checking premium blocks
    const token = localStorage.getItem("token");
    const { data: user, isLoading: isUserLoading } = useGetProfileQuery(undefined, { skip: !token });

    const [completeLesson] = useCompleteLessonMutation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const lessons = course?.data?.lessons || [];

    // Find current active lesson based on URL context parameters
    const activeLesson = lessons.find((l: any) => l._id === lessonId) || lessons[0];
    const currentLessonIndex = lessons.findIndex((l: any) => l._id === activeLesson?._id);

    // Guardrail evaluation check states
    const isAlreadyEnrolled = user?.enrolledCourses?.some((c: any) => c._id === courseId);
    const isFreePreview = activeLesson?.isFreePreview;

    // Check if user has completed this specific node item safely
    const userCourseTrack = user?.enrolledCourses?.find((c: any) => c._id === courseId);
    const completedLessons = userCourseTrack?.completedLessons || [];
    const isCurrentLessonCompleted = completedLessons.includes(activeLesson?._id as string);
    const isAllLessonsCompleted = completedLessons.length === lessons.length && lessons.length > 0;

    // Safe Fallback Math Calculations for User Metrics
    const totalLessonsCount = lessons.length;
    const completedLessonsCount = completedLessons.length;
    const calculatedProgress = totalLessonsCount > 0
        ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
        : 0;

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    // Handle automated router parameter sync
    const handleLessonTransition = (targetId: string) => {
        navigate(`/courses/${courseId}/lecture/${targetId}`);
    };

    // Sync Hook: If a user lands exactly on `/courses/:id/lecture` without an active ID parameter, force-route them onto lesson 1
    useEffect(() => {
        if (!lessonId && lessons.length > 0) {
            handleLessonTransition(lessons[0]._id as string);
        }
    }, [lessonId, lessons]);

    if (isCourseLoading || (token && isUserLoading)) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isFreePreview && !isAlreadyEnrolled) {
        return (
            <div className="p-12 text-center max-w-md mx-auto flex flex-col items-center justify-center h-[60vh] bg-gray-950 text-slate-100">
                <span className="text-4xl mb-4">🔒</span>
                <h3 className="text-base font-bold text-gray-200">Premium Content Locked</h3>
                <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                    This technical lecture belongs to a premium instruction module. Please purchase enrollment access to unlock this stream framework node.
                </p>
                <button
                    onClick={() => navigate(`/courses/${courseId}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                    Return to Course Directory
                </button>
            </div>
        );
    }

    const handleCompleteLesson = async () => {
        if (!activeLesson || !token) return;
        try {
            await completeLesson({ courseId: courseId as string, lessonId: activeLesson._id as string }).unwrap();

            showToast("Lesson progress saved", "success");

            // Auto-advance by shifting URL parameter route paths
            if (currentLessonIndex < lessons.length - 1) {
                const nextLesson = lessons[currentLessonIndex + 1];
                handleLessonTransition(nextLesson._id as string);
            }
        } catch (error) {
            showToast("Failed to sync progress matrix", "error");
        }
    };

    return (
        <div className="flex h-screen flex-col bg-gray-950 text-slate-100 font-sans antialiased overflow-hidden select-none">

            {/* TOP HEADER LAYER */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-4 sm:px-6 backdrop-blur-md z-20">
                <div className="flex items-center space-x-3 min-w-0">
                    <button
                        onClick={() => navigate(`/courses/${courseId}`)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-gray-400 transition-all hover:bg-gray-700 hover:text-white"
                    >
                        ←
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-gray-400">
                            <span
                                className="truncate max-w-[80px] sm:max-w-none hover:underline cursor-pointer"
                                onClick={() => navigate("/my-learning")}
                            >
                                My Learning
                            </span>
                            <span>/</span>
                            {/* Safe fallbacks targeting the base course data matrix */}
                            <span className="truncate text-gray-300">{course?.data?.category || "Course"}</span>
                        </div>
                        <h2 className="truncate text-xs sm:text-sm font-semibold tracking-tight text-white mt-0.5">
                            {course?.data?.name || "Loading Course..."}
                        </h2>
                    </div>
                </div>

                {/* Top Metrics + Syllabus Trigger for Mobile */}
                <div className="flex items-center space-x-3 shrink-0">
                    {isAlreadyEnrolled && (
                        <>
                            <div className="hidden sm:block text-right">
                                <p className="text-xs text-gray-400">Course Progress</p>
                                <p className="text-sm font-bold text-blue-400 mt-0.5">{calculatedProgress}% Complete</p>
                            </div>
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-800 hidden md:block">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                                    style={{ width: `${calculatedProgress}%` }}
                                />
                            </div>
                        </>
                    )}

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex md:hidden h-9 items-center space-x-1.5 rounded-xl bg-blue-600/10 px-3 border border-blue-500/20 text-xs font-semibold text-blue-400 active:scale-95 transition-all"
                    >
                        <span>📋</span>
                        <span>Syllabus</span>
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT VIEWPORT */}
            <div className="flex flex-1 overflow-hidden relative min-h-0">

                {/* Center / Left: Interactive Cinema Video Workspace */}
                <main className="flex-1 overflow-y-auto bg-gray-900/10 p-4 sm:p-6 lg:p-8 custom-scrollbar">
                    {activeLesson ? (
                        <div className="mx-auto w-full max-w-4xl space-y-6 pb-12">
                            <div className="group relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gray-800/80 bg-black shadow-2xl transition-all duration-300">
                                {activeLesson.videoUrl ? (
                                    <video
                                        key={activeLesson._id as string}
                                        src={activeLesson.videoUrl}
                                        controls
                                        className="h-full w-full object-contain"
                                        autoPlay
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center space-y-2 bg-gray-950 text-center p-4">
                                        <div className="text-2xl">🎬</div>
                                        <p className="text-xs text-gray-400">No media asset allocated to this curriculum block.</p>
                                    </div>
                                )}
                            </div>

                            {/* Video Title Block Metadata */}
                            <div className="space-y-1.5 pl-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-blue-400 border border-blue-500/10">
                                        Lesson {currentLessonIndex + 1} of {lessons.length}
                                    </span>
                                    {isFreePreview && !isAlreadyEnrolled && (
                                        <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-xs text-emerald-400 border border-emerald-500/10 uppercase tracking-wider font-bold">
                                            🎬 Free Preview Mode
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-base font-bold tracking-tight text-white sm:text-xl lg:text-2xl mt-1.5 line-clamp-2">
                                    {activeLesson.title}
                                </h1>
                            </div>

                            {/* AI Interactive Component Workspace Container */}
                            <div className="border-t border-gray-800/60 pt-6">
                                <LessonQuiz
                                    courseId={courseId}
                                    lessonId={activeLesson._id as string}
                                    showToast={showToast}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center space-y-2 text-gray-500">
                            <span>📭</span>
                            <p className="text-xs">No curriculum elements mapped to this workstation target.</p>
                        </div>
                    )}
                </main>

                {/* Right Panel/Mobile Overlay: Responsive Syllabus Checklist */}
                <aside className={`
        fixed md:static inset-y-0 right-0 z-30 flex w-80 transform flex-col border-l border-gray-800 bg-gray-950 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0 md:flex h-full
    `}>
                    <div className="p-4 border-b border-gray-800 bg-gray-900/20 flex items-center justify-between shrink-0">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Course Syllabus</h3>
                            {isAlreadyEnrolled ? (
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                    {completedLessonsCount} / {totalLessonsCount} Lessons Finished
                                </p>
                            ) : (
                                <p className="text-[11px] text-emerald-500 font-medium mt-0.5">
                                    Preview Access Tier active
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-900/60 custom-scrollbar">
                        {lessons.map((lesson: any, index: number) => {
                            const isDone = completedLessons.includes(lesson._id);
                            const isActive = currentLessonIndex === index;
                            const canClick = lesson.isFreePreview || isAlreadyEnrolled;

                            return (
                                <button
                                    key={lesson._id}
                                    disabled={!canClick}
                                    onClick={() => {
                                        handleLessonTransition(lesson._id);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`w-full text-left p-4 text-xs transition-all duration-200 flex items-start justify-between gap-3 ${isActive
                                        ? "bg-blue-600/10 text-blue-400 font-semibold border-l-2 border-blue-500 pl-3.5"
                                        : canClick
                                            ? "hover:bg-gray-900/50 text-gray-300 hover:text-gray-100"
                                            : "opacity-40 cursor-not-allowed text-gray-600 bg-gray-950"
                                        }`}
                                >
                                    <div className="min-w-0 space-y-1">
                                        <p className={`truncate ${isActive ? "text-blue-400" : "text-gray-300"}`}>
                                            {index + 1}. {lesson.title}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-gray-500">⏱️ {lesson.duration}</span>
                                            {lesson.isFreePreview && !isAlreadyEnrolled && (
                                                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">Free</span>
                                            )}
                                        </div>
                                    </div>
                                    {isDone && (
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                                            ✓
                                        </span>
                                    )}
                                    {!canClick && <span className="text-[11px] opacity-70">🔒</span>}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Mobile Backdrop Overlay Blur */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
                    />
                )}
            </div>

            {/* BOTTOM MANAGEMENT DOCK LAYER */}
            <footer className="flex h-16 shrink-0 items-center justify-between border-t border-gray-800 bg-gray-950 px-4 sm:px-6 z-10 gap-2">
                <div className="flex items-center space-x-2">
                    <button
                        disabled={currentLessonIndex === 0}
                        onClick={() => handleLessonTransition(lessons[currentLessonIndex - 1]._id as string)} // 🛠️ Fixed: Navigate with router
                        className="h-9 px-3 text-[11px] sm:text-xs font-medium rounded-xl border border-gray-800 text-gray-300 hover:bg-gray-900 disabled:opacity-30 transition-all select-none"
                    >
                        <span className="hidden sm:inline">Previous Lesson</span>
                        <span className="inline sm:hidden">Prev</span>
                    </button>
                    <button
                        disabled={currentLessonIndex === lessons.length - 1}
                        onClick={() => {
                            // Guard check: Don't let users advance past a preview into premium locks via buttons
                            const nextLesson = lessons[currentLessonIndex + 1];
                            if (nextLesson.isFreePreview || isAlreadyEnrolled) {
                                handleLessonTransition(nextLesson._id as string);
                            } else {
                                showToast("Next lesson is premium. Enroll to unlock!", "error");
                            }
                        }}
                        className="h-9 px-3 text-[11px] sm:text-xs font-medium rounded-xl border border-gray-800 text-gray-300 hover:bg-gray-900 disabled:opacity-30 transition-all select-none"
                    >
                        <span className="hidden sm:inline">Next Lesson</span>
                        <span className="inline sm:hidden">Next</span>
                    </button>
                </div>

                {/* Primary Core Action Component Button */}
                <div>
                    {isAlreadyEnrolled ? (
                        isCurrentLessonCompleted ? (
                            <div className="flex h-9 items-center space-x-1.5 rounded-xl bg-emerald-500/10 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                                <span>🎉</span>
                                <span>Done</span>
                            </div>
                        ) : (
                            <button
                                className="h-9 px-3 sm:px-5 text-[11px] sm:text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/10 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all"
                                onClick={handleCompleteLesson}
                                disabled={isAllLessonsCompleted}
                            >
                                <span className="hidden sm:inline">Mark Complete & Continue</span>
                                <span className="inline sm:hidden">Complete</span>
                            </button>
                        )
                    ) : (
                        /* If user is a guest viewing preview, trade mark complete button for a checkout shortcut */
                        <button
                            className="h-9 px-4 sm:px-5 text-[11px] sm:text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all"
                            onClick={() => navigate(`/courses/${courseId}`)}
                        >
                            Enroll to Unlock Full Course
                        </button>
                    )}
                </div>
            </footer>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
