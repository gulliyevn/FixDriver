export interface TravelPackage {
  id: string;
  name: string;
  type: 'single' | 'weekly' | 'monthly' | 'yearly';
  price: number;
  tripsIncluded?: number; // количество поездок для пакетных планов
  kmLimit?: number; // лимит километров
  timeLimit?: number; // лимит времени в минутах
  duration: number; // длительность в днях
  description: string;
  isActive: boolean;
  tripsRemaining?: number; // оставшиеся поездки
  expiresAt?: Date;
}

export interface PackageRoutePoint {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  order: number; // порядок точки в маршруте
  description?: string; // например "Дом", "Школа", "Офис"
}

export interface Passenger {
  id: string;
  name: string;
  relationship: string; // дочь, мама, босс и т.д.
  phone?: string;
  notes?: string;
  isTemplate: boolean; // сохранен ли как шаблон
}

export interface BookingRequest {
  id: string;
  packageId?: string; // ID активного пакета
  passenger: Passenger;
  route: PackageRoutePoint[];
  departureTime: Date;
  returnTime?: Date; // для обратных поездок
  driverNotes?: string;
  isRoundTrip: boolean;
  estimatedDistance: number;
  estimatedDuration: number;
  estimatedPrice: number;
  needsExtraPayment: boolean; // если выходит за лимиты пакета
  extraPaymentAmount?: number;
}

export interface ActivePackage extends TravelPackage {
  purchasedAt: Date;
  tripsUsed: number;
  kmUsed: number;
  timeUsed: number;
}

export type PackageType = 'single' | 'weekly' | 'monthly' | 'yearly';

export interface Package {
  id: string;
  name: string;
  description: string;
  tripsCount: number;
  price: number;
  originalPrice?: number;
  validityDays: number;
  features: string[];
  isPopular?: boolean;
  isActive?: boolean;
  tripsRemaining?: number;
  expiresAt?: string;
} 