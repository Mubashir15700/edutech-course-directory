import { useEffect, useState } from 'react';
import { useGetCoursesQuery } from '../features/courses/coursesApi';
import type { Course } from '../features/courses/types';
import CourseCard from '../components/CourseCard';
import Pagination from '../components/Pagination';
import Filters from '../components/Filters';

function App() {
    const { data, isLoading, error } = useGetCoursesQuery();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 6;

    // Filter logic
    const filteredCourses: Course[] =
        data?.filter((course) => {
            const query = search.toLowerCase();

            return (
                (
                    course.name.toLowerCase().includes(query) ||
                    course.instructor.toLowerCase().includes(query) ||
                    course.category.toLowerCase().includes(query)
                ) &&
                (category ? course.category === category : true)
            );
        }) || [];

    // Sorting logic
    const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (sort === 'rating') return b.rating - a.rating;
        if (sort === 'name') return a.name.localeCompare(b.name);
        return 0;
    });

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCourses = sortedCourses.slice(startIndex, startIndex + itemsPerPage);

    const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, category, sort]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
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
                    {isLoading ?
                        <div className="flex justify-center items-center h-full col-span-full">
                            <p className="text-lg font-semibold">Loading courses...</p>
                        </div>
                        : error ?
                            <div className="flex justify-center items-center h-full col-span-full">
                                <p className="text-red-500 text-lg">Error loading courses</p>
                            </div>
                            : paginatedCourses.length > 0 ? (
                                paginatedCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))) : (
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
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}

export default App;
