import { applyInterceptors } from './interceptors';
import { handleAPIError } from './errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get the local IP address for development
const DEV_API_URL = 'http://10.21.1.175:5000/api/v1'; // For web development
// const DEV_API_URL = 'http://10.0.2.2:5000/api/v1'; // For Android emulator
// const DEV_API_URL = 'http://localhost:5000/api/v1'; // For iOS simulator

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || DEV_API_URL,
  TIMEOUT: 30000,
};

export const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('Making API request to:', url); // Debug log
  
  const headers = await getHeaders();
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    return await applyInterceptors(url, config);
  } catch (error) {
    console.error('API request failed:', error); // Debug log
    throw handleAPIError(error);
  }
}; 