/**
 * Mock Data
 * Centralized mock data for all services
 */

import { User, Order, OrderStatus, UserRole } from './types';

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'user_1',
    email: 'client@example.com',
    name: 'John',
    surname: 'Doe',
    phone: '+1234567890',
    role: UserRole.CLIENT,
    avatar: '',
    rating: 4.5,
    createdAt: '2024-01-01T00:00:00Z',
    address: '123 Main St',
  },
  {
    id: 'user_2',
    email: 'driver@example.com',
    name: 'Jane',
    surname: 'Smith',
    phone: '+1234567891',
    role: UserRole.DRIVER,
    avatar: '',
    rating: 4.5,
    createdAt: '2024-01-01T00:00:00Z',
    address: '123 Main St',
  },
];

// Mock drivers data
export const mockDrivers = [
  {
    id: 'driver_1',
    name: 'Jane Smith',
    status: 'available',
    isOnline: true,
    rating: 4.8,
    totalTrips: 150,
  },
  {
    id: 'driver_2',
    name: 'Mike Johnson',
    status: 'busy',
    isOnline: true,
    rating: 4.6,
    totalTrips: 120,
  },
  {
    id: 'driver_3',
    name: 'Sarah Wilson',
    status: 'offline',
    isOnline: false,
    rating: 4.9,
    totalTrips: 200,
  },
];

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: 'order_1',
    clientId: 'user_1',
    driverId: 'driver_1',
    from: 'New York, NY',
    to: 'Times Square, NY',
    status: 'completed',
    departureTime: '2024-01-01T10:00:00Z',
    passenger: {
      name: 'John Doe',
      relationship: 'self'
    },
    route: [],
    price: 25.50,
    distance: 5.2,
    duration: 15,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:15:00Z',
  },
  {
    id: 'order_2',
    clientId: 'user_1',
    driverId: 'driver_2',
    from: 'Times Square, NY',
    to: 'New York, NY',
    status: 'in_progress',
    departureTime: '2024-01-01T11:00:00Z',
    passenger: {
      name: 'John Doe',
      relationship: 'self'
    },
    route: [],
    price: 18.75,
    distance: 3.8,
    duration: 12,
    createdAt: '2024-01-01T11:00:00Z',
    updatedAt: '2024-01-01T11:05:00Z',
  },
];

// Mock locations data
export const mockLocations = [
  {
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'New York, NY',
  },
  {
    latitude: 40.7589,
    longitude: -73.9851,
    address: 'Times Square, NY',
  },
  {
    latitude: 40.7505,
    longitude: -73.9934,
    address: 'Central Park, NY',
  },
];

export default {
  users: mockUsers,
  drivers: mockDrivers,
  orders: mockOrders,
  locations: mockLocations,
};
