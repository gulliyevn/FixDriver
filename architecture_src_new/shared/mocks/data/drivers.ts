/**
 * 🚗 MOCK DRIVER DATA
 */

import { Driver } from '../types';

const mockDrivers: Driver[] = [
  {
    id: 'driver_1',
    userId: 'user_2',
    status: 'available',
    currentLocation: {
      id: 'loc_1',
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'New York, NY',
      city: 'New York',
      country: 'USA',
    },
    rating: { value: 4.9, count: 150, average: 4.9 },
    vehicleId: 'vehicle_1',
    licenseNumber: 'DL123456',
    experience: 5,
    totalTrips: 1250,
    totalEarnings: 25000,
    isOnline: true,
    lastActive: new Date(),
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export default mockDrivers;
