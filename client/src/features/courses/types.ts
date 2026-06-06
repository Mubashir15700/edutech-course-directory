export interface Course {
    _id: string;
    name: string;
    instructor: string;
    duration: string;
    category: string;
    price: number;
    level: string;
    thumbnail: string;
    rating: number;
    numReviews: number;
    isArchived: boolean;
}

interface Lesson {
    title: string;
    duration: string;
    isFreePreview: boolean;
}

export interface Review {
    _id: string;
    user: {
        name: string;
    };
    rating: number;
    comment: string;
    likes: number;
    hasLiked: boolean;
    createdAt: string;
}

export interface CourseDetail extends Course {
    description: string;
    lessons: Lesson[];
    tags: string[];
    reviews: Review[];
}

export interface CoursesResponse {
    data: Course[];
    total: number;
    page: number;
    totalPages: number;
}

export interface GetCoursesArgs {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    tag?: string;
}

export interface CourseDetailResponse {
    data: CourseDetail;
    createdAt: string;
    updatedAt: string;
}
