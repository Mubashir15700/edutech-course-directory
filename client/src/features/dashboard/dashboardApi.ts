import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { DashboardStats, LandingPageStats } from "./types";

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
        getAdminDashboardStats: builder.query<DashboardStats, void>({
            query: () => "/dashboard/stats",
        }),

        getLandingPageStats: builder.query<LandingPageStats, void>({
            query: () => "/dashboard/landing-stats",
        }),
    }),
});

export const { useGetAdminDashboardStatsQuery, useGetLandingPageStatsQuery } = dashboardApi;
