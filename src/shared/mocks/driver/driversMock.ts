/**
 * Mock data for drivers
 * Temporary mock data for development
 */

import { Driver } from '../../types/driver/driver';

export const getMockDrivers = (type: 'driver' | 'client' = 'driver'): Driver[] => {
  if (type === 'client') {
    // Mock clients for driver view
    return [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Smith',
        vehicle_brand: 'Toyota',
        vehicle_model: 'Camry',
        rating: 4.8,
        isAvailable: true,
        phone_number: '+1234567890',
        price: '25.50 AFc'
      },
      {
        id: '2',
        first_name: 'Sarah',
        last_name: 'Johnson',
        vehicle_brand: 'Honda',
        vehicle_model: 'Civic',
        rating: 4.6,
        isAvailable: false,
        phone_number: '+1234567891',
        price: '22.00 AFc'
      },
      {
        id: '3',
        first_name: 'Mike',
        last_name: 'Wilson',
        vehicle_brand: 'Ford',
        vehicle_model: 'Focus',
        rating: 4.9,
        isAvailable: true,
        phone_number: '+1234567892',
        price: '30.00 AFc'
      }
    ];
  }

  // Mock drivers for client view
  return [
    {
      id: '1',
      first_name: 'Ahmed',
      last_name: 'Hassan',
      vehicle_brand: 'Toyota',
      vehicle_model: 'Camry',
      rating: 4.8,
      isAvailable: true,
      phone_number: '+1234567890',
      price: '25.50 AFc'
    },
    {
      id: '2',
      first_name: 'Omar',
      last_name: 'Al-Rashid',
      vehicle_brand: 'Honda',
      vehicle_model: 'Civic',
      rating: 4.6,
      isAvailable: false,
      phone_number: '+1234567891',
      price: '22.00 AFc'
    },
    {
      id: '3',
      first_name: 'Khalid',
      last_name: 'Al-Zahra',
      vehicle_brand: 'Ford',
      vehicle_model: 'Focus',
      rating: 4.9,
      isAvailable: true,
      phone_number: '+1234567892',
      price: '30.00 AFc'
    },
    {
      id: '4',
      first_name: 'Yusuf',
      last_name: 'Al-Mansouri',
      vehicle_brand: 'BMW',
      vehicle_model: 'X5',
      rating: 4.7,
      isAvailable: true,
      phone_number: '+1234567893',
      price: '35.00 AFc'
    },
    {
      id: '5',
      first_name: 'Hassan',
      last_name: 'Al-Qasimi',
      vehicle_brand: 'Mercedes',
      vehicle_model: 'C-Class',
      rating: 4.9,
      isAvailable: true,
      phone_number: '+1234567894',
      price: '40.00 AFc'
    }
  ];
};
