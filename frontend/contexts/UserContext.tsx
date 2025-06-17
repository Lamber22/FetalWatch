import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/UserService';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
  clearUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        console.log('No token found');
        setUser(null);
        return;
      }

      console.log('Loading user data...');
      const userData = await userService.getCurrentUser();
      console.log('User data loaded:', userData);
      
      if (userData) {
        setUser(userData);
      } else {
        setError('No user data received');
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearUser = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Error clearing user data:', err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, loadUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 