interface FiltersProps {
    search: string;
    setSearch: (value: string) => void;
    searchPlaceholder?: string;
    category?: string;
    setCategory?: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
    sortOptions?: { value: string; label: string }[];
}

const Filters = ({
    search,
    setSearch,
    searchPlaceholder,
    category,
    setCategory,
    sort,
    setSort,
    sortOptions,
}: FiltersProps) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
            <input
                type="text"
                placeholder={searchPlaceholder || "🔍 Search courses..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {category !== undefined && setCategory !== undefined && (
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">All Categories</option>
                    <option value={"Web Development"}>Web Development</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="Design">Design</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Data Science">Data Science</option>
                </select>
            )}

            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full md:w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                {sortOptions ? (
                    sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))
                ) : (
                    <>
                        <option value="">Sort By</option>
                        <option value="name">Name</option>
                        <option value="rating">Rating</option>
                    </>
                )}
            </select>
        </div>
    );
};

export default Filters;
