import { Driver, DriverStatus } from '../types/driver';

export const driversMock: Driver[] = [
  // Пример одного водителя, остальные можно сгенерировать аналогично
  {
    id: '1',
    email: 'ivan@example.com',
    phone_number: '+994501234567',
    first_name: 'Иван',
    last_name: 'Иванов',
    license_number: '123456789',
    license_expiry_date: '2025-12-31',
    vehicle_brand: 'Toyota',
    vehicle_model: 'Camry',
    vehicle_number: '90-AB-123',
    vehicle_year: 2018,
    status: DriverStatus.ACTIVE,
    rating: 4.9,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    
    // UI поля
    isAvailable: true,
    avatar: undefined,
    name: 'Иван Иванов',
    carModel: 'Toyota Camry',
    carNumber: '90-AB-123',
    isOnline: true,
    clientsPerDay: 5,
    addresses: ['Дом ул. Низами 10', 'Офис БЦ Port Baku', 'Торговый центр 28 Mall'],
    times: ['08:00', '18:30'],
    tripDays: 'пн, ср, пт',
    package: 'plus',
  },
  // ... (сюда можно добавить генерацию или копипасту других моков)
]; 