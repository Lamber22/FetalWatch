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
  otp: string;
}

interface InitiateSignUpData {
  email: string;
}

interface VerifyEmailData {
  email: string;
  otp: string;
}

interface ResendOTPData {
  email: string;
}

interface ForgotPasswordData {
  email: string;
}

interface VerifyResetOTPData {
  email: string;
  otp: string;
}

interface ResetPasswordData {
  email: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
}

interface VerifyEmailOnlyData {
  email: string;
}

interface ConfirmEmailVerificationData {
  email: string;
  otp: string;
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

  // New registration flow with email verification
  async initiateSignUp(data: InitiateSignUpData): Promise<ApiResponse> {
    try {
      console.log('Initiating sign up with email verification:', { 
        email: data.email
      });
      
      const result = await apiService.post('/auth/initiate-signup', data, { skipAuth: true });
      console.log('Sign up initiation successful');
      
      return result;
    } catch (error) {
      console.error('Initiate sign up error:', error);
      throw error;
    }
  },

  async verifyEmailAndCompleteSignUp(data: VerifyEmailData): Promise<ApiResponse> {
    try {
      console.log('Verifying email and completing sign up:', { email: data.email });
      
      const result = await apiService.post('/auth/verify-email', data, { skipAuth: true });
      console.log('Email verification and sign up completion successful');
      
      return result;
    } catch (error) {
      console.error('Verify email and complete sign up error:', error);
      throw error;
    }
  },

  async resendOTP(data: ResendOTPData): Promise<ApiResponse> {
    try {
      console.log('Resending OTP:', { email: data.email });
      
      const result = await apiService.post('/auth/resend-otp', data, { skipAuth: true });
      console.log('OTP resend successful');
      
      return result;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  },

  // Legacy signup (now used for step 3 - complete registration)
  async signUp(data: SignUpData): Promise<ApiResponse> {
    try {
      console.log('Completing registration with:', { email: data.email, role: data.role });
      
      const result = await apiService.post('/auth/signUp', data, { skipAuth: true });
      
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      // Try to call logout endpoint
      await apiService.post('/auth/signout');
    } catch (error) {
      console.warn('Logout endpoint failed:', error);
    } finally {
      // Always clear local tokens
      await apiService.clearTokens();
    }
  },

  // Password reset flow
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    try {
      console.log('Requesting password reset:', { email: data.email });
      
      const result = await apiService.post('/auth/forgot-password', data, { skipAuth: true });
      console.log('Password reset request successful');
      
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  async verifyPasswordResetOTP(data: VerifyResetOTPData): Promise<ApiResponse> {
    try {
      console.log('Verifying password reset OTP:', { email: data.email });
      
      const result = await apiService.post('/auth/verify-reset-otp', data, { skipAuth: true });
      console.log('Password reset OTP verification successful');
      
      return result;
    } catch (error) {
      console.error('Verify password reset OTP error:', error);
      throw error;
    }
  },

  async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    try {
      console.log('Resetting password:', { email: data.email });
      
      const result = await apiService.post('/auth/reset-password', data, { skipAuth: true });
      console.log('Password reset successful');
      
      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
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


  async confirmEmailVerification(data: ConfirmEmailVerificationData): Promise<ApiResponse> {
    try {
      console.log('Confirming email verification:', { email: data.email });
      
      const result = await apiService.post('/auth/confirm-email-verification', data, { skipAuth: true });
      console.log('Email verification confirmed successfully');
      
      return result;
    } catch (error) {
      console.error('Confirm email verification error:', error);
      throw error;
    }
  },

  async resendEmailVerificationOTP(data: VerifyEmailOnlyData): Promise<ApiResponse> {
    try {
      console.log('Resending email verification OTP:', { email: data.email });
      
      const result = await apiService.post('/auth/verify-email-only', data, { skipAuth: true });
      console.log('Email verification OTP resent successfully');
      
      return result;
    } catch (error) {
      console.error('Resend email verification OTP error:', error);
      throw error;
    }
  },
};