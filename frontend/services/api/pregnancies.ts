import { API_CONFIG, getHeaders } from './config';

interface Pregnancy {
  id?: string;
  patientId: string;
  startDate: string;
  expectedDeliveryDate: string;
  status: string;
  // Add other pregnancy fields as needed
}

export const pregnancyService = {
  async createPregnancy(data: Omit<Pregnancy, 'id'>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pregnancies`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create pregnancy record');
      }

      return await response.json();
    } catch (error) {
      console.error('Create pregnancy error:', error);
      throw error;
    }
  },

  async getPregnancies() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pregnancies`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pregnancies');
      }

      return await response.json();
    } catch (error) {
      console.error('Get pregnancies error:', error);
      throw error;
    }
  },

  async getPregnancyById(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pregnancies/${id}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pregnancy');
      }

      return await response.json();
    } catch (error) {
      console.error('Get pregnancy error:', error);
      throw error;
    }
  },

  async getPregnanciesByPatient(patientId: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pregnancies/patient/${patientId}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient pregnancies');
      }

      return await response.json();
    } catch (error) {
      console.error('Get patient pregnancies error:', error);
      throw error;
    }
  },

  async updatePregnancy(id: string, data: Partial<Pregnancy>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pregnancies/${id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update pregnancy');
      }

      return await response.json();
    } catch (error) {
      console.error('Update pregnancy error:', error);
      throw error;
    }
  },

  async deletePregnancy(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pregnancies/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete pregnancy');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete pregnancy error:', error);
      throw error;
    }
  },
}; 