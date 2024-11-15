import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';

// Async thunks for CRUD operations
export const fetchPregnancies = createAsyncThunk('pregnancies/fetchAll', async () => {
    const response = await api.get('/pregnancies');
    return response.data.data;
});

export const fetchPregnancyById = createAsyncThunk(
    'pregnancies/fetchPregnancyById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/v1/pregnancies/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchPregnanciesByPatientId = createAsyncThunk(
    'pregnancies/fetchPregnanciesByPatientId',
    async (patientId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/api/v1/pregnancies/patient/${patientId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createPregnancy = createAsyncThunk('pregnancies/create', async (pregnancyData: any, { rejectWithValue }) => {
    try {
        const response = await api.post('/pregnancies', pregnancyData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updatePregnancy = createAsyncThunk('pregnancies/update', async ({ id, pregnancyData }: { id: string, pregnancyData: any }) => {
    const response = await api.put(`/pregnancies/${id}`, pregnancyData);
    return response.data.data;
});

export const deletePregnancy = createAsyncThunk('pregnancies/delete', async (id: string) => {
    await api.delete(`/pregnancies/${id}`);
    return id;
});

const pregnancySlice = createSlice({
    name: 'pregnancies',
    initialState: {
        pregnancies: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPregnancies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPregnancies.fulfilled, (state, action) => {
                state.loading = false;
                state.pregnancies = action.payload;
            })
            .addCase(fetchPregnancies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchPregnancyById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPregnancyById.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.pregnancies.findIndex((pregnancy: any) => pregnancy._id === action.payload._id);
                if (index !== -1) {
                    state.pregnancies[index] = action.payload;
                } else {
                    state.pregnancies.push(action.payload);
                }
            })
            .addCase(fetchPregnancyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchPregnanciesByPatientId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPregnanciesByPatientId.fulfilled, (state, action) => {
                state.loading = false;
                state.pregnancies = action.payload;
            })
            .addCase(fetchPregnanciesByPatientId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createPregnancy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPregnancy.fulfilled, (state, action) => {
                state.loading = false;
                state.pregnancies.push(action.payload);
            })
            .addCase(createPregnancy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updatePregnancy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePregnancy.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.pregnancies.findIndex((pregnancy: any) => pregnancy._id === action.payload._id);
                if (index !== -1) {
                    state.pregnancies[index] = action.payload;
                }
            })
            .addCase(updatePregnancy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deletePregnancy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePregnancy.fulfilled, (state, action) => {
                state.loading = false;
                state.pregnancies = state.pregnancies.filter((pregnancy: any) => pregnancy._id !== action.payload);
            })
            .addCase(deletePregnancy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default pregnancySlice.reducer;
