import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// Types for Patient and Analytics
interface Patient {
    _id: string;
    name: string;
    age: number;
    gestationalAge: string;
    expectedDeliveryDate: string;
}

interface Analytics {
    totalPatients: number;
    activePatients: number;
    expectedToday: number;
    expectedThisMonth: number;
    expectedNextMonth: number;
}

interface HomeState {
    patients: Patient[];
    analytics: Analytics | null;
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: HomeState = {
    patients: [],
    analytics: null,
    loading: false,
    error: null,
};

// Async thunk to fetch patients
export const fetchPatients = createAsyncThunk('home/fetchPatients', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/patients'); // Use the shared api instance
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Error fetching patients');
    }
});

// Async thunk to fetch analytics
export const fetchAnalytics = createAsyncThunk('home/fetchAnalytics', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/analytics'); // Use the shared api instance
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Error fetching analytics');
    }
});

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        addPatient: (state, action) => {
            state.patients.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        // Fetch patients
        builder.addCase(fetchPatients.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPatients.fulfilled, (state, action) => {
            state.loading = false;
            state.patients = action.payload;
        });
        builder.addCase(fetchPatients.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Fetch analytics
        builder.addCase(fetchAnalytics.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAnalytics.fulfilled, (state, action) => {
            state.loading = false;
            state.analytics = action.payload;
        });
        builder.addCase(fetchAnalytics.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { addPatient } = homeSlice.actions;
export default homeSlice.reducer;
