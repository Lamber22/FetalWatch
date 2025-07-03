import { apiService } from './API';

interface Doctor {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: number;
  qualifications: {
    degree: string;
    institution: string;
    year: number;
  }[];
  hospital: {
    name: string;
    address: string;
    department?: string;
  };
  consultationFee?: number;
  availableHours: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  bio?: string;
  languages?: string[];
  profileImage?: string;
  appointments?: string[];
  patients?: string[];
  fullName?: string;
  totalPatients?: number;
  totalAppointments?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface DoctorResponse {
  success: boolean;
  data: Doctor | Doctor[];
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalDoctors: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const DoctorService = {
  async getAllDoctors(params?: {
    page?: number;
    limit?: number;
    specialization?: string;
    hospital?: string;
  }): Promise<DoctorResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.specialization) queryParams.append('specialization', params.specialization);
    if (params?.hospital) queryParams.append('hospital', params.hospital);
    
    const result = await apiService.get<DoctorResponse>(`/doctors?${queryParams.toString()}`);
    return result.data!;
  },

  async getDoctorById(id: string): Promise<Doctor> {
    const result = await apiService.getById<DoctorResponse>('doctors', id);
    return result.data!.data as Doctor;
  },

  async createDoctor(data: Omit<Doctor, '_id' | 'fullName' | 'totalPatients' | 'totalAppointments' | 'createdAt' | 'updatedAt'>): Promise<Doctor> {
    const result = await apiService.create<DoctorResponse>('doctors', data);
    return result.data!.data as Doctor;
  },

  async updateDoctor(id: string, data: Partial<Doctor>): Promise<Doctor> {
    const result = await apiService.update<DoctorResponse>('doctors', id, data);
    return result.data!.data as Doctor;
  },

  async deleteDoctor(id: string): Promise<void> {
    await apiService.remove('doctors', id);
  },

  async getDoctorsBySpecialization(specialization: string): Promise<Doctor[]> {
    const result = await apiService.get<DoctorResponse>(`/doctors/specialization/${specialization}`);
    return result.data!.data as Doctor[];
  },

  async getDoctorAvailability(id: string): Promise<Doctor['availableHours']> {
    const result = await apiService.get<{ success: boolean; data: Doctor['availableHours'] }>(`/doctors/${id}/availability`);
    return result.data!.data;
  },

  // Helper methods for common operations
  async getAvailableDoctors(specialization?: string): Promise<Doctor[]> {
    const params = specialization ? { specialization } : undefined;
    const response = await this.getAllDoctors(params);
    return response.data as Doctor[];
  },

  async searchDoctors(searchTerm: string): Promise<Doctor[]> {
    const response = await this.getAllDoctors({ hospital: searchTerm });
    return response.data as Doctor[];
  }
};

export type { Doctor, DoctorResponse };