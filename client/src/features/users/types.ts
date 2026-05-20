import type { Course } from "../courses/types";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "learner";
    createdAt: string;
}

export interface UsersResponse {
    data: User[];
    total: number;
    page: number;
    totalPages: number;
}

interface CoursesWithProgress {
    _id: string;
    name: string;
    instructor: string;
    thumbnail: string;
    category: string;
    progress: number;
    totalLessons: number;
    completedLessonsCount: number;
    lessons: any[];
    completedLessons: string[];
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "learner";
    isActive: boolean;
    enrolledCourses?: CoursesWithProgress[];
    createdAt: string;
}
