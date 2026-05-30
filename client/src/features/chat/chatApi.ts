import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getChatHistory: builder.query<any[], string | void>({
            query: (roomId) => `/chat/history${roomId ? `/${roomId}` : ""}`,
        }),

        getAdminActiveChats: builder.query<any[], void>({
            query: () => "/chat/admin/active-rooms",
        })
    }),
});

export const { useGetChatHistoryQuery, useGetAdminActiveChatsQuery } = chatApi;
