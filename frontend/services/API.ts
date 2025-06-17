import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleAPIError } from './ErrorHandler';
import Constants from 'expo-constants';

// Secure configuration using environment variables
const getApiUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL
  
  if (!envUrl) {
    throw new Error('API_URL environment variable is not defined. Please check your .env configuration and ensure it uses EXPO_PUBLIC_API_URL.');
  }
  
  return envUrl;
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 30000,
  TOKEN_KEY: 'token',
  REFRESH_TOKEN_KEY: 'refreshToken',
};

interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  token?: string;
  refreshToken?: string;
}

interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: any;
  skipAuth?: boolean;
  skipJsonParse?: boolean;
}

class APIService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    console.log('APIService initialized with baseURL configured from environment');
  }

  // Token management
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(API_CONFIG.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(API_CONFIG.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(API_CONFIG.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  async setRefreshToken(refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(API_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([API_CONFIG.TOKEN_KEY, API_CONFIG.REFRESH_TOKEN_KEY]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Header configuration
  async getHeaders(skipAuth = false): Promise<Record<string, string>> {
    const headers = { ...this.defaultHeaders };
    
    if (!skipAuth) {
      const token = await this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  // Token refresh logic
  async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: await this.getHeaders(true),
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const result: ApiResponse = await response.json() as ApiResponse;
      
      if (result.token) {
        await this.setToken(result.token);
        if (result.refreshToken) {
          await this.setRefreshToken(result.refreshToken);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.clearTokens();
      return false;
    }
  }

  // Core request method
  async request<T = any>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { 
      skipAuth = false, 
      skipJsonParse = false, 
      body, 
      ...restConfig 
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    console.log(`🔄 API Request: ${config.method || 'GET'} ${url}`);

    try {
      const headers = await this.getHeaders(skipAuth);
      
      const requestConfig: RequestInit = {
        ...restConfig,
        headers: {
          ...headers,
          ...(restConfig.headers as Record<string, string> || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      };

      let response = await fetch(url, requestConfig);

      // Handle 401 - try to refresh token once
      if (response.status === 401 && !skipAuth) {
        console.log('🔄 Token expired, attempting refresh...');
        const refreshSuccess = await this.refreshAccessToken();
        
        if (refreshSuccess) {
          // Retry request with new token
          const newHeaders = await this.getHeaders();
          requestConfig.headers = {
            ...newHeaders,
            ...(restConfig.headers as Record<string, string> || {}),
          };
          response = await fetch(url, requestConfig);
        } else {
          throw new Error('Authentication failed - please login again');
        }
      }

      console.log(`✅ API Response: ${response.status} ${response.statusText}`);

      if (skipJsonParse) {
        return response as any;
      }

      const result: ApiResponse<T> = await response.json() as ApiResponse<T>;
      
      // Store new tokens if provided
      if (result.token) {
        await this.setToken(result.token);
      }
      if (result.refreshToken) {
        await this.setRefreshToken(result.refreshToken);
      }

      if (!response.ok) {
        throw new Error(result.message || `API Error: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error(`❌ API Error: ${config.method || 'GET'} ${url}`, error);
      throw handleAPIError(error);
    }
  }

  // CRUD Operations
  async get<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { 
      ...config, 
      method: 'POST', 
      body: data 
    });
  }

  async put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { 
      ...config, 
      method: 'PUT', 
      body: data 
    });
  }

  async patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { 
      ...config, 
      method: 'PATCH', 
      body: data 
    });
  }

  async delete<T = any>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Utility methods for common patterns
  async getById<T = any>(resource: string, id: string): Promise<ApiResponse<T>> {
    return this.get<T>(`/${resource}/${id}`);
  }

  async getByQuery<T = any>(resource: string, query: Record<string, any> = {}): Promise<ApiResponse<T>> {
    const queryString = new URLSearchParams(query).toString();
    const endpoint = queryString ? `/${resource}?${queryString}` : `/${resource}`;
    return this.get<T>(endpoint);
  }

  async create<T = any>(resource: string, data: any): Promise<ApiResponse<T>> {
    return this.post<T>(`/${resource}`, data);
  }

  async update<T = any>(resource: string, id: string, data: any): Promise<ApiResponse<T>> {
    return this.put<T>(`/${resource}/${id}`, data);
  }

  async remove<T = any>(resource: string, id: string): Promise<ApiResponse<T>> {
    return this.delete<T>(`/${resource}/${id}`);
  }

  // File upload utility
  async uploadFile<T = any>(endpoint: string, file: File | FormData, config?: RequestConfig): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (!(file instanceof FormData)) {
      formData.append('file', file);
    }

    const headers = await this.getHeaders();
    delete headers['Content-Type']; // Let browser set multipart boundary

    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      headers: {
        ...headers,
        ...(config?.headers as Record<string, string> || {}),
      },
      body: formData,
    } as any);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health', { skipAuth: true });
      return response.status === 'success';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Create and export singleton instance
export const apiService = new APIService();

// Legacy exports for backward compatibility
export const getHeaders = () => apiService.getHeaders();
export const apiRequest = (endpoint: string, options?: RequestConfig) => 
  apiService.request(endpoint, options);

// Export types
export type { ApiResponse, RequestConfig };