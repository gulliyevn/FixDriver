/**
 * User domain types
 */
export enum UserRole {
  CLIENT = 'client',
  DRIVER = 'driver',
}

/**
 * Base user profile.
 */
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

/**
 * Driver user with vehicle and availability info.
 */
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
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  car?: string;
  carInfo?: string;
  clientsPerDay?: number;
}

/**
 * Client user with optional children and payment methods.
 */
export interface Client extends User {
  role: UserRole.CLIENT;
  children?: Child[];
  paymentMethods?: PaymentMethod[];
}

/**
 * Client child record.
 */
export interface Child {
  id: string;
  name: string;
  age: number;
  school?: string;
  address?: string;
}

/**
 * Payment method attached to client.
 */
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}
