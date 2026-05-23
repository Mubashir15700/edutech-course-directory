import { useState } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/users/usersApi";
import MyCourses from "./MyCourses";
import AccountSettings from "./AccountSettings";

export default function MyLearning() {
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

                {/* Top Overview Header */}
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
                    <MyCourses
                        user={user}
                        completedCoursesCount={completedCoursesCount}
                    />
                ) : (
                    <AccountSettings
                        message={message}
                        user={user}
                        handleSaveProfile={handleSaveProfile}
                        newName={newName}
                        setNewName={setNewName}
                    />
                )}
            </div >
        </div >
    );
}
