// store.ts
import { configureStore } from '@reduxjs/toolkit';
import fetalWatchReducer from '../slices/fetalWatchSlice';

export const store = configureStore({
    reducer: {
        fetalWatch: fetalWatchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
