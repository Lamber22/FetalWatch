import { apiService } from './API';

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
  async createPostnatal(data: Omit<Postnatal, 'id'>): Promise<Postnatal> {
    const result = await apiService.create<Postnatal>('postnatal', data);
    return result.data!;
  },

  async getPostnatalRecords(): Promise<Postnatal[]> {
    const result = await apiService.get<Postnatal[]>('/postnatal');
    return result.data!;
  },

  async getPostnatalById(id: string): Promise<Postnatal> {
    const result = await apiService.getById<Postnatal>('postnatal', id);
    return result.data!;
  },

  async getPostnatalByPatient(patientId: string): Promise<Postnatal[]> {
    const result = await apiService.get<Postnatal[]>(`/postnatal/patient/${patientId}`);
    return result.data!;
  },

  async getPostnatalByDelivery(deliveryId: string): Promise<Postnatal[]> {
    const result = await apiService.get<Postnatal[]>(`/postnatal/delivery/${deliveryId}`);
    return result.data!;
  },

  async updatePostnatal(id: string, data: Partial<Postnatal>): Promise<Postnatal> {
    const result = await apiService.update<Postnatal>('postnatal', id, data);
    return result.data!;
  },

  async deletePostnatal(id: string): Promise<void> {
    await apiService.remove('postnatal', id);
  },
};