import { apiService } from './API';

interface Patient {
  name: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  contact?: string;
  weekOfPregnancy?: number;
  expectedDeliveryDate?: string;
}

export const patientService = {
  async createPatient(data: Omit<Patient, 'id'>): Promise<Patient> {
    const result = await apiService.create<Patient>('patients', data);
    return result.data!;
  },

  async getPatients(): Promise<Patient[]> {
    const result = await apiService.get<Patient[]>('/patients');
    return result.data!;
  },

  async getPatient(id: string): Promise<Patient> {
    const result = await apiService.getById<Patient>('patients', id);
    return result.data!;
  },

  async updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
    const result = await apiService.update<Patient>('patients', id, data);
    return result.data!;
  },

  async deletePatient(id: string): Promise<void> {
    await apiService.remove('patients', id);
  },
};