/**
 * 👥 MOCK USER DATA
 * 
 * Sample users for development and testing.
 * Easy to replace with gRPC calls later.
 */

import { User } from '../types';

const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1234567890',
    role: 'client',
    status: 'active',
    avatar: 'https://via.placeholder.com/150',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    rating: {
      value: 4.8,
      count: 25,
      average: 4.8,
    },
    preferences: {
      language: 'en',
      theme: 'auto',
      notifications: {
        push: true,
        email: true,
        sms: false,
        orderUpdates: true,
        promotions: false,
      },
      privacy: {
        shareLocation: true,
        shareProfile: false,
        shareHistory: false,
      },
    },
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+1234567891',
    role: 'driver',
    status: 'active',
    avatar: 'https://via.placeholder.com/150',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
    rating: {
      value: 4.9,
      count: 150,
      average: 4.9,
    },
    preferences: {
      language: 'en',
      theme: 'dark',
      notifications: {
        push: true,
        email: true,
        sms: true,
        orderUpdates: true,
        promotions: false,
      },
      privacy: {
        shareLocation: true,
        shareProfile: true,
        shareHistory: false,
      },
    },
  },
  {
    id: 'user_3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'password123',
    phone: '+1234567892',
    role: 'client',
    status: 'active',
    avatar: 'https://via.placeholder.com/150',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    rating: {
      value: 4.5,
      count: 12,
      average: 4.5,
    },
    preferences: {
      language: 'en',
      theme: 'light',
      notifications: {
        push: false,
        email: true,
        sms: false,
        orderUpdates: true,
        promotions: true,
      },
      privacy: {
        shareLocation: false,
        shareProfile: false,
        shareHistory: false,
      },
    },
  },
];

export default mockUsers;
