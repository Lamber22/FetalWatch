import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authService } from '../services/AuthService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (firstName: string, lastName: string, email: string, password: string, role: string, otp: string) => Promise<void>;
  confirmEmailVerification: (email: string, otp: string) => Promise<{ email: string; verified: boolean }>;
  initiateSignUp: (email: string) => Promise<{ email: string; expiresIn: string }>;
  verifyEmailAndCompleteSignUp: (email: string, otp: string) => Promise<{ email: string; verified: boolean }>;
  resendOTP: (email: string) => Promise<{ email: string; expiresIn: string }>;
  forgotPassword: (email: string) => Promise<{ email: string; expiresIn: string }>;
  verifyPasswordResetOTP: (email: string, otp: string) => Promise<{ resetToken: string; expiresIn: string }>;
  resetPassword: (email: string, resetToken: string, password: string, confirmPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Attempting sign in');
      const response = await authService.signIn({ email, password });
      console.log('AuthContext: Sign in response:', response);
      
      if (response.data?.user) {
        console.log('AuthContext: Setting user from response:', response.data.user);
        const userData = {
          id: response.data.user._id || response.data.user.id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          role: response.data.user.role
        };
        console.log('AuthContext: Mapped user data:', userData);
        setUser(userData);
      } else if (response.token) {
        // If token exists but no user in response, fetch user data
        console.log('AuthContext: Token received, fetching user data');
        const fetchedUser = await authService.getCurrentUser();
        console.log('AuthContext: User data fetched:', fetchedUser);
        const userData = {
          id: fetchedUser._id || fetchedUser.id,
          firstName: fetchedUser.firstName,
          lastName: fetchedUser.lastName,
          email: fetchedUser.email,
          role: fetchedUser.role
        };
        console.log('AuthContext: Mapped fetched user data:', userData);
        setUser(userData);
      }
    } catch (err: any) {
      console.error('AuthContext: Sign in error:', err);
      setError(err.message || 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (firstName: string, lastName: string, email: string, password: string, role: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Attempting sign up');
      const response = await authService.signUp({ firstName, lastName, email, password, role, otp });
      console.log('AuthContext: Sign up response:', response);
      
      // Don't automatically sign in the user after registration
      // They should be redirected to login screen to sign in manually
      
    } catch (err: any) {
      console.error('AuthContext: Sign up error:', err);
      setError(err.message || 'Sign up failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const initiateSignUp = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Initiating sign up with email verification');
      const response = await authService.initiateSignUp({ email });
      console.log('AuthContext: Initiate sign up response:', response);
      
      return {
        email: response.data.email,
        expiresIn: response.data.expiresIn
      };
    } catch (err: any) {
      console.error('AuthContext: Initiate sign up error:', err);
      setError(err.message || 'Failed to initiate registration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmailAndCompleteSignUp = useCallback(async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Verifying email');
      const response = await authService.verifyEmailAndCompleteSignUp({ email, otp });
      console.log('AuthContext: Verify email response:', response);
      
      return {
        email: response.data.email,
        verified: response.data.verified
      };
    } catch (err: any) {
      console.error('AuthContext: Verify email error:', err);
      setError(err.message || 'Email verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendOTP = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Resending OTP');
      const response = await authService.resendOTP({ email });
      console.log('AuthContext: Resend OTP response:', response);
      
      return {
        email: response.data.email,
        expiresIn: response.data.expiresIn
      };
    } catch (err: any) {
      console.error('AuthContext: Resend OTP error:', err);
      setError(err.message || 'Failed to resend verification code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Requesting password reset');
      const response = await authService.forgotPassword({ email });
      console.log('AuthContext: Forgot password response:', response);
      
      return {
        email: response.data.email,
        expiresIn: response.data.expiresIn
      };
    } catch (err: any) {
      console.error('AuthContext: Forgot password error:', err);
      setError(err.message || 'Failed to send reset code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyPasswordResetOTP = useCallback(async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Verifying password reset OTP');
      const response = await authService.verifyPasswordResetOTP({ email, otp });
      console.log('AuthContext: Verify password reset OTP response:', response);
      
      return {
        resetToken: response.data.resetToken,
        expiresIn: response.data.expiresIn
      };
    } catch (err: any) {
      console.error('AuthContext: Verify password reset OTP error:', err);
      setError(err.message || 'Failed to verify reset code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string, resetToken: string, password: string, confirmPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Resetting password');
      const response = await authService.resetPassword({ email, resetToken, password, confirmPassword });
      console.log('AuthContext: Reset password response:', response);
    } catch (err: any) {
      console.error('AuthContext: Reset password error:', err);
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Sign out failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      return await authService.refreshToken();
    } catch (err: any) {
      setError(err.message || 'Token refresh failed');
      return false;
    }
  }, []);


  const confirmEmailVerification = useCallback(async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Confirming email verification');
      const response = await authService.confirmEmailVerification({ email, otp });
      console.log('AuthContext: Email verification confirmed:', response);
      
      return {
        email: response.data.email,
        verified: response.data.verified
      };
    } catch (err: any) {
      console.error('AuthContext: Confirm email verification error:', err);
      setError(err.message || 'Failed to verify email');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth');
        const token = await authService.getCurrentToken();
        if (token) {
          console.log('AuthContext: Token found, fetching user data');
          try {
            const fetchedUser = await authService.getCurrentUser();
            console.log('AuthContext: User info loaded:', fetchedUser);
            const userData = {
              id: fetchedUser._id || fetchedUser.id,
              firstName: fetchedUser.firstName,
              lastName: fetchedUser.lastName,
              email: fetchedUser.email,
              role: fetchedUser.role
            };
            console.log('AuthContext: Mapped initialization user data:', userData);
            setUser(userData);
          } catch (err) {
            console.log('AuthContext: Invalid token, clearing');
            await authService.signOut();
          }
        } else {
          console.log('AuthContext: No token found');
        }
      } catch (err) {
        console.error('AuthContext: Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    initiateSignUp,
    verifyEmailAndCompleteSignUp,
    resendOTP,
    forgotPassword,
    verifyPasswordResetOTP,
    resetPassword,
    signOut,
    refreshToken,
    clearError,
    confirmEmailVerification
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
