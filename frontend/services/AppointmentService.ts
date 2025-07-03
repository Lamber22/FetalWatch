import { apiService } from './API';

interface Appointment {
  _id?: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  appointmentType: 'Routine Checkup' | 'Ultrasound' | 'Blood Test' | 'Consultation' | 'Follow-up' | 'Emergency' | 'Prenatal Care' | 'Postnatal Care' | 'Vaccination' | 'Other';
  notes?: string;
  status?: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  duration?: number;
  doctor: string;
  dateTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AppointmentResponse {
  success: boolean;
  data: Appointment | Appointment[];
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalAppointments: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const AppointmentService = {
  async getAllAppointments(params?: {
    page?: number;
    limit?: number;
    status?: string;
    appointmentType?: string;
    patientId?: string;
    doctorId?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AppointmentResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.appointmentType) queryParams.append('appointmentType', params.appointmentType);
    if (params?.patientId) queryParams.append('patientId', params.patientId);
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId);
    if (params?.date) queryParams.append('date', params.date);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const result = await apiService.get<AppointmentResponse>(`/appointments?${queryParams.toString()}`);
    return result.data!;
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    const result = await apiService.getById<AppointmentResponse>('appointments', id);
    return result.data!.data as Appointment;
  },

  async createAppointment(data: Omit<Appointment, '_id' | 'dateTime' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const result = await apiService.create<AppointmentResponse>('appointments', data);
    return result.data!.data as Appointment;
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const result = await apiService.update<AppointmentResponse>('appointments', id, data);
    return result.data!.data as Appointment;
  },

  async deleteAppointment(id: string): Promise<void> {
    await apiService.remove('appointments', id);
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    const result = await apiService.patch<AppointmentResponse>(`appointments/${id}/cancel`, {});
    return result.data!.data as Appointment;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    const result = await apiService.patch<AppointmentResponse>(`appointments/${id}/status`, { status });
    return result.data!.data as Appointment;
  },

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    const result = await apiService.get<AppointmentResponse>(`/appointments/patient/${patientId}`);
    return result.data!.data as Appointment[];
  },

  async getAppointmentsByDoctor(doctor: string): Promise<Appointment[]> {
    const result = await apiService.get<AppointmentResponse>(`/appointments/doctor/${doctor}`);
    return result.data!.data as Appointment[];
  },

  async getTodaysAppointments(): Promise<Appointment[]> {
    const result = await apiService.get<AppointmentResponse>('/appointments/today');
    return result.data!.data as Appointment[];
  },

  // Helper methods for common operations
  async getUpcomingAppointments(patientId?: string): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    const params = {
      startDate: today,
      ...(patientId && { patientId })
    };
    const response = await this.getAllAppointments(params);
    return response.data as Appointment[];
  },

  async getPastAppointments(patientId?: string): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    const params = {
      endDate: today,
      ...(patientId && { patientId })
    };
    const response = await this.getAllAppointments(params);
    return response.data as Appointment[];
  },

  async getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    const response = await this.getAllAppointments({ startDate, endDate });
    return response.data as Appointment[];
  }
};

export type { Appointment, AppointmentResponse };