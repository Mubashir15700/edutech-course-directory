export const getVisiblePages = (totalPages: number, currentPage: number) => {
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
