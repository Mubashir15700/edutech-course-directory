import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../features/auth/authApi";
import { loginSchema } from "../validations/authValidation";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErrorMsg("");

        const result = loginSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            return; // stop API call
        }

        setErrors({}); // clear previous errors

        try {
            const user = await login(form).unwrap();

            localStorage.setItem("token", user.token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/courses");
            }
        } catch (err: any) {
            setErrorMsg(err?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-block">
                        <h1 className="text-3xl font-extrabold text-blue-600">
                            EduTech
                        </h1>
                    </Link>

                    <p className="text-gray-500 mt-2">
                        Learn modern skills. Build your future.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                >
                    <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
                        Welcome Back 👋
                    </h2>

                    <p className="text-sm text-gray-500 text-center mb-6">
                        Login to continue your learning journey
                    </p>

                    {/* Error */}
                    {errorMsg && (
                        <p className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
                            {errorMsg}
                        </p>
                    )}

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email address"
                        className="border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full rounded-lg"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                    {errors.email && <p className="text-red-600">{errors.email}</p>}

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none p-3 w-full mt-5 rounded-lg"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                    {errors.password && <p className="text-red-600">{errors.password}</p>}

                    {/* Button */}
                    <button
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white w-full py-3 mt-5 rounded-lg transition duration-300 font-medium"
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    {/* Register Link */}
                    <p className="text-sm text-gray-500 text-center mt-5">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Create account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
