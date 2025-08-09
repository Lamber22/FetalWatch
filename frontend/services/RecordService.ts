import { apiService } from './API';

export interface MedicalRecord {
  id?: string;
  patient: string;
  date?: string;
  timeIn?: string;
  timeOut?: string;
  
  // Obstetric History
  gravida?: number;
  para?: number;
  abortion?: number;
  delivery?: number;
  lastMenstrualPeriod?: string;
  expectedDueDate?: string;
  ageAtMenarche?: number;
  antenatalVisitNumber?: 1 | 2 | 3;
  
  // Delivery History
  nvd?: boolean;
  nvdNumber?: number;
  complications?: string[];
  cesareanSection?: boolean;
  cesareanCount?: number;
  cesareanIndication?: string;
  cesareanComplication?: string;
  
  // Clinical Information
  chiefComplaint?: string;
  historyPresentIllness?: string;
  
  // Medical History
  medicalHistory?: {
    hypertension?: boolean;
    diabetes?: boolean;
    asthma?: boolean;
    epilepsy?: boolean;
    heartDisease?: boolean;
    spotting?: boolean;
    tuberculosis?: boolean;
  };
  
  // Family Planning
  familyPlanning?: {
    uses?: boolean;
    method?: string;
  };
  
  immunizations?: string[];
  
  // Physical Examination
  physicalExam?: {
    generalAppearance?: string[];
    weight?: number;
    height?: number;
    bloodPressure?: string;
    pulse?: number;
    respiratoryRate?: number;
    temperature?: number;
    edemaLevel?: string;
    anasarca?: boolean;
  };
  
  // Sheet Information
  sheet?: {
    fundusHeight?: number;
    anyScars?: string;
    fetalHeartTone?: string;
    lie?: string;
    presentingPart?: string;
    shotNote?: string;
  };
  
  // Laboratory Results
  labs?: Array<{
    visitNumber?: number;
    hgb?: string;
    m_s?: string;
    u_a?: string;
    fbsRbs?: string;
    rpr?: string;
    spot?: string;
    others?: string;
  }>;
  
  // Medication
  medication?: {
    prenatal?: string[];
    antibiotic?: string;
    analgesics?: string;
    others?: string;
  };
  
  // Follow Up
  followUp?: {
    nextVisitDate?: string;
    screenerName?: string;
    qualification?: string;
    signedBy?: string;
  };
  
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const recordService = {
  async createRecord(data: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> {
    const result = await apiService.post<MedicalRecord>('/records', data);
    return result.data!;
  },

  async getRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
    const result = await apiService.get<MedicalRecord[]>(`/records/patient/${patientId}`);
    return result.data!;
  },

  async getRecordById(recordId: string): Promise<MedicalRecord> {
    const result = await apiService.get<MedicalRecord>(`/records/${recordId}`);
    return result.data!;
  },

  async updateRecord(recordId: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const result = await apiService.put<MedicalRecord>(`/records/${recordId}`, data);
    return result.data!;
  },

  async deleteRecord(recordId: string): Promise<void> {
    await apiService.delete(`/records/${recordId}`);
  },
};