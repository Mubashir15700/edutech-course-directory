import { Link } from "react-router-dom";
import type { IUser } from "../../features/users/types";

const MyCourses = ({ user, completedCoursesCount }: { user: IUser; completedCoursesCount: number }) => {
    return (
        <div className="space-y-8">
            {/* High-Level Analytical Tracker Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Enrolled Programs</span>
                    <span className="text-3xl font-black text-gray-900 mt-1 block">{user.enrolledCourses ? user.enrolledCourses.length : 0}</span>
                </div>
                <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Completed Blocks</span>
                    <span className="text-3xl font-black text-gray-900 mt-1 block">{completedCoursesCount}</span>
                </div>
                <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Account standing</span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg tracking-wide uppercase mt-2 inline-block">Active Status</span>
                </div>
            </div>

            {/* Subscribed Course Tracking List */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Continuous Learning Programs</h2>

                {!user.enrolledCourses || user.enrolledCourses.length === 0 ? (
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-12 text-center shadow-sm">
                        <p className="text-gray-500 font-medium mb-4">You are not enrolled in any courses yet.</p>
                        <Link to="/courses" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow transition">
                            Explore Directory
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {user.enrolledCourses.map((course) => (
                            <div key={course._id} className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col">
                                <div className="h-32 bg-gray-100 relative">
                                    {course.thumbnail && <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />}
                                    <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-gray-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded uppercase tracking-wider">
                                        {course.category || "General"}
                                    </span>
                                </div>

                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1">{course.name}</h3>
                                        <p className="text-xs text-gray-400 font-medium mb-4">By {course.instructor || "Platform Instructor"}</p>

                                        {/* Progress Metrics Area */}
                                        <div className="space-y-1.5 mb-4">
                                            <div className="flex justify-between text-xs font-bold text-gray-500">
                                                <span>Course Progress</span>
                                                <span className="text-blue-600">{course.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${course.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-50 mt-auto flex flex-col gap-3">
                                        <div className="text-xs text-gray-500 truncate">
                                            <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Course Data</span>
                                            <span className="font-medium text-gray-700">Lectures Available</span>
                                        </div>
                                        <Link
                                            to={`/courses/${course._id}/lecture`}
                                            className="w-full text-center py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold transition"
                                        >
                                            Resume Lecture Series →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyCourses;
