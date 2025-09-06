import { User, UserRole } from '../types/user';
import { Driver, DriverStatus } from '../types/driver';
import { MOCK_AVATARS, MOCK_LOCATIONS } from './constants';

// ===== ФАБРИКИ ДЛЯ СОЗДАНИЯ МОКОВ =====

/**
 * Создает мок пользователя
 */
export const createMockUser = (options: {
  email: string;
  authMethod?: 'google' | 'facebook' | 'apple';
  role?: UserRole;
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
}): User => {
  return {
    id: `user_${Date.now()}`,
    email: options.email,
    name: options.name || 'Пользователь',
    surname: options.surname || 'Тестовый',
    role: options.role || UserRole.CLIENT,
    phone: options.phone || '+994500000000',
    avatar: MOCK_AVATARS.CLIENT_1,
    rating: 4.5,
    createdAt: new Date().toISOString(),
    address: options.address || 'Баку, Азербайджан',
  };
};

/**
 * Создает мок водителя
 */
export const createMockDriver = (options: {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_number?: string;
}): Driver => {
  return {
    id: `driver_${Date.now()}`,
    email: options.email,
    first_name: options.first_name,
    last_name: options.last_name,
    phone_number: options.phone_number,
    license_number: `AB${Math.floor(Math.random() * 999999)}`,
    license_expiry_date: '2025-12-31',
    vehicle_brand: options.vehicle_brand || 'Toyota',
    vehicle_model: options.vehicle_model || 'Camry',
    vehicle_number: options.vehicle_number || '10-AA-000',
    vehicle_year: 2020,
    status: DriverStatus.ACTIVE,
    rating: 4.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isAvailable: true,
    avatar: MOCK_AVATARS.DRIVER_1,
    location: MOCK_LOCATIONS.BAKU_CENTER,
  };
};

/**
 * Создает мок адреса
 */
export const createMockAddress = (options: {
  title: string;
  address: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}) => {
  return {
    id: `address_${Date.now()}`,
    title: options.title,
    address: options.address,
    isDefault: options.isDefault || false,
    latitude: options.latitude || MOCK_LOCATIONS.BAKU_CENTER.latitude,
    longitude: options.longitude || MOCK_LOCATIONS.BAKU_CENTER.longitude,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Создает мок заказа
 */
export const createMockOrder = (options: {
  clientId: string;
  driverId?: string;
  pickupAddress: string;
  destinationAddress: string;
  amount?: number;
  status?: string;
}) => {
  return {
    id: `order_${Date.now()}`,
    clientId: options.clientId,
    driverId: options.driverId || null,
    pickupAddress: options.pickupAddress,
    destinationAddress: options.destinationAddress,
    amount: options.amount || Math.floor(Math.random() * 50) + 10,
    status: options.status || 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Создает мок уведомления
 */
export const createMockNotification = (options: {
  title: string;
  message: string;
  type?: string;
  isRead?: boolean;
}) => {
  return {
    id: `notification_${Date.now()}`,
    title: options.title,
    message: options.message,
    type: options.type || 'system',
    isRead: options.isRead || false,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Создает мок карты
 */
export const createMockCard = (options: {
  cardNumber: string;
  cardType?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardholderName?: string;
}) => {
  return {
    id: `card_${Date.now()}`,
    cardNumber: options.cardNumber,
    cardType: options.cardType || 'visa',
    expiryMonth: options.expiryMonth || '12',
    expiryYear: options.expiryYear || '2025',
    cardholderName: options.cardholderName || 'CARD HOLDER',
    isDefault: false,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Создает мок автомобиля
 */
export const createMockCar = (options: {
  brand: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
}) => {
  return {
    id: `car_${Date.now()}`,
    brand: options.brand,
    model: options.model,
    year: options.year,
    color: options.color,
    plateNumber: options.plateNumber,
    isDefault: false,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Создает мок долга
 */
export const createMockDebt = (options: {
  amount: number;
  description: string;
  dueDate: string;
  type?: string;
}) => {
  return {
    id: `debt_${Date.now()}`,
    amount: options.amount,
    description: options.description,
    dueDate: options.dueDate,
    type: options.type || 'ride',
    status: 'active',
    createdAt: new Date().toISOString(),
  };
}; 