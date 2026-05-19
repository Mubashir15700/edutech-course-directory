import { useEffect, useState } from "react";
import { useGetCoursesQuery } from "../features/courses/coursesApi";
import CourseCard from "../components/CourseCard";
import Pagination from "../components/Pagination";
import Filters from "../components/Filters";

function App() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error } = useGetCoursesQuery({
        page: currentPage,
        limit: 6,
        search,
        category,
    });

    const sortedCourses = [...(data?.data || [])].sort((a, b) => {
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "name") return a.name.localeCompare(b.name);
        return 0;
    });

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, category, sort]);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                EduTech Course Directory
            </h1>

            {/* Filters */}
            <Filters
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
            />

            {/* Course List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px] items-start">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full col-span-full">
                        <p className="text-lg font-semibold">
                            Loading courses...
                        </p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full col-span-full">
                        <p className="text-red-500 text-lg">
                            Error loading courses
                        </p>
                    </div>
                ) : sortedCourses.length > 0 ? (
                    sortedCourses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                    ))
                ) : (
                    <div className="flex justify-center items-center h-full col-span-full">
                        <p className="text-gray-500 text-lg">
                            No courses match your filters
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
                setCurrentPage={setCurrentPage}
                marginTop="mt-5"
            />
        </div>
    );
}

export default App;
