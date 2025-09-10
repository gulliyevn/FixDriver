/**
 * 🔐 AUTH MOCK DATA
 * 
 * Mock authentication data for development and testing.
 * Clean implementation with English comments and data.
 */

import { User, UserRole, Client, UserDriver } from '../types';

// Mock users for authentication
export const mockUsers: (Client | UserDriver)[] = [
  {
    id: 'client_1',
    email: 'client@example.com',
    name: 'Anna',
    surname: 'Ivanova',
    phone: '+994501234567',
    role: UserRole.CLIENT,
    avatar: 'https://via.placeholder.com/150',
    rating: 4.8,
    createdAt: '2024-01-01T00:00:00Z',
    address: 'Nizami Street, 23, Baku',
    children: [
      {
        id: 'child_1',
        name: 'Alice Ivanova',
        age: 8,
        school: 'School #15',
        address: 'Nizami Street, 23, Baku',
      }
    ],
    paymentMethods: [
      {
        id: 'card_1',
        type: 'card',
        last4: '1234',
        brand: 'Visa',
        isDefault: true,
      }
    ],
  } as Client,
  {
    id: 'driver_1',
    email: 'driver@example.com',
    name: 'Dmitry',
    surname: 'Petrov',
    phone: '+994509876543',
    role: UserRole.DRIVER,
    avatar: 'https://via.placeholder.com/150',
    rating: 4.9,
    createdAt: '2024-01-01T00:00:00Z',
    address: 'Rashid Beibutov Street, 45, Baku',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'White',
      licensePlate: '10-AA-123',
    },
    isAvailable: true,
    currentLocation: {
      latitude: 40.3777,
      longitude: 49.8920,
    },
    car: 'Toyota Camry 2020',
    carInfo: 'Comfortable sedan for children transportation',
    clientsPerDay: 15,
  } as UserDriver,
];

// Simple passwords for mocks (should not exist in real app)
const mockPasswords: Record<string, string> = {
  'client@example.com': 'password123',
  'driver@example.com': 'password123',
};

/**
 * Find user by email and password
 */
export const findAuthUserByCredentials = (email: string, password: string): (Client | UserDriver) | null => {
  const user = mockUsers.find(user => user.email === email);
  
  if (user && mockPasswords[email] === password) {
    return user;
  }
  
  return null;
};

/**
 * Find user by email
 */
export const findAuthUserByEmail = (email: string): (Client | UserDriver) | null => {
  return mockUsers.find(user => user.email === email) || null;
};

/**
 * Create mock user for authentication
 */
export const createAuthMockUser = (data: Partial<User>): (Client | UserDriver) => {
  const id = `user_${Date.now()}`;
  const now = new Date().toISOString();
  
  if (data.role === UserRole.DRIVER) {
    return {
      id,
      email: data.email || 'user@example.com',
      name: data.name || 'User',
      surname: data.surname || 'Test',
      phone: data.phone || '+994501234567',
      role: UserRole.DRIVER,
      avatar: data.avatar || 'https://via.placeholder.com/150',
      rating: data.rating || 4.5,
      createdAt: data.createdAt || now,
      address: data.address || 'Baku, Azerbaijan',
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        color: 'White',
        licensePlate: '10-AA-123',
      },
      isAvailable: true,
      car: 'Toyota Camry 2020',
      carInfo: 'Comfortable sedan',
      clientsPerDay: 10,
    } as UserDriver;
  } else {
    return {
      id,
      email: data.email || 'user@example.com',
      name: data.name || 'User',
      surname: data.surname || 'Test',
      phone: data.phone || '+994501234567',
      role: UserRole.CLIENT,
      avatar: data.avatar || 'https://via.placeholder.com/150',
      rating: data.rating || 4.5,
      createdAt: data.createdAt || now,
      address: data.address || 'Baku, Azerbaijan',
      children: [],
      paymentMethods: [],
    } as Client;
  }
};