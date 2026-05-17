export interface Course {
    _id: string;
    name: string;
    instructor: string;
    duration: string;
    category: string;
    rating: number;
}

export interface CoursesResponse {
    data: Course[];
    total: number;
    page: number;
    totalPages: number;
}
