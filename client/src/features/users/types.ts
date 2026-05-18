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
