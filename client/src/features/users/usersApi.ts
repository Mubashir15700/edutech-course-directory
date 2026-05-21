import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IUser, UsersResponse } from "./types";

export const usersApi = createApi({
    reducerPath: "usersApi",
    tagTypes: ["UserProfile"],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getLearners: builder.query<
            UsersResponse,
            { page: number; limit: number; search: string }
        >({
            query: ({ page, limit, search }) =>
                `/users?role=learner&page=${page}&limit=${limit}&search=${search}`,
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
        }),

        getProfile: builder.query<IUser, void>({
            query: () => ({
                url: "/users/profile",
                method: "GET",
            }),
            providesTags: [{ type: "UserProfile" }],
        }),

        updateProfile: builder.mutation<void, { name: string }>({
            query: ({ name }) => ({
                url: "/users/profile",
                method: "PUT",
                body: { name },
            }),
            invalidatesTags: [{ type: "UserProfile" }],
        }),

        createCheckoutSession: builder.mutation<{ mode: "free" | "paid"; url?: string; message?: string }, { courseId: string }>({
            query: ({ courseId }) => ({
                url: "/enrollments/checkout",
                method: "POST",
                body: { courseId },
            }),
            invalidatesTags: ["UserProfile"],
        }),

        verifyStripeSession: builder.mutation<{ success: boolean; enrollment?: any }, { sessionId: string }>({
            query: ({ sessionId }) => ({
                url: "/enrollments/verify-session",
                method: "POST",
                body: { sessionId },
            }),
            invalidatesTags: ["UserProfile"],
        }),

        completeLesson: builder.mutation<void, { courseId: string; lessonId: string }>({
            query: ({ courseId, lessonId }) => ({
                url: `/users/courses/complete-lesson`,
                method: "POST",
                body: { courseId, lessonId },
            }),
            // This tells RTK Query to instantly re-fetch getProfile, 
            // updating your progress bars across the screen in real-time!
            invalidatesTags: [{ type: "UserProfile" }],
        }),
    }),
});

export const { useGetLearnersQuery, useDeleteUserMutation, useGetProfileQuery, useUpdateProfileMutation, useCreateCheckoutSessionMutation, useVerifyStripeSessionMutation, useCompleteLessonMutation } = usersApi;
