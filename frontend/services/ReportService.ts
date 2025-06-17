import { apiService } from './API';

interface Report {
  id: string;
  type: string;
  data: any;
  generatedAt: string;
}

export const reportService = {
  async getDashboardReport(): Promise<Report> {
    const result = await apiService.get<Report>('/reports/dashboard');
    return result.data!;
  },

  async getPatientReport(patientId: string): Promise<Report> {
    const result = await apiService.get<Report>(`/reports/patient/${patientId}`);
    return result.data!;
  },

  async getFacilityReport(): Promise<Report> {
    const result = await apiService.get<Report>('/reports/facility');
    return result.data!;
  },

  async getRiskIndicatorsReport(): Promise<Report> {
    const result = await apiService.get<Report>('/reports/risk-indicators');
    return result.data!;
  },

  async exportReport(reportType: string): Promise<any> {
    const result = await apiService.get(`/reports/export/${reportType}`);
    return result.data!;
  },
};