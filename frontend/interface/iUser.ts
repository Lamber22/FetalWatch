export interface User {
  id: string;
  firstName: string;
  lastName: string;
  facilityName?: string;
  email: string;
  role: string;
  isActive?: boolean;
  emailVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  activatedAt?: string;
}

export interface PendingUser extends User {
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface CreateUserData {
  facilityName?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface AdminSignUpData {
  facilityName?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otp: string;
}

export interface SignUpData {
  facilityName?: string;
  facilityAddress?: string;
  facilityPhone?: string;
  facilityType?: string;
  facilityLicenseNumber?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: string;
  otp: string;
}

// Authentication related interfaces
export interface SignInData {
  email: string;
  password: string;
}

export interface InitiateSignUpData {
  email: string;
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface ResendOTPData {
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyResetOTPData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  resetToken: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailOnlyData {
  email: string;
}

export interface ConfirmEmailVerificationData {
  email: string;
  otp: string;
}

export interface UserWithFacility extends User {
  facility?: {
    facilityName?: string;
    email?: string;
    [key: string]: any;
  };
}