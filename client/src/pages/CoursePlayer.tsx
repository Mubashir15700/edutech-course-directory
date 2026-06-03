import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProfileQuery, useCompleteLessonMutation } from "../features/users/usersApi";
import { LessonQuiz } from "../components/LessonQuiz";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast, { type ToastType } from "../components/Toast";

export default function CoursePlayer() {
    const { id: courseId } = useParams();
    const { data: user, isLoading } = useGetProfileQuery();
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [completeLesson] = useCompleteLessonMutation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen col-span-full">
                <LoadingSpinner />
            </div>
        )
    };
    if (!user) return <div className="p-12 text-center text-red-500">Please log in to continue.</div>;

    const activeCourseTrack = user.enrolledCourses?.find((c: any) => c._id === courseId);

    if (!activeCourseTrack) {
        return <div className="p-12 text-center text-red-400">Access Denied. You are not enrolled here.</div>;
    }

    const lessons = activeCourseTrack.lessons || [];
    const activeLesson = lessons[currentLessonIndex];
    const completedLessons = activeCourseTrack.completedLessons || [];
    const isAllLessonsCompleted = completedLessons.length === lessons.length;

    const handleCompleteLesson = async () => {
        if (!activeLesson) return;
        try {
            await completeLesson({ courseId: activeCourseTrack._id, lessonId: activeLesson._id }).unwrap();
            // Auto-advance to the next lesson after marking complete
            if (currentLessonIndex < lessons.length - 1) {
                setCurrentLessonIndex(prev => prev + 1);
            }

            showToast("Lesson completed successfully", "success");
        } catch (error) {
            showToast("Failed to complete lesson", "error");
        }
    };

    return (
        <div className="flex h-screen flex-col bg-gray-950 text-slate-100 font-sans antialiased overflow-hidden select-none">

            {/* TOP HEADER LAYER */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-4 sm:px-6 backdrop-blur-md z-20">
                <div className="flex items-center space-x-3 min-w-0">
                    <Link
                        to={`/courses/${activeCourseTrack._id}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-800 text-gray-400 transition-all hover:bg-gray-700 hover:text-white"
                    >
                        ←
                    </Link>
                    <div className="min-w-0">
                        <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-gray-400">
                            <span className="truncate max-w-[80px] sm:max-w-none hover:underline cursor-pointer">My Courses</span>
                            <span>/</span>
                            <span className="truncate text-gray-300">{activeCourseTrack.category}</span>
                        </div>
                        <h2 className="truncate text-xs sm:text-sm font-semibold tracking-tight text-white mt-0.5">
                            {activeCourseTrack.name}
                        </h2>
                    </div>
                </div>

                {/* Top Metrics + Syllabus Trigger for Mobile */}
                <div className="flex items-center space-x-3 shrink-0">
                    <div className="hidden sm:block text-right">
                        <p className="text-xs text-gray-400">Course Progress</p>
                        <p className="text-sm font-bold text-blue-400 mt-0.5">{activeCourseTrack.progress}% Complete</p>
                    </div>
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-800 hidden md:block">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                            style={{ width: `${activeCourseTrack.progress}%` }}
                        />
                    </div>

                    {/* 📱 Mobile Toggle: Visible only on smaller layout viewports */}
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
            <div className="flex flex-1 overflow-hidden relative">

                {/* Center / Left: Interactive Cinema Video Workspace */}
                <main className="flex flex-1 flex-col overflow-y-auto bg-gray-900/20 p-4 sm:p-6 lg:p-8 justify-center">
                    {activeLesson ? (
                        <div className="mx-auto w-full max-w-4xl space-y-4 my-auto">
                            <div className="group relative aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl border border-gray-800/80 bg-black shadow-2xl transition-all duration-300">
                                {activeLesson.videoUrl ? (
                                    <video
                                        key={activeLesson._id}
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

                            <div className="space-y-1 pl-0.5">
                                <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-blue-400 border border-blue-500/10">
                                    Lesson {currentLessonIndex + 1} of {lessons.length}
                                </span>
                                <h1 className="text-base font-bold tracking-tight text-white sm:text-xl lg:text-2xl mt-1.5 line-clamp-2">
                                    {activeLesson.title}
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 w-full">
                                <div className="mt-7">
                                    {/* New interactive AI companion */}
                                    <LessonQuiz courseId={courseId} lessonId={activeLesson._id} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="m-auto flex flex-col items-center justify-center space-y-2 text-gray-500">
                            <span>📭</span>
                            <p className="text-xs">No curriculum elements mapped to this workstation target.</p>
                        </div>
                    )}
                </main>

                {/* Right Panel/Mobile Overlay: Responsive Syllabus Checklist */}
                <aside className={`
                    fixed md:static inset-y-0 right-0 z-30 flex w-80 transform flex-col border-l border-gray-800 bg-gray-950 transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
                    md:translate-x-0 md:flex
                `}>
                    <div className="p-4 border-b border-gray-800 bg-gray-900/20 flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Course Syllabus</h3>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                                {activeCourseTrack.completedLessonsCount} / {activeCourseTrack.totalLessons} Lessons Finished
                            </p>
                        </div>
                        {/* Mobile Close Handle Overlay Button */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-900/60">
                        {lessons.map((lesson: any, index: number) => {
                            const isDone = completedLessons.includes(lesson._id);
                            const isActive = currentLessonIndex === index;

                            return (
                                <button
                                    key={lesson._id}
                                    onClick={() => {
                                        setCurrentLessonIndex(index);
                                        setIsSidebarOpen(false); // Auto-closes sidebar drawer on click for phone sizes
                                    }}
                                    className={`w-full text-left p-4 text-xs transition-all duration-200 flex items-start justify-between gap-3 ${isActive
                                        ? "bg-blue-600/10 text-blue-400 font-semibold border-l-2 border-blue-500 pl-3.5"
                                        : "hover:bg-gray-900/50 text-gray-400 hover:text-gray-200"
                                        }`}
                                >
                                    <div className="min-w-0 space-y-1">
                                        <p className={`truncate ${isActive ? "text-blue-400" : "text-gray-300"}`}>
                                            {index + 1}. {lesson.title}
                                        </p>
                                        <p className="text-[10px] text-gray-500 flex items-center">
                                            ⏱️ {lesson.duration}
                                        </p>
                                    </div>
                                    {isDone && (
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                                            ✓
                                        </span>
                                    )}
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
                        onClick={() => setCurrentLessonIndex(prev => prev - 1)}
                        className="h-9 px-3 text-[11px] sm:text-xs font-medium rounded-xl border border-gray-800 text-gray-300 hover:bg-gray-900 disabled:opacity-30 transition-all select-none"
                    >
                        {/* Text adjustments for compact screens */}
                        <span className="hidden sm:inline">Previous Lesson</span>
                        <span className="inline sm:hidden">Prev</span>
                    </button>
                    <button
                        disabled={currentLessonIndex === lessons.length - 1}
                        onClick={() => setCurrentLessonIndex(prev => prev + 1)}
                        className="h-9 px-3 text-[11px] sm:text-xs font-medium rounded-xl border border-gray-800 text-gray-300 hover:bg-gray-900 disabled:opacity-30 transition-all select-none"
                    >
                        <span className="hidden sm:inline">Next Lesson</span>
                        <span className="inline sm:hidden">Next</span>
                    </button>
                </div>

                {/* Primary Core Action Component Button */}
                <div>
                    {completedLessons.includes(activeLesson?._id) ? (
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
