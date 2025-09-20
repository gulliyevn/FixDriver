/**
 * 🚙 MOCK VEHICLE DATA
 */

import { Vehicle } from '../types';

const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle_1',
    driverId: 'driver_1',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'Silver',
    licensePlate: 'ABC-123',
    photos: [
      {
        id: 'photo_1',
        url: 'https://via.placeholder.com/300x200',
        type: 'image',
        filename: 'toyota_camry.jpg',
      },
    ],
    capacity: 4,
    features: ['Air Conditioning', 'GPS', 'Bluetooth'],
    isAvailable: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export default mockVehicles;
