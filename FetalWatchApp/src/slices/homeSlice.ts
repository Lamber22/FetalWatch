import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// Types for Patient and Analytics
interface ContactInformation {
    phone: string;
    email: string;
}

interface EmergencyContact {
    name: string;
    phone: string;
}

interface MedicalHistory {
    previousPregnancies: {
        number: number | null;
        outcomes: string[];
        complications: string[];
    };
    obstetricHistory: {
        gravida: number | null;
        para: number | null;
        abortions: number | null;
    };
    chronicIllnesses: string[];
    allergies: string[];
    contraceptionHistory: string;
    surgicalHistory: string[];
    currentMedications: string[];
}

interface Patient {
    _id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    address: string;
    contactInformation: ContactInformation;
    emergencyContact: EmergencyContact;
    medicalHistory: MedicalHistory;
    pregnancies: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
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
        const response = await api.get('/patients');
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

// Async thunk to fetch patients after adding a new patient
export const fetchPatientsAfterAdd = createAsyncThunk('home/fetchPatientsAfterAdd', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/patients');
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Error fetching patients');
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

        // Fetch patients after adding a new patient
        builder.addCase(fetchPatientsAfterAdd.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPatientsAfterAdd.fulfilled, (state, action) => {
            state.loading = false;
            state.patients = action.payload;
        });
        builder.addCase(fetchPatientsAfterAdd.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { addPatient } = homeSlice.actions;
export default homeSlice.reducer;
