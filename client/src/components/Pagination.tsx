import { getVisiblePages } from "../utils/pagination";

interface PaginationProps {
    currentPage: number
    totalPages: number
    setCurrentPage: (page: number | ((prev: number) => number)) => void
    marginTop?: string
}

const Pagination = ({ currentPage, totalPages, setCurrentPage, marginTop }: PaginationProps) => {
    return (
        <div className={`flex justify-center items-center gap-2 ${marginTop || 'mt-10'} flex-wrap`}>
            <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1 || totalPages === 0}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-blue-500 hover:text-white transition disabled:opacity-40"
            >
                Prev
            </button>

            {getVisiblePages(totalPages, currentPage).map((page, index) =>
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
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-blue-500 hover:text-white transition disabled:opacity-40"
            >
                Next
            </button>
        </div>
    )
}

export default Pagination