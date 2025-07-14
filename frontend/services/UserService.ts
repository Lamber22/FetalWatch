import { apiService } from './API';
import { User, PendingUser, CreateUserData } from '../interface/iUser';
 
export const userService = {
  async getCurrentUser(): Promise<User> {
    try {
      console.log('Fetching current user...');
      const result = await apiService.get<User>('/users/me');

      if (result.status === 'success' && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to fetch user data');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  async getUser(userId: string): Promise<User> {
    const result = await apiService.getById<User>('users', userId);
    return result.data!;
  },

  async getAllUsers(): Promise<User[]> {
    const result = await apiService.get<User[]>("/users");
    return result.data!;
  },

  async getUsersByRole(role: string): Promise<User[]> {
    const result = await apiService.get<User[]>(`/users/role/${role}`);
    return result.data!;
  },

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const result = await apiService.update<User>('users', userId, data);
    return result.data!;
  },

  async deleteUser(userId: string): Promise<void> {
    await apiService.remove('users', userId);
  },

  // Create user by health provider
  async createUser(data: CreateUserData): Promise<User> {
    try {
      console.log('Creating user:', { email: data.email, role: data.role });
      const result = await apiService.post('/users/create', data);
      
      if (result.status === 'success' && result.data) {
        return result.data.user || result.data;
      }
      throw new Error(result.message || 'Failed to create user');
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  // Get pending activation users (admin only)
  async getPendingActivationUsers(): Promise<PendingUser[]> {
    try {
      console.log('Fetching pending activation users...');
      // Ensure token is attached by not passing skipAuth or custom config
      const result = await apiService.get('/users/pending-activation');
      
      if (result.status === 'success' && result.data) {
        return result.data.users || [];
      }
      throw new Error(result.message || 'Failed to fetch pending users');
    } catch (error) {
      console.error('Get pending users error:', error);
      throw error;
    }
  },

  // Activate user account (admin only)
  async activateUser(userId: string): Promise<User> {
    try {
      console.log('Activating user:', userId);
      const result = await apiService.put(`/users/${userId}/activate`, {});
      
      if (result.status === 'success' && result.data) {
        return result.data.user || result.data;
      }
      throw new Error(result.message || 'Failed to activate user');
    } catch (error) {
      console.error('Activate user error:', error);
      throw error;
    }
  },

  // Deactivate user account (admin only)
  async deactivateUser(userId: string): Promise<User> {
    try {
      console.log('Deactivating user:', userId);
      const result = await apiService.put(`/users/${userId}/deactivate`, {});
      
      if (result.status === 'success' && result.data) {
        return result.data.user || result.data;
      }
      throw new Error(result.message || 'Failed to deactivate user');
    } catch (error) {
      console.error('Deactivate user error:', error);
      throw error;
    }
  },
};