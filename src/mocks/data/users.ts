import { User, UserRole } from '../../types/user';
import { Driver, DriverStats, DriverStatus } from '../../types/driver';
import { MOCK_AVATARS, MOCK_LOCATIONS } from '../constants';

// ===== ДАННЫЕ ПОЛЬЗОВАТЕЛЕЙ =====

// Основной клиент (используется в профиле)
export const mockUsers: User[] = [
  {
    id: 'client_1',
    email: 'anna.ivanova@example.com',
    name: 'Анна',
    surname: 'Иванова',
    role: UserRole.CLIENT,
    phone: '+994501234567',
    avatar: MOCK_AVATARS.CLIENT_1,
    rating: 4.8,
    createdAt: '2024-01-01T00:00:00Z',
    address: 'ул. Низами, 23, Баку',
  },
];

// Водители
export const mockDrivers: Driver[] = [
  {
    id: 'driver_1',
    email: 'alex.petrov@example.com',
    first_name: 'Алексей',
    last_name: 'Петров',
    phone_number: '+994501112233',
    license_number: 'AB123456',
    license_expiry_date: '2025-12-31',
    vehicle_brand: 'Toyota',
    vehicle_model: 'Camry',
    vehicle_number: '10-AA-123',
    vehicle_year: 2020,
    status: DriverStatus.ACTIVE,
    rating: 4.8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    isAvailable: true,
    avatar: MOCK_AVATARS.DRIVER_1,
    location: MOCK_LOCATIONS.BAKU_CENTER,
  },
  {
    id: 'driver_2',
    email: 'dmitry.smirnov@example.com',
    first_name: 'Дмитрий',
    last_name: 'Смирнов',
    phone_number: '+994504445566',
    license_number: 'CD789012',
    license_expiry_date: '2026-06-30',
    vehicle_brand: 'Honda',
    vehicle_model: 'Civic',
    vehicle_number: '10-BB-456',
    vehicle_year: 2019,
    status: DriverStatus.ACTIVE,
    rating: 4.6,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-15T09:15:00Z',
    isAvailable: true,
    avatar: MOCK_AVATARS.DRIVER_2,
    location: MOCK_LOCATIONS.BAKU_NORTH,
  },
  {
    id: 'driver_3',
    email: 'sergey.kozlov@example.com',
    first_name: 'Сергей',
    last_name: 'Козлов',
    phone_number: '+994507778899',
    license_number: 'EF345678',
    license_expiry_date: '2025-03-15',
    vehicle_brand: 'Ford',
    vehicle_model: 'Focus',
    vehicle_number: '10-CC-789',
    vehicle_year: 2021,
    status: DriverStatus.ACTIVE,
    rating: 4.9,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-15T13:45:00Z',
    isAvailable: false,
    avatar: MOCK_AVATARS.DRIVER_3,
    location: MOCK_LOCATIONS.BAKU_EAST,
  },
];

// Статистика водителей
export const mockDriverStats: DriverStats[] = [
  {
    total_trips: 156,
    completed_trips: 150,
    cancelled_trips: 6,
    total_earnings: 12500.50,
    average_rating: 4.8,
    total_ratings: 142,
    online_hours_today: 8.5,
    online_hours_week: 45.2,
    online_hours_month: 180.5,
  },
  {
    total_trips: 89,
    completed_trips: 85,
    cancelled_trips: 4,
    total_earnings: 7200.75,
    average_rating: 4.6,
    total_ratings: 78,
    online_hours_today: 6.2,
    online_hours_week: 32.1,
    online_hours_month: 125.8,
  },
  {
    total_trips: 234,
    completed_trips: 228,
    cancelled_trips: 6,
    total_earnings: 18900.25,
    average_rating: 4.9,
    total_ratings: 215,
    online_hours_today: 10.1,
    online_hours_week: 58.7,
    online_hours_month: 245.3,
  },
]; 