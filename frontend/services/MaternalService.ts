import { apiService } from './API';

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
  async createMaternalHealth(data: Omit<MaternalHealth, 'id'>): Promise<MaternalHealth> {
    const result = await apiService.create<MaternalHealth>('maternal', data);
    return result.data!;
  },

  async getMaternalHealthRecords(): Promise<MaternalHealth[]> {
    const result = await apiService.get<MaternalHealth[]>('/maternal');
    return result.data!;
  },

  async getMaternalHealthById(id: string): Promise<MaternalHealth> {
    const result = await apiService.getById<MaternalHealth>('maternal', id);
    return result.data!;
  },

  async getMaternalHealthByPatient(patientId: string): Promise<MaternalHealth[]> {
    const result = await apiService.get<MaternalHealth[]>(`/maternal/patient/${patientId}`);
    return result.data!;
  },

  async updateMaternalHealth(id: string, data: Partial<MaternalHealth>): Promise<MaternalHealth> {
    const result = await apiService.update<MaternalHealth>('maternal', id, data);
    return result.data!;
  },

  async deleteMaternalHealth(id: string): Promise<void> {
    await apiService.remove('maternal', id);
  },
};