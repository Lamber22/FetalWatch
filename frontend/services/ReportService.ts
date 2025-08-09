import { apiService, RequestConfig } from './API';

export interface RiskAssessment {
  riskScore: number;
  riskLevel: string;
  riskFactors: string[];
  recommendations: Array<{
    type: string;
    priority: string;
    description: string;
    details: string;
  }>;
  lastUpdated: string;
  bmi?: number;
  lastCheckup?: string;
}

export interface VitalTrend {
  date: string;
  bloodPressure?: string | {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  weight?: number;
  temperature?: number;
}

export interface Complication {
  name: string;
  probability: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
}

// Backend response interface
interface BackendComplication {
  name: string;
  severity: 'low' | 'moderate' | 'high';
  description: string;
  recommendation: string;
}

export interface DashboardReport {
  generatedAt: string;
  summary: {
    totalPatients: number;
    totalRecords: number;
    highRiskPatients: number;
    moderateRiskPatients: number;
    lowRiskPatients: number;
    recentActivity: number;
  };
  riskDistribution: {
    high: number;
    moderate: number;
    low: number;
  };
}

export interface FacilityReport {
  generatedAt: string;
  facilityName: string;
  period: {
    from: string;
    to: string;
  };
  overview: {
    totalPatients: number;
    totalRecords: number;
    averageRecordsPerPatient: number;
  };
  monthlyStats: Array<{
    month: string;
    year: number;
    patients: number;
    records: number;
  }>;
}

export interface RiskIndicatorsReport {
  generatedAt: string;
  summary: {
    totalPatientsWithRisk: number;
    highRiskCount: number;
    moderateRiskCount: number;
    lowRiskCount: number;
  };
  riskIndicators: Array<{
    patientId: string;
    patientName: string;
    age: number;
    riskLevel: 'low' | 'moderate' | 'high';
    riskScore: number;
    indicators: string[];
    lastCheckup: string;
  }>;
}

export const reportService = {
  async getRiskAssessment(patientId: string): Promise<RiskAssessment> {
    const result = await apiService.get<{ patient: any; riskAssessment: RiskAssessment }>(`/reports/risk-assessment/${patientId}`);
    return result.data!.riskAssessment;
  },

  async getVitalTrends(patientId: string): Promise<VitalTrend[]> {
    const result = await apiService.get<{ patient: string; vitalTrends: VitalTrend[] }>(`/reports/vital-trends/${patientId}`);
    return result.data!.vitalTrends;
  },

  async getPotentialComplications(patientId: string): Promise<Complication[]> {
    const result = await apiService.get<{ patient: string; complications: BackendComplication[] }>(`/reports/complications/${patientId}`);
    // Transform backend response to match frontend interface
    return result.data!.complications.map(comp => ({
      name: comp.name,
      probability: comp.severity === 'moderate' ? 'medium' : comp.severity as 'low' | 'high',
      description: comp.description,
      recommendations: [comp.recommendation]
    }));
  },

  async getDashboardReport(): Promise<DashboardReport> {
    const result = await apiService.get<DashboardReport>('/reports/dashboard');
    return result.data!;
  },

  async getFacilityReport(): Promise<FacilityReport> {
    const result = await apiService.get<FacilityReport>('/reports/facility');
    return result.data!;
  },

  async getRiskIndicatorsReport(): Promise<RiskIndicatorsReport> {
    const result = await apiService.get<RiskIndicatorsReport>('/reports/risk-indicators');
    return result.data!;
  },

  async exportReport(type: 'risk-assessment' | 'vital-trends' | 'complications' | 'dashboard' | 'facility' | 'risk-indicators', patientId?: string): Promise<Blob> {
    const config: RequestConfig = {
      headers: {
        'Accept': 'application/octet-stream',
      },
      skipJsonParse: true,
    };
    
    const endpoint = patientId 
      ? `/reports/export/${type}/${patientId}`
      : `/reports/export/${type}`;
    
    const result = await apiService.get(endpoint, config);
    return result.data;
  },
};