// src/api/api.ts
//For api
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://192.168.11.121:5000/api/v1',
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API request config:', config); // Debug log
        return config;
    },
    (error) => {
        console.error('API request error:', error); // Debug log
        return Promise.reject(error);
    }
);

export default api;
