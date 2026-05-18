import { useState } from "react";
import { useRegisterMutation } from "../features/auth/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            await register(form).unwrap();
            navigate("/login");
        } catch (err: any) {
            setErrorMsg(err?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Create an Account 🚀
                </h2>

                {/* Error */}
                {errorMsg && (
                    <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
                        {errorMsg}
                    </p>
                )}

                {/* Name */}
                <input
                    placeholder="Full Name"
                    className="border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none p-3 w-full mb-4 rounded-lg"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    className="border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none p-3 w-full mb-4 rounded-lg"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none p-3 w-full mb-6 rounded-lg"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                {/* Button */}
                <button
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg transition duration-300"
                >
                    {isLoading ? "Creating account..." : "Register"}
                </button>

                {/* Login Link */}
                <p className="text-sm text-gray-500 text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-600 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}
