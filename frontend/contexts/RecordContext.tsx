import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { recordService, MedicalRecord } from '../services/RecordService';

interface RecordContextType {
  records: MedicalRecord[];
  selectedRecord: MedicalRecord | null;
  loading: boolean;
  error: string | null;
  fetchRecords: (patientId: string) => Promise<void>;
  getRecord: (id: string) => Promise<void>;
  createRecord: (data: Omit<MedicalRecord, 'id'>) => Promise<MedicalRecord>;
  updateRecord: (id: string, data: Partial<MedicalRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  setSelectedRecord: (record: MedicalRecord | null) => void;
  clearError: () => void;
}

const RecordContext = createContext<RecordContextType | undefined>(undefined);

export const RecordProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const fetchRecords = useCallback(async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await recordService.getRecordsByPatient(patientId);
      setRecords(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecord = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const record = await recordService.getRecordById(id);
      setSelectedRecord(record);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch record');
    } finally {
      setLoading(false);
    }
  }, []);

  const createRecord = useCallback(async (data: Omit<MedicalRecord, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newRecord = await recordService.createRecord(data);
      setRecords(prev => [newRecord, ...prev]);
      return newRecord;
    } catch (err: any) {
      setError(err.message || 'Failed to create record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecord = useCallback(async (id: string, data: Partial<MedicalRecord>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRecord = await recordService.updateRecord(id, data);
      setRecords(prev =>
        prev.map(record => (record.id === id ? { ...record, ...updatedRecord } : record))
      );
      if (selectedRecord?.id === id) {
        setSelectedRecord(prev => (prev ? { ...prev, ...updatedRecord } : null));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRecord]);

  const deleteRecord = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await recordService.deleteRecord(id);
      setRecords(prev => prev.filter(record => record.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete record');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRecord]);

  const value = {
    records,
    selectedRecord,
    loading,
    error,
    fetchRecords,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord,
    setSelectedRecord,
    clearError,
  };

  return <RecordContext.Provider value={value}>{children}</RecordContext.Provider>;
};

export const useRecords = () => {
  const context = useContext(RecordContext);
  if (context === undefined) {
    throw new Error('useRecords must be used within a RecordProvider');
  }
  return context;
};