/**
 * Mock Factories
 * Factory functions for creating mock data
 */

import { User, UserRole } from '../types/user';
import { Driver, DriverStatus } from '../types/driver';
import { MOCK_AVATARS, MOCK_LOCATIONS } from './constants';

/**
 * Create mock user
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
    name: options.name || 'Test User',
    surname: options.surname || 'Mock',
    role: options.role || UserRole.CLIENT,
    phone: options.phone || '+994500000000',
    avatar: MOCK_AVATARS.CLIENT_1,
    rating: 4.5,
    createdAt: new Date().toISOString(),
    address: options.address || 'Baku, Azerbaijan',
  };
};

/**
 * Create mock driver
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
    vehicle_brand: options.vehicle_brand || 'Toyota',
    vehicle_model: options.vehicle_model || 'Camry',
    vehicle_number: options.vehicle_number || '10-AA-123',
    status: DriverStatus.ACTIVE,
    rating: 4.8,
    license_number: 'DL123456789',
    license_expiry_date: '2025-12-31',
    isOnline: false,
    location: MOCK_LOCATIONS.BAKU_CENTER,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

/**
 * Create mock order
 */
export const createMockOrder = (options: {
  userId: string;
  driverId?: string;
  from: string;
  to: string;
  price?: number;
  distance?: number;
  duration?: number;
}) => {
  return {
    id: `order_${Date.now()}`,
    userId: options.userId,
    driverId: options.driverId || null,
    from: {
      address: options.from,
      latitude: MOCK_LOCATIONS.BAKU_CENTER.latitude,
      longitude: MOCK_LOCATIONS.BAKU_CENTER.longitude,
    },
    to: {
      address: options.to,
      latitude: MOCK_LOCATIONS.BAKU_NORTH.latitude,
      longitude: MOCK_LOCATIONS.BAKU_NORTH.longitude,
    },
    price: options.price || 25.50,
    distance: options.distance || 5.2,
    duration: options.duration || 15,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Create mock notification
 */
export const createMockNotification = (options: {
  title: string;
  message: string;
  type?: 'order' | 'payment' | 'system' | 'promo';
  userId: string;
}) => {
  return {
    id: `notification_${Date.now()}`,
    title: options.title,
    message: options.message,
    type: options.type || 'system',
    userId: options.userId,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Create mock payment
 */
export const createMockPayment = (options: {
  userId: string;
  amount: number;
  type?: 'card' | 'cash' | 'balance';
  description?: string;
}) => {
  return {
    id: `payment_${Date.now()}`,
    userId: options.userId,
    amount: options.amount,
    type: options.type || 'card',
    description: options.description || 'Payment',
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
};

/**
 * Create mock address
 */
export const createMockAddress = (options: {
  title: string;
  address: string;
  category?: string;
  isDefault?: boolean;
  userId: string;
}) => {
  return {
    id: `address_${Date.now()}`,
    title: options.title,
    address: options.address,
    category: options.category || 'other',
    isDefault: options.isDefault || false,
    userId: options.userId,
    latitude: MOCK_LOCATIONS.BAKU_CENTER.latitude,
    longitude: MOCK_LOCATIONS.BAKU_CENTER.longitude,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Create mock vehicle
 */
export const createMockVehicle = (options: {
  driverId: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  plateNumber?: string;
}) => {
  return {
    id: `vehicle_${Date.now()}`,
    driverId: options.driverId,
    brand: options.brand || 'Toyota',
    model: options.model || 'Camry',
    year: options.year || 2020,
    color: options.color || 'White',
    plateNumber: options.plateNumber || '10-AA-123',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Create mock review
 */
export const createMockReview = (options: {
  orderId: string;
  userId: string;
  driverId: string;
  rating: number;
  comment?: string;
}) => {
  return {
    id: `review_${Date.now()}`,
    orderId: options.orderId,
    userId: options.userId,
    driverId: options.driverId,
    rating: options.rating,
    comment: options.comment || '',
    createdAt: new Date().toISOString(),
  };
};