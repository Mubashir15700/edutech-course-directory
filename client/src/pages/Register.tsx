import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../features/auth/authApi";
import { registerSchema } from "../validations/authValidation";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErrorMsg("");

        const result = registerSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                fieldErrors[field] = issue.message;
            });

            setErrors(fieldErrors);
            return; // stop API call
        }

        try {
            await register(form).unwrap();
            navigate("/login");
        } catch (err: any) {
            setErrorMsg(err?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
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
                        className="border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none p-3 w-full rounded-lg"
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p className="text-red-600">{errors.name}</p>}

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none p-3 w-full mt-4 rounded-lg"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                    {errors.email && <p className="text-red-600">{errors.email}</p>}

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none p-3 w-full mt-4 rounded-lg"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                    {errors.password && <p className="text-red-600">{errors.password}</p>}

                    {/* Button */}
                    <button
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white w-full py-3 mt-6 rounded-lg transition duration-300"
                    >
                        {isLoading ? "Creating account..." : "Register"}
                    </button>

                    {/* Login Link */}
                    <p className="text-sm text-gray-500 text-center mt-4">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-green-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
