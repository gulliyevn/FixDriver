// Common types used across the application

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: number;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
  type?: 'start' | 'waypoint' | 'end';
}

// Driver location with additional info
export interface DriverLocation extends Location {
  driver: {
    id: string;
    name: string;
    rating: number;
    vehicle: {
      model: string;
      color: string;
      plateNumber: string;
    };
  };
}

// User roles
export enum UserRole {
  CLIENT = 'client',
  DRIVER = 'driver',
}

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

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common status types
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Theme types
export type Theme = 'light' | 'dark';

// Language types
export type Language = 'az' | 'en' | 'ru' | 'tr';