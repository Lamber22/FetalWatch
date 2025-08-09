export interface SocialHistory {
  maritalStatus?: 'Married' | 'Single';
  occupation?: string;
  student?: boolean;
  educationLevel?: string;
  title?: string;
}

export interface Habits {
  smokes?: boolean;
  drinksAlcohol?: boolean;
}

export interface EmergencyContact {
  name: string;
  contactNumber: string;
  location: string;
}

export interface Facility {
  _id: string;
  facilityName: string;
  email: string;
}

export interface MedicalHistoryConditions {
  hypertension?: boolean;
  diabetes?: boolean;
  asthma?: boolean;
  epilepsy?: boolean;
  heartDisease?: boolean;
  spotting?: boolean;
  tuberculosis?: boolean;
}

export interface FamilyPlanning {
  uses?: boolean;
  method?: string;
}

export interface PhysicalExam {
  generalAppearance?: string[];
  weight?: number;
  height?: number;
  bloodPressure?: string;
  pulse?: number;
  respiratoryRate?: number;
  temperature?: number;
  edemaLevel?: string;
  anasarca?: boolean;
}

export interface MedicalSheet {
  fundusHeight?: number;
  anyScars?: string;
  fetalHeartTone?: string;
  lie?: string;
  presentingPart?: string;
  shotNote?: string;
}

export interface LabResult {
  visitNumber?: number;
  hgb?: string;
  m_s?: string;
  u_a?: string;
  fbsRbs?: string;
  rpr?: string;
  spot?: string;
  others?: string;
}

export interface Medication {
  prenatal?: string[];
  antibiotic?: string;
  analgesics?: string;
  others?: string;
}

export interface FollowUp {
  nextVisitDate?: string;
  screenerName?: string;
  qualification?: string;
  signedBy?: string;
}

export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface MedicalRecord {
  _id: string;
  patient: string;
  date?: string;
  timeIn?: string;
  timeOut?: string;
  gravida?: number;
  para?: number;
  abortion?: number;
  delivery?: number;
  lastMenstrualPeriod?: string;
  expectedDueDate?: string;
  ageAtMenarche?: number;
  antenatalVisitNumber?: 1 | 2 | 3;
  nvd?: boolean;
  nvdNumber?: number;
  complications?: string[];
  cesareanSection?: boolean;
  cesareanCount?: number;
  cesareanIndication?: string;
  cesareanComplication?: string;
  chiefComplaint?: string;
  historyPresentIllness?: string;
  medicalHistory?: MedicalHistoryConditions;
  familyPlanning?: FamilyPlanning;
  immunizations?: string[];
  physicalExam?: PhysicalExam;
  sheet?: MedicalSheet;
  labs?: LabResult[];
  medication?: Medication;
  followUp?: FollowUp;
  createdBy?: CreatedBy;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  _id?: string;
  id?: string;
  facility?: Facility;
  name: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female';
  address?: string;
  contact?: string;
  emergencyContact?: EmergencyContact;
  socialHistory?: SocialHistory;
  habits?: Habits;
  medicalRecords?: MedicalRecord[];
  pregnancies?: any[];
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  weekOfPregnancy?: number;
  expectedDeliveryDate?: string;
  expectedDueDate?: string;
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: string;
}

// Context-specific types
export interface PatientsContextType {
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
