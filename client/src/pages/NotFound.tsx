import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200 px-4 text-center">
            <h1 className="text-7xl font-extrabold text-gray-800 mb-4">404</h1>

            <p className="text-lg text-gray-600 mb-6">
                Oops! The page you're looking for doesn't exist.
            </p>

            <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
                Go Back Home
            </Link>
        </div>
    );
}
