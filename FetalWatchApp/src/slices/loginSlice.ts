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
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
        try {
            console.log('Sending login request to /auth/signIn with:', { email, password }); // Debug log
            const response = await api.post('/auth/signIn', { email, password });
            console.log('Login response:', response.data); // Debug log
            const { token } = response.data;
            await AsyncStorage.setItem('token', token);
            return response.data;
        } catch (err) {
            console.error('Login error:', err); // Debug log
            if (err instanceof AxiosError) {
                console.error('Axios error message:', err.message); // Debug log
                console.error('Axios error stack:', err.stack); // Debug log
            }
            const error = err as AxiosError;
            if (error.response && error.response.data) {
                console.error('Error response data:', error.response.data); // Debug log
                return rejectWithValue('Wrong email or password');
            } else {
                return rejectWithValue('Something went wrong. Please try again.');
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
        login: (state, action: PayloadAction<{ email: string; password: string }>) => {
            state.email = action.payload.email;
            state.password = action.payload.password;
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
export const { setEmail, setPassword, logout, login } = loginSlice.actions;

export default loginSlice.reducer;
