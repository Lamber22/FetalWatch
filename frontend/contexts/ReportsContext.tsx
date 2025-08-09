import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  reportService, 
  RiskAssessment, 
  VitalTrend, 
  Complication,
  DashboardReport,
  FacilityReport,
  RiskIndicatorsReport
} from '../services/ReportService';

interface ReportsContextType {
  // Patient-specific reports
  riskAssessment: RiskAssessment | null;
  vitalTrends: VitalTrend[];
  complications: Complication[];
  
  // System-wide reports
  dashboardReport: DashboardReport | null;
  facilityReport: FacilityReport | null;
  riskIndicatorsReport: RiskIndicatorsReport | null;
  
  // Patient-specific report data (for backwards compatibility)
  patientReport: any | null;
  
  loading: boolean;
  error: string | null;
  
  // Patient-specific functions
  fetchRiskAssessment: (patientId: string) => Promise<void>;
  fetchVitalTrends: (patientId: string) => Promise<void>;
  fetchComplications: (patientId: string) => Promise<void>;
  
  // System-wide functions
  getDashboardReport: () => Promise<void>;
  getFacilityReport: () => Promise<void>;
  getRiskIndicatorsReport: () => Promise<void>;
  
  exportReport: (type: 'risk-assessment' | 'vital-trends' | 'complications' | 'dashboard' | 'facility' | 'risk-indicators', patientId?: string) => Promise<Blob>;
  clearError: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Patient-specific reports
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [vitalTrends, setVitalTrends] = useState<VitalTrend[]>([]);
  const [complications, setComplications] = useState<Complication[]>([]);
  
  // System-wide reports
  const [dashboardReport, setDashboardReport] = useState<DashboardReport | null>(null);
  const [facilityReport, setFacilityReport] = useState<FacilityReport | null>(null);
  const [riskIndicatorsReport, setRiskIndicatorsReport] = useState<RiskIndicatorsReport | null>(null);
  
  // For backwards compatibility
  const [patientReport, setPatientReport] = useState<any | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Patient-specific functions
  const fetchRiskAssessment = useCallback(async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getRiskAssessment(patientId);
      setRiskAssessment(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch risk assessment');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVitalTrends = useCallback(async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getVitalTrends(patientId);
      setVitalTrends(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vital trends');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComplications = useCallback(async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getPotentialComplications(patientId);
      setComplications(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch potential complications');
    } finally {
      setLoading(false);
    }
  }, []);

  // System-wide functions
  const getDashboardReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getDashboardReport();
      setDashboardReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard report');
    } finally {
      setLoading(false);
    }
  }, []);

  const getFacilityReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getFacilityReport();
      setFacilityReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch facility report');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRiskIndicatorsReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getRiskIndicatorsReport();
      setRiskIndicatorsReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch risk indicators report');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(
    async (type: 'risk-assessment' | 'vital-trends' | 'complications' | 'dashboard' | 'facility' | 'risk-indicators', patientId?: string) => {
      try {
        setLoading(true);
        setError(null);
        return await reportService.exportReport(type, patientId);
      } catch (err: any) {
        setError(err.message || `Failed to export ${type} report`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const value = {
    // Patient-specific reports
    riskAssessment,
    vitalTrends,
    complications,
    
    // System-wide reports
    dashboardReport,
    facilityReport,
    riskIndicatorsReport,
    
    // For backwards compatibility
    patientReport,
    
    loading,
    error,
    
    // Patient-specific functions
    fetchRiskAssessment,
    fetchVitalTrends,
    fetchComplications,
    
    // System-wide functions
    getDashboardReport,
    getFacilityReport,
    getRiskIndicatorsReport,
    
    exportReport,
    clearError,
  };

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};