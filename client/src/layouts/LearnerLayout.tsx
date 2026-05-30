import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { LearnerChatWidget } from '../components/LearnerChatWidget';

export default function LearnerLayout() {
    const [user] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Failed to parse user data from localStorage:", error);
            return null;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="p-6 max-w-6xl mx-auto">
                <Outlet />
            </main>

            {user?.role === "learner" && (
                <LearnerChatWidget user={user} />
            )}
        </div>
    );
}
