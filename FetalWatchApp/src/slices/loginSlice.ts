import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import api from '../api/api'; // Import the api instance

// Define the initial state of the login
interface LoginState {
    email: string;
    password: string;
    errorMessage: string;
    isAuthenticated: boolean;
    loading: boolean;
}

const initialState: LoginState = {
    email: '',
    password: '',
    errorMessage: '',
    isAuthenticated: false,
    loading: false,
};

// AsyncThunk for login process with API integration
export const handleLogin = createAsyncThunk(
    'login/handleLogin',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/login', { email, password }); // Use the api instance

            // Assuming the token is returned in the response
            const { token } = response.data;

            // Save token to AsyncStorage
            await AsyncStorage.setItem('token', token);

            // Return token and user data
            return response.data;
        } catch (err) {
            const error = err as AxiosError;
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue('An unexpected error occurred');
            }
        }
    }
);

// Create login slice
const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        logout: (state) => {
            state.email = '';
            state.password = '';
            state.errorMessage = '';
            state.isAuthenticated = false;
            AsyncStorage.removeItem('token'); // Clear token on logout
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleLogin.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
            })
            .addCase(handleLogin.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.errorMessage = '';
            })
            .addCase(handleLogin.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.errorMessage = action.payload as string;
            });
    },
});

// Export actions
export const { setEmail, setPassword, logout } = loginSlice.actions;

export default loginSlice.reducer;
