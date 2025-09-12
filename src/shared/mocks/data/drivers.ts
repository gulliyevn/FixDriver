/**
 * 🚗 MOCK DRIVER DATA
 */

import { Driver, DriverStatus } from '../../types/driver/driver';

const mockDrivers: Driver[] = [
  {
    id: 'driver_1',
    // userId: 'user_2',
    // email: 'driver@example.com',
    first_name: 'John',
    last_name: 'Driver',
    phone_number: '+994501234568',
    // status: 'available',
    // currentLocation: {
      id: 'loc_1',
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'New York, NY',
      city: 'New York',
      country: 'USA',
    // },
    rating: 4.9,
    vehicleId: 'vehicle_1',
    vehicle_brand: 'Toyota',
    vehicle_model: 'Camry',
    license_number: 'AZ123456',
    vehicle_number: '12-AB-123',
    experience: 5,
    totalTrips: 1250,
    totalEarnings: 25000,
    isOnline: true,
    lastActive: new Date(),
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

// Mock data for top drivers (will be replaced with gRPC data)
export const mockTopDrivers = [
  {
    id: '1',
    name: 'Алексей Петров',
    level: 'VIP 8',
    rides: 45,
    earnings: 1250,
    position: 1,
    avatar: null
  },
  {
    id: '2',
    name: 'Мария Иванова',
    level: 'VIP 6',
    rides: 42,
    earnings: 1180,
    position: 2,
    avatar: null
  },
  {
    id: '3',
    name: 'Дмитрий Сидоров',
    level: 'VIP 5',
    rides: 38,
    earnings: 1050,
    position: 3,
    avatar: null
  },
  {
    id: '4',
    name: 'Анна Козлова',
    level: 'VIP 3',
    rides: 35,
    earnings: 980,
    position: 4,
    avatar: null
  },
  {
    id: '5',
    name: 'Сергей Новиков',
    level: 'VIP 2',
    rides: 32,
    earnings: 890,
    position: 5,
    avatar: null
  },
  {
    id: '6',
    name: 'Елена Морозова',
    level: 'VIP 1',
    rides: 28,
    earnings: 750,
    position: 6,
    avatar: null
  },
  {
    id: '7',
    name: 'Андрей Волков',
    level: 'Император',
    rides: 25,
    earnings: 680,
    position: 7,
    avatar: null
  },
  {
    id: '8',
    name: 'Ольга Лебедева',
    level: 'Суперзвезда',
    rides: 22,
    earnings: 620,
    position: 8,
    avatar: null
  },
  {
    id: '9',
    name: 'Игорь Соколов',
    level: 'Чемпион',
    rides: 20,
    earnings: 580,
    position: 9,
    avatar: null
  },
  {
    id: '10',
    name: 'Наталья Романова',
    level: 'Надежный',
    rides: 18,
    earnings: 520,
    position: 10,
    avatar: null
  }
];

export default mockDrivers;
