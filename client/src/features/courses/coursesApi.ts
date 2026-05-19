import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CourseDetailResponse, CoursesResponse } from "./types";

export const coursesApi = createApi({
    reducerPath: "coursesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getCourses: builder.query<
            CoursesResponse,
            {
                page?: number;
                limit?: number;
                search?: string;
                category?: string;
            }
        >({
            query: ({ page = 1, limit = 6, search = "", category = "" }) => ({
                url: "/courses",
                params: { page, limit, search, category },
            }),
        }),

        getCourseById: builder.query<CourseDetailResponse, string>({
            query: (id) => `/courses/${id}`,
        }),

        createCourse: builder.mutation({
            query: (body) => ({
                url: "/courses",
                method: "POST",
                body,
            }),
        }),

        updateCourse: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/courses/${id}`,
                method: "PUT",
                body,
            }),
        }),

        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetCoursesQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useGetCourseByIdQuery
} = coursesApi;
