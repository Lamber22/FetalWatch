import { API_CONFIG, getHeaders } from './config';

interface LabResult {
  id?: string;
  patientId: string;
  testType: string;
  result: string;
  date: string;
  // Add other lab result fields as needed
}

export const labResultService = {
  async createLabResult(data: Omit<LabResult, 'id'>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/labResults`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create lab result');
      }

      return await response.json();
    } catch (error) {
      console.error('Create lab result error:', error);
      throw error;
    }
  },

  async getLabResults() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/labResults`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lab results');
      }

      return await response.json();
    } catch (error) {
      console.error('Get lab results error:', error);
      throw error;
    }
  },

  async getLabResult(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/labResults/${id}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lab result');
      }

      return await response.json();
    } catch (error) {
      console.error('Get lab result error:', error);
      throw error;
    }
  },

  async updateLabResult(id: string, data: Partial<LabResult>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/labResults/${id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update lab result');
      }

      return await response.json();
    } catch (error) {
      console.error('Update lab result error:', error);
      throw error;
    }
  },

  async deleteLabResult(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/labResults/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete lab result');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete lab result error:', error);
      throw error;
    }
  },
}; 