import { useState } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton";

interface LocalUser {
    _id?: string;
    name: string;
    email: string;
    role: string;
}

export default function AdminProfile() {
    const [adminData] = useState<LocalUser>(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                return JSON.parse(storedUser);
            }
        } catch (error) {
            console.error("Failed parsing user data from localStorage:", error);
        }

        return {
            name: "Administrator",
            email: "admin@platform.com",
            role: "admin"
        };
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ type: "error", text: "Please populate all security password fields." });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Confirmation mismatch. New passwords do not match." });
            return;
        }

        try {
            await axios.put(import.meta.env.VITE_BACKEND_URL + "/users/profile/password", { currentPassword, newPassword }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setMessage({ type: "success", text: "Security credentials updated successfully." });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setMessage({ type: "error", text: err.response?.data?.message || "Failed to update password." });
        }
    };

    return (
        <div className="h-[80vh] max-h-[80vh] overflow-y-auto pr-2">
            {/* Header Title block */}
            <div className="mb-6 flex">
                <div className="max-w-20 border border-solid border-gray-300 rounded-lg mr-5 pr-1">
                    <BackButton goTo="/admin" text="Back" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Account Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your administrative profile and platform access security controls.</p>
                </div>
            </div>

            {/* Main Split Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                {/* Left Mini-Card: Identity Summary */}
                <div className="md:col-span-1 bg-white border border-gray-200/80 rounded-2xl p-6 text-center shadow-sm">
                    <img
                        src={'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"'}
                        alt={adminData.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-50 mb-4 shadow-sm"
                    />
                    <h2 className="text-lg font-bold text-gray-900">{adminData.name}</h2>
                    <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                        {adminData.role}
                    </span>
                    <p className="text-xs text-gray-400 mt-4">System Node Manager</p>
                </div>

                {/* Right Form Fields: Main profile configuration options */}
                <div className="md:col-span-2 space-y-6">

                    {/* Section 1: Basic Information form parameters */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">
                            Profile Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={adminData.name}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-700"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Work Email Address</label>
                                <input
                                    type="email"
                                    value={adminData.email}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-700"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Security & Credentials update block */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                            Credentials & Security
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">Regular password updates keep administrative datasets secure.</p>

                        {/* Interactive Response Banner Alerts */}
                        {message && (
                            <div className={`p-4 mb-4 rounded-xl text-xs font-semibold ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handlePasswordUpdate}>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Current Admin Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Minimum 8 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Re-type password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition"
                                    />
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition shadow-sm"
                                >
                                    Update Access Credentials
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
