import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/UserService';
import { User, PendingUser, CreateUserData } from '../interface/iUser';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
  clearUser: () => Promise<void>;
  createUser: (data: CreateUserData) => Promise<User>;
  getPendingActivationUsers: () => Promise<PendingUser[]>;
  activateUser: (userId: string) => Promise<User>;
  deactivateUser: (userId: string) => Promise<User>;
  getUsersByRole: (role: string) => Promise<User[]>;
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

  const createUser = async (data: CreateUserData): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Creating user...', { email: data.email, role: data.role });
      const userData = await userService.createUser(data);
      console.log('User created successfully:', userData);
      return userData;
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPendingActivationUsers = async (): Promise<PendingUser[]> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading pending activation users...');
      const users = await userService.getPendingActivationUsers();
      console.log('Pending users loaded:', users);
      return users;
    } catch (err) {
      console.error('Error loading pending users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pending users');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (userId: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Activating user...', userId);
      const userData = await userService.activateUser(userId);
      console.log('User activated successfully:', userData);
      return userData;
    } catch (err) {
      console.error('Error activating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to activate user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (userId: string): Promise<User> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Deactivating user...', userId);
      const userData = await userService.deactivateUser(userId);
      console.log('User deactivated successfully:', userData);
      return userData;
    } catch (err) {
      console.error('Error deactivating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to deactivate user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUsersByRole = async (role: string): Promise<User[]> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading users by role...', role);
      const users = await userService.getUsersByRole(role);
      console.log('Users loaded by role:', users);
      return users;
    } catch (err) {
      console.error('Error loading users by role:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, loadUser, clearUser, createUser, getPendingActivationUsers, activateUser, deactivateUser, getUsersByRole }}>
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