import { useEffect, useRef, useState } from "react";

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

function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, callback: () => void) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
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
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const categoryRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    useOutsideClick(categoryRef, () => setIsCategoryOpen(false));
    useOutsideClick(sortRef, () => setIsSortOpen(false));

    // Fallback sort options if props aren't provided
    const defaultSortOptions = sortOptions || [
        { value: "name", label: "Name" },
        { value: "rating", label: "Rating" }
    ];

    const categoryOptions = [
        "Web Development",
        "Mobile Apps",
        "Design",
        "DevOps",
        "Cybersecurity",
        "Data Science"
    ];

    // Find active labels for the display buttons
    const activeSortLabel = defaultSortOptions.find((o: any) => o.value === sort)?.label || "Sort By";

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search input takes full width on mobile, fills remaining space on desktop */}
            <div className="flex-1 w-full">
                <input
                    type="text"
                    placeholder={searchPlaceholder || "🔍 Search courses..."}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
            </div>

            {/* Mobile Wrapper: Puts dropdowns side-by-side on mobile, resets grid on desktop */}
            <div className="grid grid-cols-2 gap-3 w-full md:flex md:w-auto md:gap-4">
                {category !== undefined && setCategory !== undefined && (
                    <div ref={categoryRef} className="relative w-full md:w-56">
                        <button
                            type="button"
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className={`flex items-center justify-between w-full p-2.5 bg-white border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/20 text-left ${isCategoryOpen ? "border-blue-500 ring-2 ring-blue-400/20" : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <span className={`truncate ${category ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
                                {category || "All Categories"}
                            </span>
                            <span className={`text-xs text-gray-400 transition-transform duration-200 ml-2 shrink-0 ${isCategoryOpen ? "rotate-180 text-blue-500" : ""}`}>
                                ▼
                            </span>
                        </button>

                        {/* Menu Popover */}
                        {isCategoryOpen && (
                            <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                <button
                                    type="button"
                                    onClick={() => { setCategory(""); setIsCategoryOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${category === "" ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    All Categories
                                </button>
                                {categoryOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => { setCategory(opt); setIsCategoryOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${category === opt ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div ref={sortRef} className="relative w-full md:w-44">
                    <button
                        type="button"
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className={`flex items-center justify-between w-full p-2.5 bg-white border rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/20 text-left ${isSortOpen ? "border-blue-500 ring-2 ring-blue-400/20" : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <span className={`truncate ${sort ? "text-gray-900 font-semibold" : "text-gray-500"}`}>
                            {sort ? `Sort: ${activeSortLabel}` : "Sort By"}
                        </span>
                        <span className={`text-xs text-gray-400 transition-transform duration-200 ml-2 shrink-0 ${isSortOpen ? "rotate-180 text-blue-500" : ""}`}>
                            ▼
                        </span>
                    </button>

                    {/* Menu Popover */}
                    {isSortOpen && (
                        <div className="absolute left-0 right-0 z-50 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                            {defaultSortOptions.map((option: any) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => { setSort(option.value); setIsSortOpen(false); }}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${sort === option.value ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Filters;
