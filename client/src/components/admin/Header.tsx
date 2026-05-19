import { useNavigate } from "react-router-dom";

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
                <button className="text-gray-600 hover:text-black">🔔</button>

                {/* Profile + Logout */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                        {user?.name?.charAt(0)}
                    </div>

                    <span className="text-sm">{user?.name}</span>

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
