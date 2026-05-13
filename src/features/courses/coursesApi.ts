import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Course } from './types';

const baseQuery = fetchBaseQuery({ baseUrl: '/' });

// Simulate network delay by wrapping the base query
const delayedBaseQuery = async (args: any, api: any, extraOptions: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
    return baseQuery(args, api, extraOptions);
};

export const coursesApi = createApi({
    reducerPath: 'coursesApi',
    baseQuery: delayedBaseQuery,
    endpoints: (builder) => ({
        getCourses: builder.query<Course[], void>({
            query: () => 'courses.json',
        }),
    }),
});

export const { useGetCoursesQuery } = coursesApi;
