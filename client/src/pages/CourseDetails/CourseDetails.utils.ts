import type { CompactReview, StarMetrics } from "./CourseDetails.types";

export const calculateStarBreakdown = (
    otherReviews: CompactReview[] = [],
    userReview: CompactReview | null | undefined = null
): StarMetrics[] => {
    // Combine arrays or filter entries efficiently 
    const allReviews = [...otherReviews];
    if (userReview) {
        allReviews.push(userReview);
    }

    const total = allReviews.length;
    const counts: Record<1 | 2 | 3 | 4 | 5, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    // Process all reviews in a single clean pass
    allReviews.forEach((rev) => {
        const rating = Math.round(rev.rating);
        // Guard against unexpected out-of-bounds numbers from the DB
        if (rating >= 1 && rating <= 5) {
            counts[rating as 1 | 2 | 3 | 4 | 5]++;
        }
    });

    // Map straight to the required visual structure
    return [5, 4, 3, 2, 1].map((stars) => {
        const count = counts[stars as 1 | 2 | 3 | 4 | 5];
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        return {
            stars,
            pct: `${percentage}%`,
        };
    });
};
