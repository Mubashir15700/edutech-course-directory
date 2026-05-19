import { Link } from "react-router-dom";

const CourseNotFound = () => {
    return (
        <div className="min-h-[calc(80vh-64px)] w-full flex flex-col items-center justify-center bg-gray-50/50 text-center px-4">
            <div className="max-w-md bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                {/* Visual warning indicator icon */}
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    ⚠️
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-2">
                    Course Not Found
                </h2>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    The course you are looking for doesn't exist, has been removed, or you typed an incorrect link.
                </p>

                <Link
                    to="/courses"
                    className="inline-block w-full px-5 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-sm hover:bg-blue-700 hover:shadow transition duration-200 text-sm"
                >
                    Back to Course Directory
                </Link>
            </div>
        </div>
    )
}

export default CourseNotFound;
