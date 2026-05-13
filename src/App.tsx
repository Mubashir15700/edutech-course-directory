import { useEffect, useState } from 'react';
import { useGetCoursesQuery } from './features/courses/coursesApi';
import type { Course } from './features/courses/types';

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
      return (
        course.name.toLowerCase().includes(search.toLowerCase()) &&
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
  }, [search, category]);

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading courses...</p>
      </div>
    );
  }

  const getVisiblePages = () => {
    const pages = [];

    if (totalPages <= 7) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          EdTech Course Directory
        </h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">

          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Categories</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Fullstack">Fullstack</option>
            <option value="Design">Design</option>
            <option value="DevOps">DevOps</option>
            <option value="Cloud">Cloud</option>
            <option value="Architecture">Architecture</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Course List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px] items-start">
          {error ?
            <div className="flex justify-center items-center h-full col-span-full">
              <p className="text-red-500 text-lg">Error loading courses</p>
            </div>
            : paginatedCourses.length > 0 ? (
              paginatedCourses.map((course) => (
                <div
                  key={course.id}
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
              ))) : (
              <div className="flex justify-center items-center h-full col-span-full">
                <p className="text-gray-500 text-lg">
                  No courses match your filters
                </p>
              </div>
            )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-blue-500 hover:text-white transition disabled:opacity-40"
          >
            Prev
          </button>

          {getVisiblePages().map((page, index) =>
            page === '...' ? (
              <span key={index} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setCurrentPage(page as number)}
                className={`px-4 py-2 rounded-lg border transition ${currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-blue-100'
                  }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border bg-white hover:bg-blue-500 hover:text-white transition disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
