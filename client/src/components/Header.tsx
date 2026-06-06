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
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 px-3 sm:px-6 py-2.5 flex justify-between items-center transition-all">

            {/* Logo / Title Area */}
            <div
                onClick={() => navigate("/courses")}
                className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
            >
                <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 transition duration-200">
                    <span className="text-white font-black text-xs sm:text-sm">E</span>
                </div>
                {/* Responsive text scaling prevents word splitting */}
                <h1 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
                    Edutech <span className="text-blue-600 font-medium hidden xs:inline">Directory</span>
                </h1>
            </div>

            {/* Right System Utility Rails */}
            <div className="flex items-center gap-2 sm:gap-4">

                <NotificationBell />

                <span className="h-4 w-px bg-gray-200 mx-0.5"></span>

                <div className="flex items-center">
                    {user ? (
                        <div className="flex items-center gap-2 sm:gap-3">

                            {/* Profile Pill - Automatically hides label text on small viewports to save room */}
                            <Link
                                to="/my-learning"
                                className="flex items-center gap-1.5 p-1 sm:pl-1.5 sm:pr-3 bg-gray-50 hover:bg-blue-50/50 border border-gray-100 rounded-full group transition-all duration-200 focus:outline-none"
                                title="Open student learning suite"
                            >
                                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center rounded-full font-bold uppercase text-[10px] sm:text-xs shadow-sm">
                                    {user?.name?.charAt(0) || "U"}
                                </div>

                                <span className="text-xs font-semibold text-gray-600 group-hover:text-blue-600 transition-colors duration-200 max-w-[90px] truncate hidden sm:block">
                                    My Learning
                                </span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 px-2 sm:px-2.5 py-1.5 rounded-lg transition-all duration-200 focus:outline-none"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Link
                                to="/login"
                                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-md transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
