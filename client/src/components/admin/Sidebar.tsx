import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const { pathname } = useLocation();

    const linkClass = (path: string) =>
        `block px-4 py-2 rounded-lg ${
            pathname === path
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
        }`;

    return (
        <div className="w-64 bg-white shadow-md p-4">
            <h2 className="text-xl text-blue-600 font-bold mb-6">Edutech</h2>

            <nav className="flex flex-col gap-2">
                <Link to="/admin" className={linkClass("/admin")}>
                    📊 Dashboard
                </Link>

                <Link
                    to="/admin/courses"
                    className={linkClass("/admin/courses")}
                >
                    📚 Courses
                </Link>

                <Link
                    to="/admin/learners"
                    className={linkClass("/admin/learners")}
                >
                    👨‍🎓 Learners
                </Link>
            </nav>
        </div>
    );
}
