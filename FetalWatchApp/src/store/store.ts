// store.ts
import { configureStore } from '@reduxjs/toolkit';
import fetalWatchReducer from '../slices/fetalWatchSlice';
import loginReducer from '../slices/loginSlice';
import homeReducer from '../slices/homeSlice';
import patientReducer from '../slices/patientSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        fetalWatch: fetalWatchReducer,
        home: homeReducer,
        patients: patientReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
