import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetProfileQuery, useUpdateProfileMutation } from "../features/users/usersApi";

export default function Profile() {
    const { data: user, isLoading } = useGetProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();
    const [activeTab, setActiveTab] = useState<"courses" | "settings">("courses");
    const [newName, setNewName] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    if (isLoading || !user) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50/50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            </div>
        );
    }

    // Dynamic frontend filter checking flat pre-calculated backend progress variables
    const completedCoursesCount = user.enrolledCourses
        ? user.enrolledCourses.filter(c => c.progress === 100).length
        : 0;

    const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        if (!newName) {
            setMessage({ type: "error", text: "Profile name cannot be empty." });
            return;
        }

        try {
            await updateProfile({ name: newName }).unwrap();

            const localUser = JSON.parse(localStorage.getItem("user") || "{}");

            localUser.name = newName;
            localStorage.setItem("user", JSON.stringify(localUser));

            setMessage({ type: "success", text: "Profile updated successfully." });
        } catch (err: any) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">

                {/* Profile Top Overview Header */}
                <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-md shadow-blue-500/10">
                        {user.name?.charAt(0)}
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Studying since {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : "Recent"}
                        </p>
                    </div>

                    {/* View Switch Navigation Tabs */}
                    <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200/20 self-stretch sm:self-center">
                        <button
                            onClick={() => setActiveTab("courses")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${activeTab === "courses" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            My Courses
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${activeTab === "settings" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                        >
                            Settings
                        </button>
                    </div>
                </div>

                {/* Primary Layout Switching Logic */}
                {activeTab === "courses" ? (
                    <div className="space-y-8">
                        {/* High-Level Analytical Tracker Summary Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Enrolled Programs</span>
                                <span className="text-3xl font-black text-gray-900 mt-1 block">{user.enrolledCourses ? user.enrolledCourses.length : 0}</span>
                            </div>
                            <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Completed Blocks</span>
                                <span className="text-3xl font-black text-gray-900 mt-1 block">{completedCoursesCount}</span>
                            </div>
                            <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Account standing</span>
                                <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg tracking-wide uppercase mt-2 inline-block">Active Status</span>
                            </div>
                        </div>

                        {/* Subscribed Course Tracking List */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Continuous Learning Programs</h2>

                            {!user.enrolledCourses || user.enrolledCourses.length === 0 ? (
                                <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-sm">
                                    <p className="text-gray-500 font-medium mb-4">You are not enrolled in any courses yet.</p>
                                    <Link to="/courses" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow transition">
                                        Explore Directory
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {user.enrolledCourses.map((course) => (
                                        <div key={course._id} className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col">
                                            <div className="h-32 bg-gray-100 relative">
                                                {course.thumbnail && <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />}
                                                <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-gray-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {course.category || "General"}
                                                </span>
                                            </div>

                                            <div className="p-5 flex-grow flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1">{course.name}</h3>
                                                    <p className="text-xs text-gray-400 font-medium mb-4">By {course.instructor || "Platform Instructor"}</p>

                                                    {/* Progress Metrics Area */}
                                                    <div className="space-y-1.5 mb-4">
                                                        <div className="flex justify-between text-xs font-bold text-gray-500">
                                                            <span>Course Progress</span>
                                                            <span className="text-blue-600">{course.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                            <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${course.progress}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-gray-50 mt-auto flex flex-col gap-3">
                                                    <div className="text-xs text-gray-500 truncate">
                                                        <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Course Data</span>
                                                        <span className="font-medium text-gray-700">Lectures Available</span>
                                                    </div>
                                                    <Link
                                                        to={`/courses/${course._id}/lecture`}
                                                        className="w-full text-center py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition"
                                                    >
                                                        Resume Lecture Series →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Account Settings Subsection */
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm max-w-xl">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Account Configurations</h3>
                        <p className="text-xs text-gray-400 mb-6">Modify details related to your student workspace credentials.</p>

                        {/* Interactive Response Banner Alerts */}
                        {message && (
                            <div className={`p-4 mb-4 rounded-xl text-xs font-semibold ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={e => handleSaveProfile(e)}>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Profile Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-700"
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Email Contact Address</label>
                                <input type="email" value={user.email} disabled className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-400 cursor-not-allowed" />
                            </div>
                            <div className="pt-2 flex justify-end">
                                <button
                                    disabled={!newName || newName === user.name}
                                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-blue-700 transition shadow-sm"
                                >
                                    Save System Profile
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div >
    );
}
