import { API_CONFIG, getHeaders } from './config';

interface Postnatal {
  id?: string;
  patientId: string;
  deliveryId: string;
  checkupDate: string;
  motherHealth: string;
  babyHealth: string;
  // Add other postnatal fields as needed
}

export const postnatalService = {
  async createPostnatal(data: Omit<Postnatal, 'id'>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/postnatal`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create postnatal record');
      }

      return await response.json();
    } catch (error) {
      console.error('Create postnatal error:', error);
      throw error;
    }
  },

  async getPostnatalRecords() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/postnatal`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch postnatal records');
      }

      return await response.json();
    } catch (error) {
      console.error('Get postnatal records error:', error);
      throw error;
    }
  },

  async getPostnatalById(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/postnatal/${id}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch postnatal record');
      }

      return await response.json();
    } catch (error) {
      console.error('Get postnatal error:', error);
      throw error;
    }
  },

  async getPostnatalByPatient(patientId: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/postnatal/patient/${patientId}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient postnatal records');
      }

      return await response.json();
    } catch (error) {
      console.error('Get patient postnatal error:', error);
      throw error;
    }
  },

  async getPostnatalByDelivery(deliveryId: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/postnatal/delivery/${deliveryId}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch delivery postnatal records');
      }

      return await response.json();
    } catch (error) {
      console.error('Get delivery postnatal error:', error);
      throw error;
    }
  },

  async updatePostnatal(id: string, data: Partial<Postnatal>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/postnatal/${id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update postnatal record');
      }

      return await response.json();
    } catch (error) {
      console.error('Update postnatal error:', error);
      throw error;
    }
  },

  async deletePostnatal(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/postnatal/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete postnatal record');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete postnatal error:', error);
      throw error;
    }
  },
}; 