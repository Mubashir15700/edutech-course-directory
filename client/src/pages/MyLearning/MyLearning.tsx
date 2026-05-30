import { useState } from "react";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/users/usersApi";
import MyCourses from "./MyCourses";
import AccountSettings from "./AccountSettings";
import BackButton from "../../components/BackButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import PurchaseHistory from "./PurchaseHistory";

export default function MyLearning() {
    const { data: user, isLoading } = useGetProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();
    const [activeTab, setActiveTab] = useState<"courses" | "history" | "settings">("courses");
    const [newName, setNewName] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    if (isLoading || !user) {
        return (
            <div className="flex justify-center items-center h-screen col-span-full">
                <LoadingSpinner />
            </div>
        )
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
                <BackButton />

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
                    <div className="w-full sm:w-auto self-stretch sm:self-center">
                        {/* Mobile Scrollable Container Wrap Engine */}
                        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200/50 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory">

                            <button
                                onClick={() => setActiveTab("courses")}
                                className={`px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap snap-start shrink-0 cursor-pointer ${activeTab === "courses"
                                    ? "bg-white text-gray-900 shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
                                    }`}
                            >
                                My Courses
                            </button>

                            <button
                                onClick={() => setActiveTab("history")}
                                className={`px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap snap-start shrink-0 cursor-pointer ${activeTab === "history"
                                    ? "bg-white text-gray-900 shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
                                    }`}
                            >
                                Purchase History
                            </button>

                            <button
                                onClick={() => setActiveTab("settings")}
                                className={`px-4 py-2.5 sm:py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap snap-start shrink-0 cursor-pointer ${activeTab === "settings"
                                    ? "bg-white text-gray-900 shadow-xs"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
                                    }`}
                            >
                                Settings
                            </button>

                        </div>
                    </div>
                </div>

                {/* Primary Layout Switching Logic */}
                {activeTab === "courses" ? (
                    <MyCourses
                        user={user}
                        completedCoursesCount={completedCoursesCount}
                    />
                ) : activeTab === "history" ? (
                    <PurchaseHistory />
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
