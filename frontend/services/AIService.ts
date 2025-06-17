import { apiService } from './API';

interface AIResult {
  id?: string;
  patientId: string;
  analysisDate: string;
  riskLevel: string;
  recommendations: string[];
  // Add other AI result fields as needed
}

export const aiResultService = {
  async createAIResult(data: Omit<AIResult, 'id'>): Promise<AIResult> {
    const result = await apiService.create<AIResult>('aiResults', data);
    return result.data!;
  },

  async getAIResults(): Promise<AIResult[]> {
    const result = await apiService.get<AIResult[]>('/aiResults');
    return result.data!;
  },

  async getAIResult(id: string): Promise<AIResult> {
    const result = await apiService.getById<AIResult>('aiResults', id);
    return result.data!;
  },

  async updateAIResult(id: string, data: Partial<AIResult>): Promise<AIResult> {
    const result = await apiService.update<AIResult>('aiResults', id, data);
    return result.data!;
  },

  async deleteAIResult(id: string): Promise<void> {
    await apiService.remove('aiResults', id);
  },
};