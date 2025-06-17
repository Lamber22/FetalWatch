import { apiService, ApiResponse } from './API';

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
  async signIn(data: SignInData): Promise<ApiResponse> {
    try {
      console.log('Attempting sign in with:', { 
        email: data.email,
        hasPassword: !!data.password 
      });
      
      const result = await apiService.post('/auth/signIn', data, { skipAuth: true });
      console.log('Sign in successful');
      
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signUp(data: SignUpData): Promise<ApiResponse> {
    try {
      console.log('Attempting sign up with:', { email: data.email });
      
      const result = await apiService.post('/auth/signUp', data, { skipAuth: true });
      
      // If registration is successful but no token is returned, sign in the user
      if (!result.token) {
        return await this.signIn({
          email: data.email,
          password: data.password,
        });
      }

      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      // Try to call logout endpoint
      await apiService.post('/auth/signOut');
    } catch (error) {
      console.warn('Logout endpoint failed:', error);
    } finally {
      // Always clear local tokens
      await apiService.clearTokens();
    }
  },

  async refreshToken(): Promise<boolean> {
    return await apiService.refreshAccessToken();
  },

  async getCurrentToken(): Promise<string | null> {
    return await apiService.getToken();
  },

  async getCurrentUser(): Promise<any> {
    try {
      console.log('Getting current user with token...');
      const result = await apiService.get('/user/current');
      console.log('Current user data received:', result);
      return result.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
};