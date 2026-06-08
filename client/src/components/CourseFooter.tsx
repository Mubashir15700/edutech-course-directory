const CourseFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid gap-10 md:grid-cols-4">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 transition duration-200">
                                <span className="text-white font-black text-xs sm:text-sm">E</span>
                            </div>
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                                Edutech
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            Precision micro-learning experiences designed for engineers,
                            developers, and system architects building modern software.
                        </p>
                    </div>

                    {/* Learning */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Learning
                        </h3>

                        <div className="flex flex-col gap-3 text-sm">
                            <a
                                href="/courses"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                All Courses
                            </a>

                            <a
                                href="/dashboard"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                Student Dashboard
                            </a>

                            <a
                                href="/roadmaps"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                Learning Roadmaps
                            </a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Resources
                        </h3>

                        <div className="flex flex-col gap-3 text-sm">
                            <a
                                href="/docs"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                Documentation
                            </a>

                            <a
                                href="/support"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                Help Center
                            </a>

                            <a
                                href="/faq"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                FAQ
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Connect
                        </h3>

                        <div className="flex flex-col gap-3 text-sm">
                            <a
                                href="mailto:support@edutech.com"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                support@edutech.com
                            </a>

                            <a
                                href="/privacy"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                Privacy Policy
                            </a>

                            <a
                                href="/terms"
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © {currentYear} Edutech Course Directory. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5 text-xs text-gray-500">
                        <a href="#" className="hover:text-blue-600 transition-colors">
                            GitHub
                        </a>

                        <a href="#" className="hover:text-blue-600 transition-colors">
                            LinkedIn
                        </a>

                        <a href="#" className="hover:text-blue-600 transition-colors">
                            X / Twitter
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default CourseFooter;
