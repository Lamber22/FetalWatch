import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { reportService } from '../services/ReportService';

interface Report {
  id: string;
  type: string;
  data: any;
  generatedAt: string;
}

interface ReportsContextType {
  dashboardReport: Report | null;
  patientReport: Report | null;
  facilityReport: Report | null;
  riskIndicatorsReport: Report | null;
  loading: boolean;
  error: string | null;
  getDashboardReport: () => Promise<void>;
  getPatientReport: (patientId: string) => Promise<void>;
  getFacilityReport: () => Promise<void>;
  getRiskIndicatorsReport: () => Promise<void>;
  exportReport: (reportType: string) => Promise<any>;
  clearError: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboardReport, setDashboardReport] = useState<Report | null>(null);
  const [patientReport, setPatientReport] = useState<Report | null>(null);
  const [facilityReport, setFacilityReport] = useState<Report | null>(null);
  const [riskIndicatorsReport, setRiskIndicatorsReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const getDashboardReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const report = await reportService.getDashboardReport();
      setDashboardReport(report);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard report');
    } finally {
      setLoading(false);
    }
  }, []);

  const getPatientReport = useCallback(async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const report = await reportService.getPatientReport(patientId);
      setPatientReport(report);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patient report');
    } finally {
      setLoading(false);
    }
  }, []);

  const getFacilityReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const report = await reportService.getFacilityReport();
      setFacilityReport(report);
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
      const report = await reportService.getRiskIndicatorsReport();
      setRiskIndicatorsReport(report);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch risk indicators report');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportReport = useCallback(async (reportType: string) => {
    try {
      setLoading(true);
      setError(null);
      return await reportService.exportReport(reportType);
    } catch (err: any) {
      setError(err.message || 'Failed to export report');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: ReportsContextType = {
    dashboardReport,
    patientReport,
    facilityReport,
    riskIndicatorsReport,
    loading,
    error,
    getDashboardReport,
    getPatientReport,
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
