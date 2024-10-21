// store.ts
import { configureStore } from '@reduxjs/toolkit';
import fetalWatchReducer from '../slices/fetalWatchSlice';
import loginReducer from '../slices/loginSlice';


export const store = configureStore({
    reducer: {
        login: loginReducer,
        fetalWatch: fetalWatchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
