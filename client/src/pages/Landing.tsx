import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="text-center max-w-2xl">

                {/* Title */}
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                    Elevate Your Learning Journey 🚀
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-gray-600 mb-8">
                    Discover top-rated tech courses, learn from industry experts, and
                    build real-world skills that accelerate your career.
                </p>

                {/* Buttons */}
                <div className="flex justify-center gap-4">
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition duration-300"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/register"
                        className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition duration-300"
                    >
                        Create Account
                    </Link>
                </div>

                {/* Optional small note */}
                <p className="text-sm text-gray-400 mt-6">
                    Join hundreds of learners already growing their skills
                </p>
            </div>
        </div>
    );
}
