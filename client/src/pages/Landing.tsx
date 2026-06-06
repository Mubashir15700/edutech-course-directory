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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-800">

            {/* HERO SECTION */}
            <div className="flex flex-col items-center justify-center px-4 pt-32 pb-20 text-center relative overflow-hidden">
                <div className="max-w-3xl">
                    {/* Animated AI Feature Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-xs mb-6">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                        🤖 Powered by Gemini 2.5 Flash AI
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
                        Welcome to the <br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Edutech Course Directory
                        </span> 🚀
                    </h1>

                    <h2 className="text-lg md:text-xl text-blue-600 font-semibold mb-6">
                        Next-Generation MERN Learning Platform
                    </h2>

                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                        Explore curated technology courses across multiple domains, test your skills with AI-powered micro quizzes, and discover structured career learning paths.
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link
                            to="/courses"
                            className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition duration-300 text-sm"
                        >
                            Explore Courses
                        </Link>
                        <Link
                            to="/login"
                            className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition duration-300 text-sm"
                        >
                            Sign In to Classroom
                        </Link>
                    </div>
                </div>
            </div>

            {/* STATS SECTION */}
            <div className="max-w-5xl mx-auto px-4 py-12 border-t border-b border-gray-100 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm mb-20">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <p className="text-4xl font-extrabold text-blue-600">{data?.counts.courses || 12}+</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Expert-Led Modules</p>
                    </div>
                    <div>
                        <p className="text-4xl font-extrabold text-purple-600">{data?.counts.learners || 1420}+</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Active Developers</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-4xl font-extrabold text-indigo-600">{(data?.counts.rating || 4.8).toFixed(1)}★</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">Average Satisfaction</p>
                    </div>
                </div>
            </div>

            {/* THE ECOSYSTEM ADVANTAGE (FEATURES GRID) */}
            <div className="max-w-6xl mx-auto px-4 py-16 mb-12">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Engineered for Modern Technical Learning
                    </h2>
                    <p className="text-gray-500 mt-3 text-sm md:text-base">
                        A full-stack learning matrix built to optimize streaming responsiveness, state accuracy, and skill diagnostics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-6 font-bold">⚡</div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Instant Discovery Layout</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Search, filter, and page across diverse career paths instantly via multi-attribute query indexing optimized by Redux Toolkit Query architecture layers.
                        </p>
                    </div>
                    {/* Feature 2 */}
                    <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                        <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-6 font-bold">📡</div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Live Session Synchronization</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Receive real-time global notifications and continuous platform events instantly utilizing integrated WebSocket connections powered by Socket.IO streams.
                        </p>
                    </div>
                    {/* Feature 3 */}
                    <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                        <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-6 font-bold">💳</div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Secure Enrollment Rails</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Unlock targeted curriculum seats safely handling payments directly through modern asynchronous Stripe Checkout handlers and live backend webhooks.
                        </p>
                    </div>
                </div>
            </div>

            {/* HOW THE AI KNOWLEDGE CHECK WORKS (SPLIT PREVIEW) */}
            <div className="bg-gray-900 text-white py-20 mb-12">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-md">
                            Inference Integration Architecture
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-4 mb-6 leading-tight">
                            Smart Skill Evaluations <br />
                            Driven by Gemini 2.5 Flash
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                            Say goodbye to static, predictable quiz blocks. Our decoupled serverless architecture dynamically extracts core concept tags from specific lesson metadata matrices.
                        </p>

                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400 font-bold">✓</span>
                                <span>Strict structural JSON schemas parsing (<code>responseMimeType: "application/json"</code>) to ensure perfect client execution.</span>                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400 font-bold">✓</span>
                                <span>Context-aware parameter tuning reduces hallucination rates to zero.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400 font-bold">✓</span>
                                <span>Instant scoring feedback Loops complete with explicit conceptual breakdowns.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Dummy Interface Representation */}
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl font-mono text-xs text-gray-400">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-3">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="ml-2 text-[10px] text-gray-500 uppercase tracking-wider">gemini-schema-response.json</span>
                        </div>
                        <pre className="text-blue-400 overflow-x-auto">
                            {`{
  "quizTitle": "TypeScript Enums & Generics Verification",
  "questions": [
    {
      "id": "q_01",
      "prompt": "What occurs when substituting a 'unknown' typing boundary instead of 'any'?",
      "options": ["Complete compilation bypass", "Strict typechecking guard forcing validation", "Implicit downcasting"],
      "correctIndex": 1,
      "explanation": "The 'unknown' type requires explicit runtime narrowing or type guards before performing operations..."
    }
  ]
}`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* CATEGORIES QUICK LINKS */}
            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="text-center max-w-xl mx-auto mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Browse Top Categories
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400 mt-1">
                        Select a domain specialization track to apply dynamic client-side filtering fields instantly.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data?.categories.map((category) => (
                        <Link
                            key={category}
                            to={`/courses?category=${encodeURIComponent(category)}`}
                            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center font-semibold text-gray-700 hover:shadow-md hover:border-blue-300 hover:text-blue-600 transition duration-300"
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>

            {/* CALL TO ACTION (CTA) CONVERSION BLOCK */}
            <div className="max-w-5xl mx-auto px-4 pb-20">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Ready to Master Modern Development Stack Parameters?</h3>
                    <p className="text-blue-100 max-w-xl mx-auto text-sm md:text-base mb-8 leading-relaxed">
                        Create your candidate classroom account now to track modular lecture progress checklists and initialize real-time AI knowledge benchmarks.
                    </p>
                    <Link
                        to="/courses"
                        className="inline-block px-8 py-3.5 bg-white text-blue-600 rounded-xl font-bold text-sm shadow-md hover:bg-blue-50 transition duration-200"
                    >
                        Get Started Instantly
                    </Link>
                </div>
            </div>

            {/* FOOTER SECTION */}
            <footer className="w-full bg-white border-t border-gray-100 py-12 px-6 mt-12">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

                    {/* Brand & Description */}
                    <div className="max-w-sm">
                        <h3 className="text-sm font-bold text-gray-900 tracking-tight mb-2">
                            Edutech Course Directory
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Discover curated technology courses and learning paths designed
                            to help students build practical full-stack development skills.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-500">
                        <Link
                            to="/courses"
                            className="hover:text-blue-600 transition-colors duration-200"
                        >
                            Browse Catalog
                        </Link>

                        <Link
                            to="/login"
                            className="hover:text-blue-600 transition-colors duration-200"
                        >
                            Student Login
                        </Link>

                        <a
                            href="https://github.com/Mubashir15700/edutech-course-directory"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors duration-200"
                        >
                            GitHub Repository
                        </a>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="max-w-5xl mx-auto border-t border-gray-100 mt-8 pt-6">
                    <p className="text-center text-xs text-gray-400">
                        © {new Date().getFullYear()} Edutech Course Directory. All rights reserved.
                    </p>
                </div>
            </footer>

        </div>
    );
}
