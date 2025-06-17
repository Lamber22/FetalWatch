import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { pregnancyService } from '../services/PregnancyService';

interface Pregnancy {
  id?: string;
  patientId: string;
  startDate: string;
  expectedDeliveryDate: string;
  status: string;
}

interface PregnanciesContextType {
  pregnancies: Pregnancy[];
  selectedPregnancy: Pregnancy | null;
  loading: boolean;
  error: string | null;
  fetchPregnancies: () => Promise<void>;
  getPregnancy: (id: string) => Promise<void>;
  getPregnanciesByPatient: (patientId: string) => Promise<void>;
  createPregnancy: (data: Omit<Pregnancy, 'id'>) => Promise<void>;
  updatePregnancy: (id: string, data: Partial<Pregnancy>) => Promise<void>;
  deletePregnancy: (id: string) => Promise<void>;
  setSelectedPregnancy: (pregnancy: Pregnancy | null) => void;
  clearError: () => void;
}

const PregnanciesContext = createContext<PregnanciesContextType | undefined>(undefined);

export const PregnanciesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pregnancies, setPregnancies] = useState<Pregnancy[]>([]);
  const [selectedPregnancy, setSelectedPregnancy] = useState<Pregnancy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchPregnancies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pregnancyService.getPregnancies();
      setPregnancies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pregnancies');
    } finally {
      setLoading(false);
    }
  }, []);

  const getPregnancy = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const pregnancy = await pregnancyService.getPregnancyById(id);
      setSelectedPregnancy(pregnancy);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pregnancy');
    } finally {
      setLoading(false);
    }
  }, []);

  const getPregnanciesByPatient = useCallback(async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await pregnancyService.getPregnanciesByPatient(patientId);
      setPregnancies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch patient pregnancies');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPregnancy = useCallback(async (data: Omit<Pregnancy, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newPregnancy = await pregnancyService.createPregnancy(data);
      setPregnancies(prev => [...prev, newPregnancy]);
    } catch (err: any) {
      setError(err.message || 'Failed to create pregnancy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePregnancy = useCallback(async (id: string, data: Partial<Pregnancy>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedPregnancy = await pregnancyService.updatePregnancy(id, data);
      setPregnancies(prev => prev.map(p => p.id === id ? updatedPregnancy : p));
      if (selectedPregnancy?.id === id) {
        setSelectedPregnancy(updatedPregnancy);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update pregnancy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPregnancy]);

  const deletePregnancy = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await pregnancyService.deletePregnancy(id);
      setPregnancies(prev => prev.filter(p => p.id !== id));
      if (selectedPregnancy?.id === id) {
        setSelectedPregnancy(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete pregnancy');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedPregnancy]);

  const value: PregnanciesContextType = {
    pregnancies,
    selectedPregnancy,
    loading,
    error,
    fetchPregnancies,
    getPregnancy,
    getPregnanciesByPatient,
    createPregnancy,
    updatePregnancy,
    deletePregnancy,
    setSelectedPregnancy,
    clearError,
  };

  return <PregnanciesContext.Provider value={value}>{children}</PregnanciesContext.Provider>;
};

export const usePregnancies = () => {
  const context = useContext(PregnanciesContext);
  if (context === undefined) {
    throw new Error('usePregnancies must be used within a PregnanciesProvider');
  }
  return context;
};
