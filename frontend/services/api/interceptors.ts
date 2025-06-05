import { API_CONFIG } from './config';
import { handleAPIError } from './errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RequestInterceptor {
  onRequest?: (config: RequestInit) => Promise<RequestInit> | RequestInit;
  onRequestError?: (error: any) => Promise<any>;
}

interface ResponseInterceptor {
  onResponse?: (response: Response) => Promise<Response> | Response;
  onResponseError?: (error: any) => Promise<any>;
}

const requestInterceptors: RequestInterceptor[] = [
  {
    onRequest: async (config) => {
      // Add auth token if available
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
  },
];

const responseInterceptors: ResponseInterceptor[] = [
  {
    onResponse: async (response) => {
      // Handle token refresh if needed
      if (response.status === 401) {
        // Implement token refresh logic here
      }
      return response;
    },
    onResponseError: async (error) => {
      return handleAPIError(error);
    },
  },
];

export const applyInterceptors = async (
  url: string,
  config: RequestInit
): Promise<Response> => {
  let finalConfig = { ...config };

  // Apply request interceptors
  for (const interceptor of requestInterceptors) {
    if (interceptor.onRequest) {
      try {
        finalConfig = await interceptor.onRequest(finalConfig);
      } catch (error) {
        if (interceptor.onRequestError) {
          await interceptor.onRequestError(error);
        }
        throw error;
      }
    }
  }

  // Make the request
  let response: Response;
  try {
    response = await fetch(url, finalConfig);
  } catch (error) {
    throw handleAPIError(error);
  }

  // Apply response interceptors
  for (const interceptor of responseInterceptors) {
    if (interceptor.onResponse) {
      try {
        response = await interceptor.onResponse(response);
      } catch (error) {
        if (interceptor.onResponseError) {
          await interceptor.onResponseError(error);
        }
        throw error;
      }
    }
  }

  return response;
}; 