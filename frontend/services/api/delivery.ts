import { API_CONFIG, getHeaders } from './config';

interface Delivery {
  id?: string;
  patientId: string;
  deliveryDate: string;
  deliveryType: string;
  complications: string[];
  // Add other delivery fields as needed
}

export const deliveryService = {
  async createDelivery(data: Omit<Delivery, 'id'>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/delivery`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create delivery record');
      }

      return await response.json();
    } catch (error) {
      console.error('Create delivery error:', error);
      throw error;
    }
  },

  async getDeliveries() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/delivery`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch deliveries');
      }

      return await response.json();
    } catch (error) {
      console.error('Get deliveries error:', error);
      throw error;
    }
  },

  async getDeliveryById(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/delivery/${id}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch delivery');
      }

      return await response.json();
    } catch (error) {
      console.error('Get delivery error:', error);
      throw error;
    }
  },

  async getDeliveriesByPatient(patientId: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/delivery/patient/${patientId}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient deliveries');
      }

      return await response.json();
    } catch (error) {
      console.error('Get patient deliveries error:', error);
      throw error;
    }
  },

  async updateDelivery(id: string, data: Partial<Delivery>) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/delivery/${id}`, {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update delivery');
      }

      return await response.json();
    } catch (error) {
      console.error('Update delivery error:', error);
      throw error;
    }
  },

  async deleteDelivery(id: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/delivery/${id}`, {
        method: 'DELETE',
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete delivery');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete delivery error:', error);
      throw error;
    }
  },
}; 