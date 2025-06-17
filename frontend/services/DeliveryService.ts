import { apiService } from './API';

interface Delivery {
  id?: string;
  patientId: string;
  deliveryDate: string;
  deliveryType: string;
  complications: string[];
  // Add other delivery fields as needed
}

export const deliveryService = {
  async createDelivery(data: Omit<Delivery, 'id'>): Promise<Delivery> {
    const result = await apiService.create<Delivery>('delivery', data);
    return result.data!;
  },

  async getDeliveries(): Promise<Delivery[]> {
    const result = await apiService.get<Delivery[]>('/delivery');
    return result.data!;
  },

  async getDeliveryById(id: string): Promise<Delivery> {
    const result = await apiService.getById<Delivery>('delivery', id);
    return result.data!;
  },

  async getDeliveriesByPatient(patientId: string): Promise<Delivery[]> {
    const result = await apiService.get<Delivery[]>(`/delivery/patient/${patientId}`);
    return result.data!;
  },

  async updateDelivery(id: string, data: Partial<Delivery>): Promise<Delivery> {
    const result = await apiService.update<Delivery>('delivery', id, data);
    return result.data!;
  },

  async deleteDelivery(id: string): Promise<void> {
    await apiService.remove('delivery', id);
  },
};