import { UserRole } from './permissions';

// Базовый пользователь
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole; // текущая активная роль
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Профили для разных ролей (может быть несколько)
  profiles: {
    client?: ClientProfile;
    driver?: DriverProfile;
    admin?: AdminProfile;
  };
}

// Профиль администратора
export interface AdminProfile {
  permissions: string[];
  accessLevel: 'basic' | 'advanced' | 'super';
  createdAt: string;
  updatedAt: string;
}

// Вспомогательные типы
export interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  seats: number;
  features: string[];
  photos: string[];
  documents: {
    registration: DocumentInfo;
    insurance?: DocumentInfo;
    inspection?: DocumentInfo;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Аутентификация (основные типы)
export interface AuthResponse {
  token: string;
  userId: string;
  success: boolean;
  user?: User;
}

// Утилиты для работы с профилями
export type UserWithClientProfile = User & { profiles: { client: ClientProfile } };
export type UserWithDriverProfile = User & { profiles: { driver: DriverProfile } };
export type UserWithAdminProfile = User & { profiles: { admin: AdminProfile } };

// Дополнительные типы для клиентов
export interface Child {
  id: string;
  name: string;
  age: number;
  school?: string;
  address?: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: 'visa' | 'mastercard' | 'amex' | 'discover';
  isDefault: boolean;
  isActive: boolean;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  createdAt: string;
  updatedAt: string;
}

// Расширенный профиль клиента
export interface ClientProfile {
  balance: number;
  rating?: number;
  totalTrips: number;
  children?: Child[];
  paymentMethods?: PaymentMethod[];
  preferences: {
    language: 'ru' | 'en' | 'az';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    accessibility: {
      wheelchairAccess: boolean;
      childSeat: boolean;
      petFriendly: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Расширенный профиль водителя
export interface DriverProfile {
  licenseNumber: string;
  vehicleInfo?: VehicleInfo;
  rating: number;
  totalTrips: number;
  isOnline: boolean;
  currentLocation?: Location;
  experience: {
    years: number;
    totalDistance: number;
    completedTrips: number;
  };
  earnings: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    averagePerTrip: number;
  };
  schedule: {
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
    isFlexible: boolean;
  };
  documents: {
    license: DocumentInfo;
    insurance?: DocumentInfo;
    vehicleRegistration?: DocumentInfo;
    backgroundCheck?: DocumentInfo;
  };
  createdAt: string;
  updatedAt: string;
}

// Информация о документе
export interface DocumentInfo {
  id: string;
  type: string;
  number: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  isVerified: boolean;
  verificationDate?: string;
  documentUrl?: string;
}
