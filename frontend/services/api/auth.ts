import { API_CONFIG, getHeaders } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export const authService = {
  async signIn(data: SignInData) {
    try {
      console.log('Attempting sign in with:', { 
        email: data.email,
        hasPassword: !!data.password 
      });
      const url = `${API_CONFIG.BASE_URL}/auth/signIn`;
      console.log('Sign in URL:', url);
      
      const headers = await getHeaders();
      console.log('Request headers:', headers);
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      console.log('Sign in response status:', response.status);
      const result = await response.json();
      console.log('Sign in response:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Sign in failed');
      }

      if (result.token) {
        await AsyncStorage.setItem('token', result.token);
      } else {
        console.warn('No token received in signin response');
      }

      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred. Please check your connection.');
    }
  },

  async signUp(data: SignUpData) {
    try {
      console.log('Attempting sign up with:', { email: data.email });
      const url = `${API_CONFIG.BASE_URL}/auth/signUp`;
      console.log('Sign up URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      console.log('Sign up response status:', response.status);
      const result = await response.json();
      console.log('Sign up response:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Sign up failed');
      }

      // If registration is successful but no token is returned, sign in the user
      if (!result.token) {
        const signInResponse = await this.signIn({
          email: data.email,
          password: data.password,
        });
        return signInResponse;
      }

      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred. Please check your connection.');
    }
  },

  async signOut() {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
}; 