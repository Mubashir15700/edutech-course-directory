import { Link, useNavigate } from "react-router-dom";
import NotificationBell from "../NotificationBell";

export default function AdminHeader() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        /* UPGRADED ADMIN BAR: Added crisp layouts, sharp borders, and high z-index positioning */
        <header className="sticky top-0 z-50 w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center transition-all select-none">

            {/* Left Section: Branding & System Indicator */}
            <div
                onClick={() => navigate("/admin")}
                className="flex items-center gap-3 cursor-pointer group"
            >
                {/* Enterprise Token Block */}
                <div className="h-7 w-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10 border border-blue-400/20 group-hover:bg-blue-500 transition duration-150">
                    <span className="text-white text-xs font-black">A</span>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-xs font-black text-slate-100 tracking-wider uppercase leading-none">
                        EduTech
                    </h1>
                    <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase mt-0.5">
                        Control Matrix
                    </span>
                </div>
            </div>

            {/* Right Section: System Controls */}
            <div className="flex items-center gap-4">

                {/* Dark-theme optimized Notification Feed Area */}
                <div className="hover:opacity-90 dark-notification-wrapper transition-opacity">
                    <NotificationBell />
                </div>

                {/* Subtle Divider Line */}
                <span className="h-5 w-px bg-slate-800"></span>

                {/* User Identity Matrix */}
                <div className="flex items-center">
                    <div className="flex items-center gap-4">

                        {/* Compact Admin Profile Card */}
                        <Link
                            to="/admin/profile"
                            className="flex items-center gap-2.5 pl-1 pr-3 py-1 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-full group transition-all duration-200 focus:outline-none"
                            title="Manage root profile data"
                        >
                            {/* Profile Avatar featuring User's Initial */}
                            <div className="w-6 h-6 bg-slate-700 group-hover:bg-blue-600 text-slate-200 group-hover:text-white flex items-center justify-center rounded-full font-bold uppercase text-[10px] border border-slate-600 group-hover:border-blue-400/30 transition-all duration-200">
                                {user?.name?.charAt(0) || "A"}
                            </div>

                            {/* Full User Name - Hidden on tight mobile displays */}
                            <span className="text-xs font-semibold text-slate-300 group-hover:text-slate-100 transition-colors duration-200 max-w-[100px] truncate hidden xs:block">
                                {user?.name || "Administrator"}
                            </span>
                        </Link>

                        {/* Secure Platform Terminate Token Trigger Button */}
                        <button
                            onClick={handleLogout}
                            className="text-xs font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition-all duration-200 focus:outline-none"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
