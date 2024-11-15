// store.ts
import { configureStore } from '@reduxjs/toolkit';
import fetalWatchReducer from '../slices/fetalWatchSlice';
import loginReducer from '../slices/loginSlice';
import homeReducer from '../slices/homeSlice';
import patientReducer from '../slices/patientSlice';
import pregnancyReducer from '../slices/PregnancySlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        fetalWatch: fetalWatchReducer,
        home: homeReducer,
        patients: patientReducer,
        pregnancies: pregnancyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
