import { configureStore } from '@reduxjs/toolkit';
import { coursesApi } from '../features/courses/coursesApi';
import { usersApi } from '../features/users/usersApi';

export const store = configureStore({
    reducer: {
        [coursesApi.reducerPath]: coursesApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(coursesApi.middleware, usersApi.middleware),
});
