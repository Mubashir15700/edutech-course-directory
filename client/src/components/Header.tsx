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
            {/* Logo / Title */}
            <h1
                className="text-xl font-bold text-blue-600 cursor-pointer"
                onClick={() => navigate("/home")}
            >
                EduTech
            </h1>

            {/* Right Section */}
            <div className="flex items-center gap-5">
                {/* Notifications */}
                <button className="text-gray-600 hover:text-black text-lg">
                    🔔
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                        {user?.name?.charAt(0)}
                    </div>

                    <span className="text-sm font-medium">{user?.name}</span>

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
