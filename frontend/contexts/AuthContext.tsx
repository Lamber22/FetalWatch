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
  signUp: (firstName: string, lastName: string, email: string, password: string, role: string) => Promise<void>;
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

  const signUp = useCallback(async (firstName: string, lastName: string, email: string, password: string, role: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('AuthContext: Attempting sign up');
      const response = await authService.signUp({ firstName, lastName, email, password, role });
      console.log('AuthContext: Sign up response:', response);
      
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
      console.error('AuthContext: Sign up error:', err);
      setError(err.message || 'Sign up failed');
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
    signOut,
    refreshToken,
    clearError,
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
