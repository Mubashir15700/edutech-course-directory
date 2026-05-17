import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">EdTech Platform</h1>
            <p className="mb-6 text-gray-600">
                Learn. Grow. Build your future.
            </p>

            <div className="flex gap-4">
                <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Login
                </Link>
                <Link to="/register" className="px-4 py-2 border rounded">
                    Register
                </Link>
            </div>
        </div>
    );
}
