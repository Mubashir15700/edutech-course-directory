import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteCoursesQuery } from "../features/courses/coursesApi";
import CourseCard from "../components/CourseCard";
import Filters from "../components/Filters";
import LoadingSpinner from "../components/LoadingSpinner";

function Courses() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Access query parameters for category filter (e.g., from landing page links)
    const urlParams = new URLSearchParams(window.location.search);

    const { data, isLoading, isFetching, error } = useGetInfiniteCoursesQuery({
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

    // Setup intersection target hook tracking
    const { ref, inView } = useInView({
        threshold: 0.1,      // fires when 10% of the target element is visible
        rootMargin: "200px", // pre-fetch 200px before user hits absolute bottom
    });

    const hasMore = data ? currentPage < data.totalPages : false;

    // Handle automated pagination page steps when scroll target steps into viewport
    useEffect(() => {
        if (inView && data && currentPage < data.totalPages && !isFetching) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [inView, data, isFetching, currentPage]);

    useEffect(() => {
        setCategory(urlParams.get("category") || "");
    }, []);

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
                        <LoadingSpinner />
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

            {/* Bottom Target Trigger & Feedback Indicator Area */}
            <div ref={ref} className="w-full flex justify-center py-8 mt-4">
                {isFetching && (
                    <p className="text-sm text-gray-500 animate-pulse font-medium">
                        Loading more courses...
                    </p>
                )}
                {!isFetching && !hasMore && sortedCourses.length > 0 && (
                    <p className="text-xs text-gray-400 font-normal">
                        You've reached the end of the catalog.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Courses;
