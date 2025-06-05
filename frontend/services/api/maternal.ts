import { API_CONFIG, getHeaders } from './config';

interface MaternalHealth {
  id?: string;
  patientId: string;
  bloodPressure: string;
  weight: number;
  height: number;
  bmi: number;
  // Add other maternal health fields as needed
}

export const maternalHealthService = {
  async createMaternalHealth(data: Omit<MaternalHealth, 'id'>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/maternal`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create maternal health record');
      }

      return await response.json();
    } catch (error) {
      console.error('Create maternal health error:', error);
      throw error;
    }
  },

  async getMaternalHealthRecords() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/maternal`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch maternal health records');
      }

      return await response.json();
    } catch (error) {
      console.error('Get maternal health records error:', error);
      throw error;
    }
  },

  async getMaternalHealthById(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/maternal/${id}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch maternal health record');
      }

      return await response.json();
    } catch (error) {
      console.error('Get maternal health error:', error);
      throw error;
    }
  },

  async getMaternalHealthByPatient(patientId: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/maternal/patient/${patientId}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient maternal health records');
      }

      return await response.json();
    } catch (error) {
      console.error('Get patient maternal health error:', error);
      throw error;
    }
  },

  async updateMaternalHealth(id: string, data: Partial<MaternalHealth>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/maternal/${id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update maternal health record');
      }

      return await response.json();
    } catch (error) {
      console.error('Update maternal health error:', error);
      throw error;
    }
  },

  async deleteMaternalHealth(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/maternal/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete maternal health record');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete maternal health error:', error);
      throw error;
    }
  },
}; 