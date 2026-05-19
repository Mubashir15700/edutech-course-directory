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

export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "learner";
    isActive: boolean;
    enrolledCourses?: Course[];
    createdAt: string;
}
