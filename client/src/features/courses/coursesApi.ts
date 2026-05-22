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
    tagTypes: ["Course"],
    endpoints: (builder) => ({
        getCourses: builder.query<
            CoursesResponse,
            {
                page?: number;
                limit?: number;
                search?: string;
                category?: string;
                isAdmin?: boolean;
            }
        >({
            query: ({ page = 1, limit = 6, search = "", category = "", isAdmin = true }) => ({
                url: "/courses",
                params: { page, limit, search, category, isAdmin },
            }),
            providesTags: [{ type: "Course" }],
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

        getCourseById: builder.query<CourseDetailResponse, { id: string; userId?: string; fetchReviews?: boolean }>({
            query: ({ id, userId, fetchReviews }) => ({
                url: `/courses/${id}`,
                method: "GET",
                params: {
                    userId,
                    fetchReviews: fetchReviews ? "true" : "false"
                },
            }),
            providesTags: (_result, _error, arg) => [{ type: "Course", id: arg.id }],
        }),

        toggleLikeReview: builder.mutation({
            query: (reviewId) => ({
                url: `/reviews/toggle-like/${reviewId}`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Course", id: arg.courseId }],
        }),

        addReview: builder.mutation<any, { courseId: string; rating: number; comment: string }>({
            query: ({ courseId, ...body }) => ({
                url: `/reviews/${courseId}`,
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Course', id: arg.courseId }],
        }),

        updateReview: builder.mutation<any, { reviewId: string; rating: number; comment: string; courseId: string }>({
            query: ({ reviewId, courseId, ...body }) => ({
                url: `/reviews/${reviewId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Course', id: arg.courseId }],
        }),

        deleteReview: builder.mutation<any, { reviewId: string; courseId: string }>({
            query: ({ reviewId }) => ({
                url: `/reviews/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: 'Course', id: arg.courseId }],
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

        toggleArchiveCourse: builder.mutation({
            query: (id) => ({
                url: `/courses/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: [{ type: "Course" }],
        }),
    }),
});

export const {
    useGetCoursesQuery,
    useGetInfiniteCoursesQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useToggleArchiveCourseMutation,
    useAddReviewMutation,
    useUpdateReviewMutation,
    useDeleteReviewMutation,
    useGetCourseByIdQuery,
    useToggleLikeReviewMutation
} = coursesApi;
