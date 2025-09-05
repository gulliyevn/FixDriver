// User types for the application

import { UserRole, Location } from './common';

// Re-export Location for convenience
export { Location };

// Base user interface
export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: UserRole;
  phone: string;
  avatar: string | null;
  rating: number;
  createdAt: string;
  address: string;
  birthDate?: string;
}

// Driver user interface
export interface UserDriver extends User {
  role: UserRole.DRIVER;
  vehicle: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  isAvailable: boolean;
  currentLocation?: Location;
  car?: string;
  carInfo?: string;
  clientsPerDay?: number;
}

// Client user interface
export interface Client extends User {
  role: UserRole.CLIENT;
  children?: Child[];
  paymentMethods?: PaymentMethod[];
}

// Child interface
export interface Child {
  id: string;
  name: string;
  age: number;
  school?: string;
  address?: string;
}

// Payment method interface
export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'wallet';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  isDefault?: boolean;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  role: UserRole;
  birthDate?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Profile update types
export interface UpdateProfileRequest {
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  avatar?: string;
}

// Driver specific types
export interface UpdateDriverProfileRequest extends UpdateProfileRequest {
  vehicle?: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  isAvailable?: boolean;
}

// Location types for user
export interface UserLocation extends Location {
  userId: string;
  isActive: boolean;
  lastUpdated: string;
}

// User stats types
export interface UserStats {
  totalTrips: number;
  totalEarnings: number;
  rating: number;
  completedTrips: number;
  cancelledTrips: number;
}

export interface DriverStats extends UserStats {
  onlineHours: number;
  averageRating: number;
  clientsPerDay: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
}

// User preferences
export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  privacy: {
    shareLocation: boolean;
    showOnlineStatus: boolean;
  };
}

// User session types
export interface UserSession {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
  isActive: boolean;
}

// User verification types
export interface VerificationRequest {
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// Password reset types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}