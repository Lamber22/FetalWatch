import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Appointment, AppointmentService } from '../services/AppointmentService';

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  todaysAppointments: Appointment[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAppointments: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
}

type AppointmentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_APPOINTMENTS'; payload: { appointments: Appointment[]; pagination?: any } }
  | { type: 'SET_SELECTED_APPOINTMENT'; payload: Appointment | null }
  | { type: 'SET_TODAYS_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'REMOVE_APPOINTMENT'; payload: string }
  | { type: 'CLEAR_APPOINTMENTS' };

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  todaysAppointments: [],
  loading: false,
  error: null,
  pagination: null,
};

const appointmentReducer = (state: AppointmentState, action: AppointmentAction): AppointmentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_APPOINTMENTS':
      return {
        ...state,
        appointments: action.payload.appointments,
        pagination: action.payload.pagination || null,
        loading: false,
        error: null,
      };
    case 'SET_SELECTED_APPOINTMENT':
      return { ...state, selectedAppointment: action.payload };
    case 'SET_TODAYS_APPOINTMENTS':
      return { ...state, todaysAppointments: action.payload, loading: false, error: null };
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
        loading: false,
        error: null,
      };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(appointment =>
          appointment._id === action.payload._id ? action.payload : appointment
        ),
        todaysAppointments: state.todaysAppointments.map(appointment =>
          appointment._id === action.payload._id ? action.payload : appointment
        ),
        selectedAppointment: state.selectedAppointment?._id === action.payload._id ? action.payload : state.selectedAppointment,
        loading: false,
        error: null,
      };
    case 'REMOVE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment._id !== action.payload),
        todaysAppointments: state.todaysAppointments.filter(appointment => appointment._id !== action.payload),
        selectedAppointment: state.selectedAppointment?._id === action.payload ? null : state.selectedAppointment,
        loading: false,
        error: null,
      };
    case 'CLEAR_APPOINTMENTS':
      return { ...state, appointments: [], selectedAppointment: null, todaysAppointments: [], pagination: null };
    default:
      return state;
  }
};

interface AppointmentContextType {
  state: AppointmentState;
  actions: {
    getAllAppointments: (params?: {
      page?: number;
      limit?: number;
      status?: string;
      appointmentType?: string;
      patientId?: string;
      doctorId?: string;
      date?: string;
      startDate?: string;
      endDate?: string;
    }) => Promise<void>;
    getAppointmentById: (id: string) => Promise<void>;
    createAppointment: (appointmentData: Omit<Appointment, '_id' | 'dateTime' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateAppointment: (id: string, appointmentData: Partial<Appointment>) => Promise<void>;
    deleteAppointment: (id: string) => Promise<void>;
    cancelAppointment: (id: string) => Promise<void>;
    updateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>;
    getAppointmentsByPatient: (patientId: string) => Promise<void>;
    getAppointmentsByDoctor: (doctor: string) => Promise<void>;
    getTodaysAppointments: () => Promise<void>;
    getUpcomingAppointments: (patientId?: string) => Promise<Appointment[]>;
    getPastAppointments: (patientId?: string) => Promise<Appointment[]>;
    getAppointmentsByDateRange: (startDate: string, endDate: string) => Promise<Appointment[]>;
    setSelectedAppointment: (appointment: Appointment | null) => void;
    clearAppointments: () => void;
    clearError: () => void;
  };
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointmentContext = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointmentContext must be used within an AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  const actions = {
    getAllAppointments: async (params?: {
      page?: number;
      limit?: number;
      status?: string;
      appointmentType?: string;
      patientId?: string;
      doctorId?: string;
      date?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await AppointmentService.getAllAppointments(params);
        
        // Handle both cases: response is the appointments array directly OR response has data property
        let appointments: Appointment[];
        let pagination: any = null;
        
        if (Array.isArray(response)) {
          // Response is directly the appointments array
          appointments = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          // Response has data property containing appointments array
          appointments = response.data;
          pagination = response.pagination;
        } else if (response && response.data) {
          // Response has data property with single appointment
          appointments = [response.data as Appointment];
          pagination = response.pagination;
        } else {
          // Fallback
          appointments = [];
        }
        
        dispatch({
          type: 'SET_APPOINTMENTS',
          payload: {
            appointments,
            pagination,
          },
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch appointments',
        });
      }
    },

    getAppointmentById: async (id: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const appointment = await AppointmentService.getAppointmentById(id);
        dispatch({ type: 'SET_SELECTED_APPOINTMENT', payload: appointment });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch appointment',
        });
      }
    },

    createAppointment: async (appointmentData: Omit<Appointment, '_id' | 'dateTime' | 'createdAt' | 'updatedAt'>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const newAppointment = await AppointmentService.createAppointment(appointmentData);
        dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to create appointment',
        });
      }
    },

    updateAppointment: async (id: string, appointmentData: Partial<Appointment>) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const updatedAppointment = await AppointmentService.updateAppointment(id, appointmentData);
        dispatch({ type: 'UPDATE_APPOINTMENT', payload: updatedAppointment });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to update appointment',
        });
      }
    },

    deleteAppointment: async (id: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await AppointmentService.deleteAppointment(id);
        dispatch({ type: 'REMOVE_APPOINTMENT', payload: id });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to delete appointment',
        });
      }
    },

    cancelAppointment: async (id: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const cancelledAppointment = await AppointmentService.cancelAppointment(id);
        dispatch({ type: 'UPDATE_APPOINTMENT', payload: cancelledAppointment });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to cancel appointment',
        });
      }
    },

    updateAppointmentStatus: async (id: string, status: Appointment['status']) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const updatedAppointment = await AppointmentService.updateAppointmentStatus(id, status);
        dispatch({ type: 'UPDATE_APPOINTMENT', payload: updatedAppointment });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to update appointment status',
        });
      }
    },

    getAppointmentsByPatient: async (patientId: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const appointments = await AppointmentService.getAppointmentsByPatient(patientId);
        dispatch({
          type: 'SET_APPOINTMENTS',
          payload: { appointments },
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch patient appointments',
        });
      }
    },

    getAppointmentsByDoctor: async (doctor: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const appointments = await AppointmentService.getAppointmentsByDoctor(doctor);
        dispatch({
          type: 'SET_APPOINTMENTS',
          payload: { appointments },
        });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch doctor appointments',
        });
      }
    },

    getTodaysAppointments: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const appointments = await AppointmentService.getTodaysAppointments();
        dispatch({ type: 'SET_TODAYS_APPOINTMENTS', payload: appointments });
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch today\'s appointments',
        });
      }
    },

    getUpcomingAppointments: async (patientId?: string): Promise<Appointment[]> => {
      try {
        return await AppointmentService.getUpcomingAppointments(patientId);
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch upcoming appointments',
        });
        return [];
      }
    },

    getPastAppointments: async (patientId?: string): Promise<Appointment[]> => {
      try {
        return await AppointmentService.getPastAppointments(patientId);
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch past appointments',
        });
        return [];
      }
    },

    getAppointmentsByDateRange: async (startDate: string, endDate: string): Promise<Appointment[]> => {
      try {
        return await AppointmentService.getAppointmentsByDateRange(startDate, endDate);
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: error instanceof Error ? error.message : 'Failed to fetch appointments by date range',
        });
        return [];
      }
    },

    setSelectedAppointment: (appointment: Appointment | null) => {
      dispatch({ type: 'SET_SELECTED_APPOINTMENT', payload: appointment });
    },

    clearAppointments: () => {
      dispatch({ type: 'CLEAR_APPOINTMENTS' });
    },

    clearError: () => {
      dispatch({ type: 'SET_ERROR', payload: null });
    },
  };

  return (
    <AppointmentContext.Provider value={{ state, actions }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export default AppointmentContext;