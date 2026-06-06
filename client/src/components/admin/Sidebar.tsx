import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const { pathname } = useLocation();

    // High-contrast styling helper with accent borders for active routes
    const linkClass = (path: string) => {
        const isActive = pathname === path;
        return `flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl relative transition-all duration-200 focus:outline-none select-none ${isActive
            ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
            }`;
    };

    return (
        /* DARK ENTERPRISE CONTAINER: Matches your AdminHeader control matrix theme */
        <div className="w-64 min-h-screen bg-slate-900 border-r border-slate-800/80 p-4 flex flex-col font-sans">

            {/* Context/App Indicator (Subtle branding, letting header do the heavy lifting) */}
            <div className="px-4 py-3 mb-6 border-b border-slate-800/50 pb-5">
                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                    Navigation Core
                </span>
            </div>

            {/* Main Menu Links Grid */}
            <nav className="flex flex-col gap-1.5 flex-1">
                <Link to="/admin" className={linkClass("/admin")}>
                    {/* Active Left Indicator Pill */}
                    {pathname === "/admin" && <span className="absolute left-0 w-1 h-4 bg-blue-500 rounded-r-md" />}
                    <span className="text-sm opacity-80">📊</span>
                    <span className="tracking-wide">Dashboard Matrix</span>
                </Link>

                <Link to="/admin/courses" className={linkClass("/admin/courses")}>
                    {pathname === "/admin/courses" && <span className="absolute left-0 w-1 h-4 bg-blue-500 rounded-r-md" />}
                    <span className="text-sm opacity-80">📚</span>
                    <span className="tracking-wide">Course Catalog</span>
                </Link>

                <Link to="/admin/learners" className={linkClass("/admin/learners")}>
                    {pathname === "/admin/learners" && <span className="absolute left-0 w-1 h-4 bg-blue-500 rounded-r-md" />}
                    <span className="text-sm opacity-80">👨‍🎓</span>
                    <span className="tracking-wide">Active Learners</span>
                </Link>

                <Link to="/admin/chat" className={linkClass("/admin/chat")}>
                    {pathname === "/admin/chat" && <span className="absolute left-0 w-1 h-4 bg-blue-500 rounded-r-md" />}
                    <span className="text-sm opacity-80">💬</span>
                    <span className="tracking-wide">Support Channels</span>
                </Link>
            </nav>

            {/* System Status Footer Badge */}
            <div className="mt-auto p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-300 leading-none">Node Production API</span>
                    <span className="text-[9px] font-medium text-slate-500 mt-0.5">Gateway Synced</span>
                </div>
            </div>
        </div>
    );
}
