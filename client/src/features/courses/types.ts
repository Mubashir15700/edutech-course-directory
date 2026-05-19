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
}

export interface CourseDetail extends Course {
    description: string;
    lessons: { title: string, duration: "12 mins", isFreePreview: true }[];
    tags: string[];
}

export interface CoursesResponse {
    data: Course[];
    total: number;
    page: number;
    totalPages: number;
}

export interface CourseDetailResponse {
    data: CourseDetail;
    createdAt: string;
    updatedAt: string;
}
