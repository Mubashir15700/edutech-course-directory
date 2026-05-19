import { configureStore } from "@reduxjs/toolkit";
import { coursesApi } from "../features/courses/coursesApi";
import { usersApi } from "../features/users/usersApi";
import { dashboardApi } from "../features/dashboard/dashboardApi";
import { authApi } from "../features/auth/authApi";

export const store = configureStore({
    reducer: {
        [coursesApi.reducerPath]: coursesApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            coursesApi.middleware,
            usersApi.middleware,
            dashboardApi.middleware,
            authApi.middleware
        ),
});
