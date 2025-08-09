import { useState, useCallback } from 'react';
import { reportService } from '../services/ReportService';
import type { RiskAssessment, VitalTrend, Complication } from '../services/ReportService';

export interface PatientReportData {
  riskAssessment: RiskAssessment | null;
  vitalTrends: VitalTrend[] | null;
  complications: Complication[] | null;
  loadedAt: string;
}

export interface UsePatientReportsReturn {
  patientReports: Record<string, PatientReportData>;
  loadingReports: Record<string, boolean>;
  loadPatientReports: (patientId: string) => Promise<PatientReportData | null>;
  clearPatientReport: (patientId: string) => void;
  clearAllReports: () => void;
  isLoading: (patientId: string) => boolean;
  hasData: (patientId: string) => boolean;
}

/**
 * Custom hook for managing patient report data (Risk Assessment, Vital Signs, Complications)
 * Provides caching and loading states for multiple patients
 */
export const usePatientReports = (): UsePatientReportsReturn => {
  const [patientReports, setPatientReports] = useState<Record<string, PatientReportData>>({});
  const [loadingReports, setLoadingReports] = useState<Record<string, boolean>>({});

  const loadPatientReports = useCallback(async (patientId: string): Promise<PatientReportData | null> => {
    // Return cached data if available
    if (patientReports[patientId]) {
      return patientReports[patientId];
    }

    // Set loading state
    setLoadingReports(prev => ({ ...prev, [patientId]: true }));

    try {
      console.log('🔄 Loading reports for patient:', patientId);
      
      // Fetch all report data in parallel
      const [riskAssessment, vitalTrends, complications] = await Promise.all([
        reportService.getRiskAssessment(patientId),
        reportService.getVitalTrends(patientId),
        reportService.getPotentialComplications(patientId)
      ]);

      console.log('📊 Loaded data:', { riskAssessment, vitalTrends, complications });

      const reportData: PatientReportData = {
        riskAssessment,
        vitalTrends,
        complications,
        loadedAt: new Date().toISOString()
      };

      // Cache the data
      setPatientReports(prev => ({
        ...prev,
        [patientId]: reportData
      }));

      return reportData;
    } catch (error) {
      console.error('Failed to load patient reports:', error);
      return null;
    } finally {
      // Clear loading state
      setLoadingReports(prev => ({ ...prev, [patientId]: false }));
    }
  }, [patientReports]);

  const clearPatientReport = useCallback((patientId: string) => {
    setPatientReports(prev => {
      const updated = { ...prev };
      delete updated[patientId];
      return updated;
    });
    setLoadingReports(prev => {
      const updated = { ...prev };
      delete updated[patientId];
      return updated;
    });
  }, []);

  const clearAllReports = useCallback(() => {
    setPatientReports({});
    setLoadingReports({});
  }, []);

  const isLoading = useCallback((patientId: string): boolean => {
    return loadingReports[patientId] || false;
  }, [loadingReports]);

  const hasData = useCallback((patientId: string): boolean => {
    return !!patientReports[patientId];
  }, [patientReports]);

  return {
    patientReports,
    loadingReports,
    loadPatientReports,
    clearPatientReport,
    clearAllReports,
    isLoading,
    hasData
  };
};

/**
 * Utility functions for working with patient report data
 */
export const PatientReportUtils = {
  /**
   * Get risk level color based on risk level string
   */
  getRiskLevelColor: (level: string, colors: any) => {
    switch (level?.toLowerCase()) {
      case 'high': return colors.error;
      case 'moderate': return colors.warning;
      case 'low': return colors.success;
      default: return colors.gray;
    }
  },

  /**
   * Get priority color for recommendations
   */
  getPriorityColor: (priority: string, colors: any) => {
    switch (priority?.toLowerCase()) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.gray;
    }
  },

  /**
   * Format blood pressure value
   */
  formatBloodPressure: (bp?: string | { systolic: number; diastolic: number; }) => {
    if (!bp) return 'N/A';
    if (typeof bp === 'string') return bp;
    return `${bp.systolic}/${bp.diastolic}`;
  },

  /**
   * Get probability color for complications
   */
  getProbabilityColor: (probability: string, colors: any) => {
    switch (probability?.toLowerCase()) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.gray;
    }
  },

  /**
   * Calculate age from date of birth
   */
  calculateAge: (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'N/A';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  },

  /**
   * Get risk level based on week of pregnancy
   */
  getRiskLevel: (weekOfPregnancy?: number) => {
    if (!weekOfPregnancy) return 'Unknown';
    return weekOfPregnancy < 20 || weekOfPregnancy > 35 ? 'High' : 'Low';
  }
};
