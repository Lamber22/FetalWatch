import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { patientService } from '../services/PatientService';

interface Patient {
  _id?: string;
  name: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  contact?: string;
  weekOfPregnancy?: number;
  expectedDeliveryDate?: string;
  createdAt?: string;
}

interface PatientsContextType {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  getPatient: (id: string) => Promise<void>;
  createPatient: (data: Omit<Patient, '_id'>) => Promise<void>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  setSelectedPatient: (patient: Patient | null) => void;
  clearError: () => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const PatientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, []);

  const getPatient = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const patient = await patientService.getPatient(id);
      setSelectedPatient(patient);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patient');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPatient = useCallback(async (data: Omit<Patient, '_id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newPatient = await patientService.createPatient(data);
      setPatients(prev => [...prev, newPatient]);
    } catch (err: any) {
      setError(err.message || 'Failed to create patient');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePatient = useCallback(async (id: string, data: Partial<Patient>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPatient = await patientService.updatePatient(id, data);
      setPatients(prev => prev.map(p => p._id === id ? updatedPatient : p));
      if (selectedPatient?._id === id) {
        setSelectedPatient(updatedPatient);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update patient');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPatient]);

  const deletePatient = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await patientService.deletePatient(id);
      setPatients(prev => prev.filter(p => p._id !== id));
      if (selectedPatient?._id === id) {
        setSelectedPatient(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete patient');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPatient]);

  const value: PatientsContextType = {
    patients,
    selectedPatient,
    loading,
    error,
    fetchPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,
    setSelectedPatient,
    clearError,
  };

  return <PatientsContext.Provider value={value}>{children}</PatientsContext.Provider>;
};

export const usePatients = () => {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientsProvider');
  }
  return context;
};

