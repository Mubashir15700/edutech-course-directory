export interface CompactReview {
    rating: number;
    [key: string]: any; // Allows flexibility for other payload properties
}

export interface StarMetrics {
    stars: number;
    pct: string;
}
