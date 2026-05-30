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
        getChatHistory: builder.query<any[], { roomId: string; before?: string }>({
            query: ({ roomId, before }) => ({
                url: `/chat/history${roomId ? `/${roomId}` : ""}`,
                params: before ? { before } : {},
            }),
        }),

        getAdminActiveChats: builder.query<any[], void>({
            query: () => "/chat/admin/active-rooms",
        })
    }),
});

export const { useLazyGetChatHistoryQuery, useGetAdminActiveChatsQuery } = chatApi;
