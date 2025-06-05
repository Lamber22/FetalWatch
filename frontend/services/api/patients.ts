import { API_CONFIG, getHeaders } from './config';

interface Patient {
  id?: string;
  name: string;
  age: number;
  // Add other patient fields as needed
}

export const patientService = {
  async createPatient(data: Omit<Patient, 'id'>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/patients`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create patient');
      }

      return await response.json();
    } catch (error) {
      console.error('Create patient error:', error);
      throw error;
    }
  },

  async getPatients() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/patients`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      return await response.json();
    } catch (error) {
      console.error('Get patients error:', error);
      throw error;
    }
  },

  async getPatient(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/patients/${id}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient');
      }

      return await response.json();
    } catch (error) {
      console.error('Get patient error:', error);
      throw error;
    }
  },

  async updatePatient(id: string, data: Partial<Patient>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update patient');
      }

      return await response.json();
    } catch (error) {
      console.error('Update patient error:', error);
      throw error;
    }
  },

  async deletePatient(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete patient error:', error);
      throw error;
    }
  },
}; 