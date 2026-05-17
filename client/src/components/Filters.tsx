interface FiltersProps {
    search: string;
    setSearch: (value: string) => void;
    category: string;
    setCategory: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
}

const Filters = ({ search, setSearch, category, setCategory, sort, setSort }: FiltersProps) => {
    return (
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
    )
}

export default Filters