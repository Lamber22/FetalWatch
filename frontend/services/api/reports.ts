import { API_CONFIG, getHeaders } from './config';

interface Report {
  id: string;
  type: string;
  data: any;
  generatedAt: string;
}

export const reportService = {
  async getDashboardReport() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/reports/dashboard`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard report');
      }

      return await response.json();
    } catch (error) {
      console.error('Get dashboard report error:', error);
      throw error;
    }
  },

  async getPatientReport(patientId: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/reports/patient/${patientId}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient report');
      }

      return await response.json();
    } catch (error) {
      console.error('Get patient report error:', error);
      throw error;
    }
  },

  async getFacilityReport() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/reports/facility`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch facility report');
      }

      return await response.json();
    } catch (error) {
      console.error('Get facility report error:', error);
      throw error;
    }
  },

  async getRiskIndicatorsReport() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/reports/risk-indicators`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch risk indicators report');
      }

      return await response.json();
    } catch (error) {
      console.error('Get risk indicators report error:', error);
      throw error;
    }
  },

  async exportReport(reportType: string) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/reports/export/${reportType}`, {
        headers: await getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to export report');
      }

      return await response.json();
    } catch (error) {
      console.error('Export report error:', error);
      throw error;
    }
  },
}; 