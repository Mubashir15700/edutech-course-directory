import { useState } from "react";
import { useLoginMutation } from "../features/auth/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errorMsg, setErrorMsg] = useState("");
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const user = await login(form).unwrap();

            localStorage.setItem("token", user.token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        } catch (err: any) {
            setErrorMsg(err?.data?.message || "Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Welcome Back 👋
                </h2>

                {/* Error */}
                {errorMsg && (
                    <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
                        {errorMsg}
                    </p>
                )}

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full mb-4 rounded-lg"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full mb-4 rounded-lg"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                {/* Button */}
                <button
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg transition duration-300"
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                {/* Signup Link */}
                <p className="text-sm text-gray-500 text-center mt-4">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
