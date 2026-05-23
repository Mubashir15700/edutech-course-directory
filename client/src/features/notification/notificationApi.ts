import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BACKEND_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('authorization', `Bearer ${token}`);
            return headers;
        }
    }),
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query<any[], void>({
            query: () => '/notifications',
            transformResponse: (response: { data: any[] }) => response.data,
            providesTags: ['Notification'],
            // Hook up WebSocket listeners inside the RTK cache lifecycle
            async onCacheEntryAdded(_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;

                    // Access your global socket reference instance here
                    const { socket } = await import('../../utils/socket');

                    socket.on('notification_received', (newNotification: any) => {
                        updateCachedData((draft) => {
                            draft.unshift(newNotification); // Prepend new notification to the array
                        });
                    });
                } catch { }
                await cacheEntryRemoved;
            }
        }),
        markAllRead: builder.mutation<void, void>({
            query: () => ({ url: '/notifications/mark-read', method: 'PUT' }),
            invalidatesTags: ['Notification']
        })
    })
});

export const { useGetNotificationsQuery, useMarkAllReadMutation } = notificationApi;
