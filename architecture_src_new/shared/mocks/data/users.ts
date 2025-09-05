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
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: 'client',
    avatar: 'https://via.placeholder.com/150',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    profiles: {
      client: {
        balance: 150.50,
        rating: 4.8,
        totalTrips: 25,
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          accessibility: {
            wheelchairAccess: false,
            childSeat: false,
            petFriendly: false,
          },
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }
    }
  },
  {
    id: 'user_2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1234567891',
    role: 'driver',
    avatar: 'https://via.placeholder.com/150',
    isVerified: true,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    profiles: {
      driver: {
        licenseNumber: 'DL123456789',
        rating: 4.9,
        totalTrips: 150,
        isOnline: true,
        experience: {
          years: 3,
          totalDistance: 15000,
          completedTrips: 150,
        },
        earnings: {
          total: 5000,
          thisMonth: 800,
          thisWeek: 200,
          averagePerTrip: 33.33,
        },
        schedule: {
          workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          workingHours: {
            start: '08:00',
            end: '18:00',
          },
          isFlexible: true,
        },
        documents: {
          license: {
            id: 'doc_1',
            type: 'driver_license',
            number: 'DL123456789',
            issuedBy: 'DMV',
            issuedDate: '2021-01-01',
            expiryDate: '2026-01-01',
            isVerified: true,
            verificationDate: '2021-01-15',
          },
        },
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      }
    }
  },
  {
    id: 'user_3',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    phone: '+1234567892',
    role: 'client',
    avatar: 'https://via.placeholder.com/150',
    isVerified: true,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
    profiles: {
      client: {
        balance: 75.25,
        rating: 4.5,
        totalTrips: 12,
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            push: false,
            sms: false,
          },
          accessibility: {
            wheelchairAccess: false,
            childSeat: false,
            petFriendly: false,
          },
        },
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z',
      }
    }
  },
];

export default mockUsers;
