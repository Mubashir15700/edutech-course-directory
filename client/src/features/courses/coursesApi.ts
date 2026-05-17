import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CoursesResponse } from './types';

export const coursesApi = createApi({
    reducerPath: 'coursesApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    endpoints: (builder) => ({
        getCourses: builder.query<
            CoursesResponse,
            { page?: number; limit?: number; search?: string; category?: string }
        >({
            query: ({ page = 1, limit = 6, search = '', category = '' }) => ({
                url: '/courses',
                params: { page, limit, search, category },
            }),
        }),
    }),
});

export const { useGetCoursesQuery } = coursesApi;
