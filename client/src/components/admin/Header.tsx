import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "../NotificationBell";

export default function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Admin Panel</h1>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <NotificationBell />

                {/* Profile + Logout */}
                <div className="flex items-center gap-3">
                    {/* Wrap Avatar and Name inside a clickable Link container */}
                    <Link
                        to="/admin/profile"
                        className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                        title="View your profile"
                    >
                        <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                            {user?.name?.charAt(0)}
                        </div>

                        <span className="text-sm">{user?.name}</span>
                    </Link>

                    {/* Vertical Separator */}
                    <span className="h-4 w-px bg-gray-200 hidden sm:block"></span>

                    <button
                        onClick={handleLogout}
                        className="text-red-500 text-sm hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
