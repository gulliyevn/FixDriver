import { 
  Driver, 
  DriverRegistrationData, 
  DriverStats,
  DriverStatus 
} from '../types/driver';

/**
 * Create mock driver data
 */
export function createMockDriver(data: Partial<DriverRegistrationData> = {}, driverId?: string): Driver {
  return {
    id: driverId || `driver_${Date.now()}`,
    email: data.email || 'driver@example.com',
    phone_number: data.phone_number || '+994501234567',
    first_name: data.first_name || 'John',
    last_name: data.last_name || 'Doe',
    license_number: data.license_number || 'AZ12345678',
    license_expiry_date: data.license_expiry_date || '2027-12-31',
    vehicle_brand: data.vehicle_brand || 'Toyota',
    vehicle_model: data.vehicle_model || 'Camry',
    vehicle_number: data.vehicle_number || '12-AB-123',
    vehicle_year: data.vehicle_year || 2020,
    status: DriverStatus.APPROVED,
    rating: 4.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isAvailable: true,
  };
}

/**
 * Create mock driver statistics
 */
export function createMockDriverStats(): DriverStats {
  return {
    total_trips: 245,
    completed_trips: 238,
    cancelled_trips: 7,
    total_earnings: 2450.75,
    average_rating: 4.8,
    total_ratings: 185,
    online_hours_today: 8.5,
    online_hours_week: 42.3,
    online_hours_month: 168.7,
  };
}

/**
 * Create mock drivers list
 */
export function createMockDrivers(): Driver[] {
  return [
    createMockDriver({}, 'driver1'),
    createMockDriver({}, 'driver2'),
    createMockDriver({}, 'driver3'),
  ];
}
