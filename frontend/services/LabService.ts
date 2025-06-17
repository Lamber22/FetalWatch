import { apiService } from './API';

interface LabResult {
  id?: string;
  patientId: string;
  testType: string;
  result: string;
  date: string;
  // Add other lab result fields as needed
}

export const labResultService = {
  async createLabResult(data: Omit<LabResult, 'id'>): Promise<LabResult> {
    const result = await apiService.create<LabResult>('labResults', data);
    return result.data!;
  },

  async getLabResults(): Promise<LabResult[]> {
    const result = await apiService.get<LabResult[]>('/labResults');
    return result.data!;
  },

  async getLabResult(id: string): Promise<LabResult> {
    const result = await apiService.getById<LabResult>('labResults', id);
    return result.data!;
  },

  async updateLabResult(id: string, data: Partial<LabResult>): Promise<LabResult> {
    const result = await apiService.update<LabResult>('labResults', id, data);
    return result.data!;
  },

  async deleteLabResult(id: string): Promise<void> {
    await apiService.remove('labResults', id);
  },
};