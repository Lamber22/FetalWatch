import { apiService } from './API';

interface Pregnancy {
  id?: string;
  patientId: string;
  startDate: string;
  expectedDeliveryDate: string;
  status: string;
  // Add other pregnancy fields as needed
}

export const pregnancyService = {
  async createPregnancy(data: Omit<Pregnancy, 'id'>): Promise<Pregnancy> {
    const result = await apiService.create<Pregnancy>('pregnancies', data);
    return result.data!;
  },

  async getPregnancies(): Promise<Pregnancy[]> {
    const result = await apiService.get<Pregnancy[]>('/pregnancies');
    return result.data!;
  },

  async getPregnancyById(id: string): Promise<Pregnancy> {
    const result = await apiService.getById<Pregnancy>('pregnancies', id);
    return result.data!;
  },

  async getPregnanciesByPatient(patientId: string): Promise<Pregnancy[]> {
    const result = await apiService.get<Pregnancy[]>(`/pregnancies/patient/${patientId}`);
    return result.data!;
  },

  async updatePregnancy(id: string, data: Partial<Pregnancy>): Promise<Pregnancy> {
    const result = await apiService.update<Pregnancy>('pregnancies', id, data);
    return result.data!;
  },

  async deletePregnancy(id: string): Promise<void> {
    await apiService.remove('pregnancies', id);
  },
};