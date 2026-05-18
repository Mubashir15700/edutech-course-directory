import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function LearnerLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="p-6 max-w-6xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
