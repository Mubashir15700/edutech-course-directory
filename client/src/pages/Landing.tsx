import { Link } from "react-router-dom";
import { useGetLandingPageStatsQuery } from "../features/dashboard/dashboardApi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Landing() {
    const { data, isLoading } = useGetLandingPageStatsQuery();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen col-span-full">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

            {/* HERO SECTION */}
            <div className="flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
                <div className="max-w-2xl">
                    <h3 className="text-2xl text-blue-600 font-semibold tracking-wide mb-3">
                        EduTech Course Directory
                    </h3>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-5 leading-tight my-8">
                        Elevate Your Learning Journey 🚀
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed my-10">
                        Discover industry-focused courses, learn from expert instructors,
                        and build real-world skills to advance your tech career.
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap mt-16">
                        <Link
                            to="/courses"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:bg-blue-700 transition duration-300"
                        >
                            Explore Courses
                        </Link>
                        <Link
                            to="/login"
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition duration-300"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* STATS SECTION (Pulled from Dashboard API data concepts) */}
            <div className="max-w-5xl mx-auto px-4 py-12 border-t border-b border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <p className="text-4xl font-extrabold text-blue-600">{data?.counts.courses}+</p>
                        <p className="text-sm font-medium text-gray-500 uppercase mt-1">Expert Courses</p>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-purple-600">{data?.counts.learners}+</p>
                        <p className="text-sm font-medium text-gray-500 uppercase mt-1">Active Learners</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-4xl font-extrabold text-indigo-600">{data?.counts.rating.toFixed(1)}★</p>
                        <p className="text-sm font-medium text-gray-500 uppercase mt-1">Average Rating</p>
                    </div>
                </div>
            </div>

            {/* CATEGORIES QUICK LINKS */}
            <div className="max-w-5xl mx-auto px-4 py-16">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    Browse Top Categories
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data?.categories.map((category) => (
                        <Link
                            key={category}
                            to={`/courses?category=${encodeURIComponent(category)}`}
                            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center font-medium text-gray-800 hover:shadow-md hover:border-blue-200 hover:text-blue-600 transition duration-300"
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>

            {/* FOOTER NOTE */}
            <footer className="text-center py-8 text-sm text-gray-400 border-t border-gray-100">
                <p>Join learners building the future with modern tech skills</p>
            </footer>

        </div>
    );
}
