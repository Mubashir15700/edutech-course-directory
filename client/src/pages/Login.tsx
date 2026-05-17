import { useState } from "react";
import { useLoginMutation } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [login] = useLoginMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const res: any = await login(form);

        if (res.data) {
            const user = res.data;

            localStorage.setItem("token", user.token);
            localStorage.setItem("user", JSON.stringify(user));

            // 🔥 Role-based redirect
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="p-6 border rounded w-80">
                <h2 className="text-xl mb-4">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-3"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-3"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <button className="bg-blue-500 text-white w-full py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
