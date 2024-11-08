import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

const API_URL = '/patients';

// Async thunks for API calls
export const createPatient = createAsyncThunk('patients/create', async (patientData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, patientData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getPatients = createAsyncThunk('patients/getAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getPatientById = createAsyncThunk('patients/getById', async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updatePatient = createAsyncThunk('patients/update', async ({ id, patientData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, patientData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletePatient = createAsyncThunk('patients/delete', async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const managePatients = createAsyncThunk('patients/manage', async ({ page, limit, search }, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL, { params: { page, limit, search } });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Slice
const patientSlice = createSlice({
    name: 'patients',
    initialState: {
        patients: [],
        patient: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.patients.push(action.payload.data);
            })
            .addCase(createPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getPatients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPatients.fulfilled, (state, action) => {
                state.loading = false;
                state.patients = action.payload.data;
            })
            .addCase(getPatients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getPatientById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPatientById.fulfilled, (state, action) => {
                state.loading = false;
                state.patient = action.payload.data;
            })
            .addCase(getPatientById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePatient.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.patients.findIndex(patient => patient._id === action.payload.data._id);
                if (index !== -1) {
                    state.patients[index] = action.payload.data;
                }
            })
            .addCase(updatePatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePatient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePatient.fulfilled, (state, action) => {
                state.loading = false;
                state.patients = state.patients.filter(patient => patient._id !== action.payload.data._id);
            })
            .addCase(deletePatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(managePatients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(managePatients.fulfilled, (state, action) => {
                state.loading = false;
                state.patients = action.payload.patients;
            })
            .addCase(managePatients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default patientSlice.reducer;