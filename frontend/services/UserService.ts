import { apiService, ApiResponse } from './API';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  // Add other user fields as needed
}

export const userService = {
  async getCurrentUser(): Promise<User> {
    try {
      console.log('Fetching current user...');
      const result = await apiService.get<User>('/user/current');

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
    const result = await apiService.getById<User>('user', userId);
    return result.data!;
  },

  async getUsersByRole(role: string): Promise<User[]> {
    const result = await apiService.get<User[]>(`/user/role/${role}`);
    return result.data!;
  },

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const result = await apiService.update<User>('user', userId, data);
    return result.data!;
  },

  async deleteUser(userId: string): Promise<void> {
    await apiService.remove('user', userId);
  },
};