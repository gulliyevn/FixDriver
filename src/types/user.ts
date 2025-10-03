export enum UserRole {
  CLIENT = "client",
  DRIVER = "driver",
}

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

export interface Client extends User {
  role: UserRole.CLIENT;
  children?: Child[];
  paymentMethods?: PaymentMethod[];
}

export interface Child {
  id: string;
  name: string;
  age: number;
  school?: string;
  address?: string;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "paypal";
  last4?: string;
  brand?: string;
  isDefault: boolean;
}
