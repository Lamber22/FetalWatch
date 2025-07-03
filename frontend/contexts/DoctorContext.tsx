import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Doctor, DoctorService } from '../services/DoctorService';

interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDoctors: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
}

type DoctorAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DOCTORS'; payload: { doctors: Doctor[]; pagination?: any } }
  | { type: 'SET_SELECTED_DOCTOR'; payload: Doctor | null }
  | { type: 'ADD_DOCTOR'; payload: Doctor }
  | { type: 'UPDATE_DOCTOR'; payload: Doctor }
  | { type: 'REMOVE_DOCTOR'; payload: string }
  | { type: 'CLEAR_DOCTORS' };

const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  loading: false,
  error: null,
  pagination: null,
};

const doctorReducer = (state: DoctorState, action: DoctorAction): DoctorState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_DOCTORS':
      return {
        ...state,
        doctors: action.payload.doctors,
        pagination: action.payload.pagination || null,
        loading: false,
        error: null,
      };
    case 'SET_SELECTED_DOCTOR':
      return { ...state, selectedDoctor: action.payload };
    case 'ADD_DOCTOR':
      return {
        ...state,
        doctors: [...state.doctors, action.payload],
        loading: false,
        error: null,
      };
    case 'UPDATE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.map(doctor =>
          doctor._id === action.payload._id ? action.payload : doctor
        ),
        selectedDoctor: state.selectedDoctor?._id === action.payload._id ? action.payload : state.selectedDoctor,
        loading: false,
        error: null,
      };
    case 'REMOVE_DOCTOR':
      return {
        ...state,
        doctors: state.doctors.filter(doctor => doctor._id !== action.payload),
        selectedDoctor: state.selectedDoctor?._id === action.payload ? null : state.selectedDoctor,
        loading: false,
        error: null,
      };
    case 'CLEAR_DOCTORS':
      return { ...state, doctors: [], selectedDoctor: null, pagination: null };
    default:
      return state;
  }
};

interface DoctorContextType {
  state: DoctorState;
  actions: {
    getAllDoctors: (params?: {
      page?: number;
      limit?: number;
      specialization?: string;
      hospital?: string;
    }) => Promise<void>;
    getDoctorById: (id: string) => Promise<void>;
    createDoctor: (doctorData: Omit<Doctor, '_id' | 'fullName' | 'totalPatients' | 'totalAppointments' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateDoctor: (id: string, doctorData: Partial<Doctor>) => Promise<void>;
    deleteDoctor: (id: string) => Promise<void>;
    getDoctorsBySpecialization: (specialization: string) => Promise<void>;
    getDoctorAvailability: (id: string) => Promise<Doctor['availableHours'] | null>;
    setSelectedDoctor: (doctor: Doctor | null) => void;
    clearDoctors: () => void;
    clearError: () => void;
  };
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const useDoctorContext = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error('useDoctorContext must be used within a DoctorProvider');
  }
  return context;
};

interface DoctorProviderProps {
  children: ReactNode;
}

export const DoctorProvider: React.FC<DoctorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(doctorReducer, initialState);

  const actions = {
    getAllDoctors: async (params?: {
      page?: number;
      limit?: number;
      specialization?: string;
      hospital?: string;
    }) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await DoctorService.getAllDoctors(params);
        dispatch({
          type: 'SET_DOCTORS',
          payload: {
            doctors: Array.isArray(response.data) ? response.data : [response.data as Doctor],
            pagination: response.pagination,
          },
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch doctors',
        });
      }
    },

    getDoctorById: async (id: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const doctor = await DoctorService.getDoctorById(id);
        dispatch({ type: 'SET_SELECTED_DOCTOR', payload: doctor });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch doctor',
        });
      }
    },

    createDoctor: async (doctorData: Omit<Doctor, '_id' | 'fullName' | 'totalPatients' | 'totalAppointments' | 'createdAt' | 'updatedAt'>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const newDoctor = await DoctorService.createDoctor(doctorData);
        dispatch({ type: 'ADD_DOCTOR', payload: newDoctor });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to create doctor',
        });
      }
    },

    updateDoctor: async (id: string, doctorData: Partial<Doctor>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const updatedDoctor = await DoctorService.updateDoctor(id, doctorData);
        dispatch({ type: 'UPDATE_DOCTOR', payload: updatedDoctor });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to update doctor',
        });
      }
    },

    deleteDoctor: async (id: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await DoctorService.deleteDoctor(id);
        dispatch({ type: 'REMOVE_DOCTOR', payload: id });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to delete doctor',
        });
      }
    },

    getDoctorsBySpecialization: async (specialization: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const doctors = await DoctorService.getDoctorsBySpecialization(specialization);
        dispatch({
          type: 'SET_DOCTORS',
          payload: { doctors },
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch doctors by specialization',
        });
      }
    },

    getDoctorAvailability: async (id: string): Promise<Doctor['availableHours'] | null> => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const availability = await DoctorService.getDoctorAvailability(id);
        dispatch({ type: 'SET_LOADING', payload: false });
        return availability;
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch doctor availability',
        });
        return null;
      }
    },

    setSelectedDoctor: (doctor: Doctor | null) => {
      dispatch({ type: 'SET_SELECTED_DOCTOR', payload: doctor });
    },

    clearDoctors: () => {
      dispatch({ type: 'CLEAR_DOCTORS' });
    },

    clearError: () => {
      dispatch({ type: 'SET_ERROR', payload: null });
    },
  };

  return (
    <DoctorContext.Provider value={{ state, actions }}>
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorContext;