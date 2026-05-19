import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DashboardStats } from "./types";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",

    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStats, void>({
            query: () => "/dashboard/stats",
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
} = dashboardApi;
