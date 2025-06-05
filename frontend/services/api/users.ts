import { API_CONFIG, getHeaders } from './config';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  // Add other user fields as needed
}

interface ApiResponse {
  status: string;
  data: User;
  message?: string;
}

export const userService = {
  async getCurrentUser() {
    try {
      console.log('Fetching current user...');
      const response = await fetch(`${API_CONFIG.BASE_URL}/user/current`, {
        headers: await getHeaders(),
      });

      console.log('User response status:', response.status);
      const result = await response.json();
      console.log('User response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch current user');
      }

      if (result.status === 'success' && result.data) {
        return result.data;
      }
      throw new Error(result.message || 'Failed to fetch user data');
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  async getUser(userId: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/user/${userId}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  async getUsersByRole(role: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/user/role/${role}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users by role');
      }

      return await response.json();
    } catch (error) {
      console.error('Get users by role error:', error);
      throw error;
    }
  },

  async updateUser(userId: string, data: Partial<User>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/user/${userId}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      return await response.json();
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  async deleteUser(userId: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/user/${userId}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },
}; 