import type { Course } from "../features/courses/types";

const CourseCard = ({ course }: { course: Course }) => {
    return (
        <div
            key={course._id}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition duration-300 border border-gray-100"
        >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {course.name}
            </h2>

            <p className="text-sm text-gray-500 mb-1">
                👨‍🏫 {course.instructor}
            </p>
            <p className="text-sm text-gray-500 mb-1">
                ⏱ {course.duration}
            </p>
            <p className="text-sm text-gray-500 mb-3">
                📂 {course.category}
            </p>

            <div className="flex justify-between items-center">
                <span className="text-yellow-500 font-medium">
                    ⭐ {course.rating}
                </span>

                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    Course
                </span>
            </div>
        </div>
    );
};

export default CourseCard;
