import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteCoursesQuery } from "../features/courses/coursesApi";
import CourseCard from "../components/CourseCard";
import Filters from "../components/Filters";
import SkeletonCard from "../components/SkeletonCard";

function Courses() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [tag, setTag] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Access query parameters for category filter (e.g., from landing page links)
    const urlParams = new URLSearchParams(window.location.search);

    const { data, isLoading, isFetching, error } = useGetInfiniteCoursesQuery({
        page: currentPage,
        limit: 6,
        search,
        category,
        tag
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
        setTag(urlParams.get("tag") || "");
    }, []);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, category, tag, sort]);

    return (
        <div className="max-w-6xl mx-auto py-2">
            {/* Title Section */}
            <div className="text-center mb-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                    EduTech Course Directory
                </h1>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Advance your engineering stack parameter skills with interactive evaluation checkpoints.
                </p>
            </div>

            {/* Filters Component Hook */}
            <Filters
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
            />

            {/* Upgraded Course Grid List Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px] items-start mt-8">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
                ) : error ? (
                    <div className="flex flex-col justify-center items-center py-16 col-span-full text-center">
                        <span className="text-3xl mb-2">⚠️</span>
                        <p className="text-red-500 font-medium text-base">Error loading available course catalog profiles.</p>
                        <p className="text-xs text-gray-400 mt-1">Please check your system connection boundaries and refresh.</p>
                    </div>
                ) : sortedCourses.length > 0 ? (
                    sortedCourses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                    ))
                ) : (
                    <div className="flex flex-col justify-center items-center py-20 col-span-full text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <span className="text-2xl mb-2">🔍</span>
                        <p className="text-gray-600 font-medium text-sm">No courses match your active search filters.</p>
                        <p className="text-xs text-gray-400 mt-0.5">Try resetting your category parameters or checking typos.</p>
                    </div>
                )}
            </div>

            {/* Bottom Target Trigger & Feedback Indicator Area */}
            <div ref={ref} className="w-full flex justify-center py-12 mt-6">
                {isFetching && !isLoading && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-semibold tracking-wide shadow-sm animate-bounce">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                        Fetching fresh streams...
                    </div>
                )}
                {!isFetching && !hasMore && sortedCourses.length > 0 && (
                    <div className="text-center">
                        <div className="h-px w-16 bg-gray-200 mx-auto mb-3" />
                        <p className="text-xs font-medium text-gray-400 tracking-wide">
                            You've unlocked the entire directory boundary line.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Courses;
