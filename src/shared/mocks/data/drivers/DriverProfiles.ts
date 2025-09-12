/**
 * Driver Profiles
 * Mock data for driver profile information
 */

import { Driver } from '../../../../types/driver/driver';
import { MOCK_LOCATIONS } from '../../constants';

export const MOCK_DRIVER_PROFILES: Driver[] = [
  {
    id: 'driver_1',
    first_name: 'John',
    last_name: 'Driver',
    phone_number: '+994501234568',
    vehicle_brand: 'Toyota',
    vehicle_model: 'Camry',
    rating: 4.9,
    isAvailable: true,
    price: '25.50'
  }
];

export const getDriverProfileById = (id: string): Driver | undefined => {
  return MOCK_DRIVER_PROFILES.find(driver => driver.id === id);
};

export const getOnlineDrivers = (): Driver[] => {
  return MOCK_DRIVER_PROFILES.filter(driver => driver.isAvailable);
};

export const getDriversByStatus = (status: string): Driver[] => {
  return MOCK_DRIVER_PROFILES.filter(driver => driver.isAvailable);
};

export const getDriversByPackage = (packageType: 'base' | 'plus' | 'premium'): Driver[] => {
  return MOCK_DRIVER_PROFILES;
};
