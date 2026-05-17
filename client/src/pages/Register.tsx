import { useState } from "react";
import { useRegisterMutation } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [register] = useRegisterMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const res: any = await register(form);

        if (res.data) {
            navigate("/login");
        }
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="p-6 border rounded w-80">
                <h2 className="text-xl mb-4">Register</h2>

                <input
                    placeholder="Name"
                    className="border p-2 w-full mb-3"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
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

                <button className="bg-green-500 text-white w-full py-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}
