import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

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
            {/* Logo / Title */}
            <h1
                className="text-xl font-bold text-blue-600 cursor-pointer"
                onClick={() => navigate("/courses")}
            >
                EduTech
            </h1>

            {/* Right Section */}
            <div className="flex items-center gap-5">
                {/* Notifications */}
                <NotificationBell />

                {/* My Learning */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">

                            {/* Wrap Avatar and Name inside a clickable Link container */}
                            <Link
                                to="/my-learning"
                                className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                                title="View your learning dashboard"
                            >
                                {/* Profile Avatar with First Letter - Added scale effect on hover */}
                                <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold uppercase text-sm shadow-sm select-none group-hover:bg-blue-700 transition-colors duration-200">
                                    {user?.name?.charAt(0)}
                                </div>

                                {/* My Learning Text */}
                                <span className="text-sm font-medium text-gray-700 hidden sm:block group-hover:text-blue-600 transition-colors duration-200">
                                    My Learning
                                </span>
                            </Link>

                            {/* Vertical Separator */}
                            <span className="h-4 w-px bg-gray-200 hidden sm:block"></span>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-red-500 hover:text-red-600 transition duration-200 focus:outline-none"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm transition duration-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
