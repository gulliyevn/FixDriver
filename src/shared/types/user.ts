export type UserRole = 'client' | 'driver' | 'admin';

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

// Профиль клиента
export interface ClientProfile {
  balance: number;
  rating?: number;
  totalTrips: number;
  createdAt: string;
  updatedAt: string;
}

// Профиль водителя
export interface DriverProfile {
  licenseNumber: string;
  vehicleInfo?: VehicleInfo;
  rating: number;
  totalTrips: number;
  isOnline: boolean;
  currentLocation?: Location;
  createdAt: string;
  updatedAt: string;
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
  model: string;
  year: number;
  color: string;
  licensePlate: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Аутентификация
export interface AuthResponse {
  token: string;
  userId: string;
  success: boolean;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

// Утилиты для работы с профилями
export type UserWithClientProfile = User & { profiles: { client: ClientProfile } };
export type UserWithDriverProfile = User & { profiles: { driver: DriverProfile } };
export type UserWithAdminProfile = User & { profiles: { admin: AdminProfile } };
