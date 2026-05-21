import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CourseDetailResponse, CoursesResponse, GetCoursesArgs } from "./types";

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

        getInfiniteCourses: builder.query<CoursesResponse, GetCoursesArgs>({
            query: ({ page = 1, limit = 6, search = "", category = "" }) => ({
                url: "/courses",
                params: { page, limit, search, category },
            }),
            // Groups cache chunks securely by filters, skipping page indexing counters
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const { search, category } = queryArgs;
                return `${endpointName}-${category || ""}-${search || ""}`;
            },
            // Accumulates state blocks continuously
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page === 1) {
                    return newItems;
                }
                if (!currentCache.data) {
                    currentCache.data = [];
                }
                const existingIds = new Set(currentCache.data.map((item) => item._id));
                const uniqueNewItems = newItems.data.filter((item) => !existingIds.has(item._id));

                currentCache.data.push(...uniqueNewItems);
                currentCache.page = newItems.page;
                currentCache.totalPages = newItems.totalPages;
                currentCache.total = newItems.total;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
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
    useGetInfiniteCoursesQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useGetCourseByIdQuery
} = coursesApi;
