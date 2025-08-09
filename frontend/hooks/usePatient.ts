import { useState, useCallback } from 'react';
import { patientService } from '../services/PatientService';
import { Patient } from '../interface/iPatient';

export interface PatientData {
  patient: Patient;
  loadedAt: string;
}

export interface UsePatientReturn {
  patients: Record<string, PatientData>;
  allPatients: Patient[];
  loadingPatients: Record<string, boolean>;
  loadingAllPatients: boolean;
  loadPatient: (patientId: string) => Promise<Patient | null>;
  loadAllPatients: () => Promise<Patient[] | null>;
  createPatient: (data: Omit<Patient, '_id'>) => Promise<Patient | null>;
  updatePatient: (patientId: string, data: Partial<Patient>) => Promise<Patient | null>;
  deletePatient: (patientId: string) => Promise<boolean>;
  clearPatient: (patientId: string) => void;
  clearAllPatients: () => void;
  isLoading: (patientId: string) => boolean;
  hasPatient: (patientId: string) => boolean;
  getPatient: (patientId: string) => Patient | null;
  refreshPatient: (patientId: string) => Promise<Patient | null>;
  refreshAllPatients: () => Promise<Patient[] | null>;
}

/**
 * Custom hook for managing patient data with caching and loading states
 * Provides comprehensive patient management functionality
 */
export const usePatient = (): UsePatientReturn => {
  const [patients, setPatients] = useState<Record<string, PatientData>>({});
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState<Record<string, boolean>>({});
  const [loadingAllPatients, setLoadingAllPatients] = useState(false);

  const loadPatient = useCallback(async (patientId: string): Promise<Patient | null> => {
    // Return cached data if available and recent (within 5 minutes)
    const cachedPatient = patients[patientId];
    if (cachedPatient) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const loadedAt = new Date(cachedPatient.loadedAt);
      if (loadedAt > fiveMinutesAgo) {
        console.log('🔄 Using cached patient data for:', patientId);
        return cachedPatient.patient;
      }
    }

    // Set loading state
    setLoadingPatients(prev => ({ ...prev, [patientId]: true }));

    try {
      console.log('🔄 Loading patient:', patientId);
      
      const patient = await patientService.getPatient(patientId);
      
      console.log('👤 Loaded patient data:', patient);

      const patientData: PatientData = {
        patient,
        loadedAt: new Date().toISOString()
      };

      // Cache the patient data
      setPatients(prev => ({
        ...prev,
        [patientId]: patientData
      }));

      // Update allPatients if it exists there
      setAllPatients(prev => {
        const index = prev.findIndex(p => p._id === patientId || p.id === patientId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = patient;
          return updated;
        }
        return prev;
      });

      return patient;
    } catch (error) {
      console.error('Failed to load patient:', error);
      return null;
    } finally {
      // Clear loading state
      setLoadingPatients(prev => ({ ...prev, [patientId]: false }));
    }
  }, [patients]);

  const loadAllPatients = useCallback(async (): Promise<Patient[] | null> => {
    setLoadingAllPatients(true);

    try {
      console.log('🔄 Loading all patients');
      
      const patientsList = await patientService.getPatients();
      
      console.log('👥 Loaded all patients:', patientsList);

      setAllPatients(patientsList);

      // Update individual patient cache
      const now = new Date().toISOString();
      const patientMap: Record<string, PatientData> = {};
      
      patientsList.forEach(patient => {
        const id = patient._id || patient.id;
        if (id) {
          patientMap[id] = {
            patient,
            loadedAt: now
          };
        }
      });

      setPatients(prev => ({ ...prev, ...patientMap }));

      return patientsList;
    } catch (error) {
      console.error('Failed to load all patients:', error);
      return null;
    } finally {
      setLoadingAllPatients(false);
    }
  }, []);

  const createPatient = useCallback(async (data: Omit<Patient, '_id'>): Promise<Patient | null> => {
    try {
      console.log('➕ Creating patient:', data);
      
      const newPatient = await patientService.createPatient(data);
      
      console.log('✅ Created patient:', newPatient);

      // Add to allPatients
      setAllPatients(prev => [newPatient, ...prev]);

      // Cache the new patient
      const patientId = newPatient._id || newPatient.id;
      if (patientId) {
        setPatients(prev => ({
          ...prev,
          [patientId]: {
            patient: newPatient,
            loadedAt: new Date().toISOString()
          }
        }));
      }

      return newPatient;
    } catch (error) {
      console.error('Failed to create patient:', error);
      return null;
    }
  }, []);

  const updatePatient = useCallback(async (patientId: string, data: Partial<Patient>): Promise<Patient | null> => {
    try {
      console.log('📝 Updating patient:', patientId, data);
      
      const updatedPatient = await patientService.updatePatient(patientId, data);
      
      console.log('✅ Updated patient:', updatedPatient);

      // Update cache
      setPatients(prev => ({
        ...prev,
        [patientId]: {
          patient: updatedPatient,
          loadedAt: new Date().toISOString()
        }
      }));

      // Update allPatients
      setAllPatients(prev => 
        prev.map(p => 
          (p._id === patientId || p.id === patientId) ? updatedPatient : p
        )
      );

      return updatedPatient;
    } catch (error) {
      console.error('Failed to update patient:', error);
      return null;
    }
  }, []);

  const deletePatient = useCallback(async (patientId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting patient:', patientId);
      
      await patientService.deletePatient(patientId);
      
      console.log('✅ Deleted patient:', patientId);

      // Remove from cache
      setPatients(prev => {
        const updated = { ...prev };
        delete updated[patientId];
        return updated;
      });

      // Remove from allPatients
      setAllPatients(prev => 
        prev.filter(p => p._id !== patientId && p.id !== patientId)
      );

      return true;
    } catch (error) {
      console.error('Failed to delete patient:', error);
      return false;
    }
  }, []);

  const clearPatient = useCallback((patientId: string) => {
    setPatients(prev => {
      const updated = { ...prev };
      delete updated[patientId];
      return updated;
    });
    setLoadingPatients(prev => {
      const updated = { ...prev };
      delete updated[patientId];
      return updated;
    });
  }, []);

  const clearAllPatients = useCallback(() => {
    setPatients({});
    setAllPatients([]);
    setLoadingPatients({});
    setLoadingAllPatients(false);
  }, []);

  const isLoading = useCallback((patientId: string): boolean => {
    return loadingPatients[patientId] || false;
  }, [loadingPatients]);

  const hasPatient = useCallback((patientId: string): boolean => {
    return !!patients[patientId];
  }, [patients]);

  const getPatient = useCallback((patientId: string): Patient | null => {
    return patients[patientId]?.patient || null;
  }, [patients]);

  const refreshPatient = useCallback(async (patientId: string): Promise<Patient | null> => {
    // Force refresh by clearing cache first
    clearPatient(patientId);
    return loadPatient(patientId);
  }, [loadPatient, clearPatient]);

  const refreshAllPatients = useCallback(async (): Promise<Patient[] | null> => {
    // Force refresh by clearing cache first
    setAllPatients([]);
    return loadAllPatients();
  }, [loadAllPatients]);

  return {
    patients,
    allPatients,
    loadingPatients,
    loadingAllPatients,
    loadPatient,
    loadAllPatients,
    createPatient,
    updatePatient,
    deletePatient,
    clearPatient,
    clearAllPatients,
    isLoading,
    hasPatient,
    getPatient,
    refreshPatient,
    refreshAllPatients
  };
};

/**
 * Utility functions for working with patient data
 */
export const PatientUtils = {
  /**
   * Calculate age from date of birth
   */
  calculateAge: (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const birth = new Date(dateOfBirth);
    const today = new Date();
    return Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  },

  /**
   * Format patient name for display
   */
  formatPatientName: (patient?: Patient): string => {
    if (!patient?.name) return 'Unknown Patient';
    return patient.name;
  },

  /**
   * Get patient identifier (prefer _id, fallback to id)
   */
  getPatientId: (patient: Patient): string | undefined => {
    return patient._id || patient.id;
  },

  /**
   * Get latest medical record
   */
  getLatestMedicalRecord: (patient?: Patient) => {
    if (!patient?.medicalRecords || patient.medicalRecords.length === 0) return null;
    
    return patient.medicalRecords.reduce((latest, current) => {
      const latestDate = new Date(latest.date || latest.createdAt || 0);
      const currentDate = new Date(current.date || current.createdAt || 0);
      return currentDate > latestDate ? current : latest;
    });
  },

  /**
   * Get gestational age from latest medical record
   */
  getGestationalAge: (patient?: Patient): number | null => {
    const latestRecord = PatientUtils.getLatestMedicalRecord(patient);
    if (!latestRecord?.lastMenstrualPeriod) return null;

    const lmp = new Date(latestRecord.lastMenstrualPeriod);
    const today = new Date();
    const diffTime = today.getTime() - lmp.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return diffWeeks > 0 ? diffWeeks : null;
  },

  /**
   * Check if patient has any medical conditions
   */
  hasChronicConditions: (patient?: Patient): boolean => {
    const latestRecord = PatientUtils.getLatestMedicalRecord(patient);
    if (!latestRecord?.medicalHistory) return false;

    return Object.values(latestRecord.medicalHistory).some(condition => condition === true);
  },

  /**
   * Get risk factors from patient data
   */
  getRiskFactors: (patient?: Patient): string[] => {
    const riskFactors: string[] = [];
    const latestRecord = PatientUtils.getLatestMedicalRecord(patient);
    
    if (!latestRecord) return riskFactors;

    // Age-related risks
    const age = PatientUtils.calculateAge(patient?.dateOfBirth);
    if (age && (age < 18 || age > 35)) {
      riskFactors.push(`${age < 18 ? 'Teenage' : 'Advanced maternal'} age`);
    }

    // Medical history risks
    if (latestRecord.medicalHistory) {
      const { hypertension, diabetes, heartDisease } = latestRecord.medicalHistory;
      if (hypertension) riskFactors.push('Hypertension');
      if (diabetes) riskFactors.push('Diabetes');
      if (heartDisease) riskFactors.push('Heart Disease');
    }

    // Obstetric history risks
    if (latestRecord.gravida && latestRecord.gravida > 5) {
      riskFactors.push('Grand multiparity');
    }

    return riskFactors;
  },

  /**
   * Format contact information
   */
  formatContact: (patient?: Patient): string => {
    if (!patient?.contact) return 'No contact information';
    return patient.contact;
  },

  /**
   * Get facility name
   */
  getFacilityName: (patient?: Patient): string => {
    return patient?.facility?.facilityName || 'Unknown Facility';
  },

  /**
   * Format blood pressure from latest record
   */
  getLatestBloodPressure: (patient?: Patient): string => {
    const latestRecord = PatientUtils.getLatestMedicalRecord(patient);
    return latestRecord?.physicalExam?.bloodPressure || 'N/A';
  },

  /**
   * Get BMI from latest record
   */
  getLatestBMI: (patient?: Patient): number | null => {
    const latestRecord = PatientUtils.getLatestMedicalRecord(patient);
    if (!latestRecord?.physicalExam?.weight || !latestRecord?.physicalExam?.height) return null;
    
    const weightKg = latestRecord.physicalExam.weight;
    const heightM = latestRecord.physicalExam.height / 100; // Convert cm to m
    
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }
};
