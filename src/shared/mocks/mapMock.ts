import { UserRole } from '../types/user';
import { DriverLocation } from '../../data/datasources/map/MapTypes';

export const createMockDriverLocation = (
  baseLocation: { latitude: number; longitude: number },
  driverData: Partial<DriverLocation['driver']> = {},
  index: number = 0
): DriverLocation => {
  const mockDrivers = [
    {
      id: '1',
      name: 'Alexey',
      surname: 'Petrov',
      email: 'alex@example.com',
      address: 'Moscow',
      role: UserRole.DRIVER,
      phone: '+7 (999) 123-45-67',
      avatar: null,
      rating: 4.8,
      createdAt: new Date().toISOString(),
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        color: 'white',
        licensePlate: 'A123BC',
      },
      isAvailable: true,
    },
    {
      id: '2',
      name: 'Maria',
      surname: 'Ivanova',
      email: 'maria@example.com',
      address: 'Moscow',
      role: UserRole.DRIVER,
      phone: '+7 (999) 234-56-78',
      avatar: null,
      rating: 4.9,
      createdAt: new Date().toISOString(),
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        color: 'silver',
        licensePlate: 'B456DE',
      },
      isAvailable: true,
    },
    {
      id: '3',
      name: 'Dmitry',
      surname: 'Sidorov',
      email: 'dmitry@example.com',
      address: 'Moscow',
      role: UserRole.DRIVER,
      phone: '+7 (999) 345-67-89',
      avatar: null,
      rating: 4.7,
      createdAt: new Date().toISOString(),
      vehicle: {
        make: 'BMW',
        model: 'X5',
        year: 2021,
        color: 'black',
        licensePlate: 'C789FG',
      },
      isAvailable: false,
    },
  ];

  const driver = { ...mockDrivers[index % mockDrivers.length], ...driverData };
  const addresses = ['Moscow, Tverskaya St', 'Moscow, Arbat St', 'Moscow, Pokrovka St'];
  
  return {
    latitude: baseLocation.latitude + (index * 0.001),
    longitude: baseLocation.longitude + (index * 0.001),
    address: addresses[index % addresses.length],
    driver,
    isAvailable: driver.isAvailable,
    rating: driver.rating,
  };
};

export const createMockDriverLocations = (
  baseLocation: { latitude: number; longitude: number },
  count: number = 3
): DriverLocation[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockDriverLocation(baseLocation, {}, index)
  );
};
