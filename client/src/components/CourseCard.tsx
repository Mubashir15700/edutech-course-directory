import { useNavigate } from "react-router-dom";
import type { Course } from "../features/courses/types";

const CourseCard = ({ course }: { course: Course }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/courses/${course._id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer flex flex-col h-full"
        >
            {/* Visual Aspect Ratio Wrapper & Image Layout */}
            <div className="relative h-44 w-full overflow-hidden bg-gray-50">
                <img
                    src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600"}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dynamic Difficulty Badge */}
                <span className="absolute top-3 right-3 text-[11px] font-bold bg-white/90 backdrop-blur-sm text-gray-800 px-2.5 py-1 rounded-lg shadow-sm uppercase tracking-wider">
                    {course.level}
                </span>
            </div>

            {/* Structured Card Text Metadata Context */}
            <div className="p-5 flex flex-col flex-grow">

                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 block">
                    {course.category}
                </span>

                {/* Course Name - Enforced to match uniform grid heights via line-clamping */}
                <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-3 min-h-[3rem]">
                    {course.name}
                </h2>

                <div className="space-y-2 text-sm text-gray-500 mb-6">
                    <p className="flex items-center gap-2">
                        <span className="text-base">👨‍🏫</span>
                        <span className="truncate font-medium text-gray-600">{course.instructor}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="text-base">⏱</span>
                        <span>{course.duration}</span>
                    </p>
                </div>

                {/* Card Footer (Ratings & Price Metrics) */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-sm">⭐</span>
                        <span className="text-sm font-bold text-gray-800">
                            {course.rating ? course.rating.toFixed(1) : "0.0"}
                        </span>
                    </div>

                    <span className="text-base font-black text-gray-900">
                        {course.price === 0 ? (
                            <span className="text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-lg text-xs tracking-wide uppercase">
                                Free
                            </span>
                        ) : (
                            `$${course.price}`
                        )}
                    </span>
                </div>

            </div>
        </div>
    );
};

export default CourseCard;
