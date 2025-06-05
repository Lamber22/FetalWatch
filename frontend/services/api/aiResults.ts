import { API_CONFIG, getHeaders } from './config';

interface AIResult {
  id?: string;
  patientId: string;
  analysisDate: string;
  riskLevel: string;
  recommendations: string[];
  // Add other AI result fields as needed
}

export const aiResultService = {
  async createAIResult(data: Omit<AIResult, 'id'>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/aiResults`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create AI result');
      }

      return await response.json();
    } catch (error) {
      console.error('Create AI result error:', error);
      throw error;
    }
  },

  async getAIResults() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/aiResults`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI results');
      }

      return await response.json();
    } catch (error) {
      console.error('Get AI results error:', error);
      throw error;
    }
  },

  async getAIResult(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/aiResults/${id}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI result');
      }

      return await response.json();
    } catch (error) {
      console.error('Get AI result error:', error);
      throw error;
    }
  },

  async updateAIResult(id: string, data: Partial<AIResult>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/aiResults/${id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update AI result');
      }

      return await response.json();
    } catch (error) {
      console.error('Update AI result error:', error);
      throw error;
    }
  },

  async deleteAIResult(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/aiResults/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete AI result');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete AI result error:', error);
      throw error;
    }
  },
}; 