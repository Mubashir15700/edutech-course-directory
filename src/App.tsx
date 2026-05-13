import { useEffect, useState } from 'react';
import { useGetCoursesQuery } from './features/courses/coursesApi';
import type { Course } from './features/courses/types';

function App() {
  const { data, isLoading, error } = useGetCoursesQuery();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

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


  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

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

  // Error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading courses</p>
      </div>
    );
  }

  // Empty state
  if (filteredCourses.length === 0) {
    return (
      <div className="p-6 text-center">
        <p>No courses found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        EdTech Course Directory
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by course name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full md:w-60"
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
          className="border p-2 rounded"
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {/* Course List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedCourses.map((course) => (
          <div key={course.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
            <p className="text-gray-600">Instructor: {course.instructor}</p>
            <p className="text-gray-600">Duration: {course.duration}</p>
            <p className="text-gray-600">Category: {course.category}</p>
            <p className="text-yellow-500 font-medium">
              ⭐ {course.rating}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border hover:bg-blue-500 hover:text-white transition"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${currentPage === index + 1
              ? 'bg-blue-500 text-white'
              : ''
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border hover:bg-blue-500 hover:text-white transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
