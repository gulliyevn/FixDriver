/**
 * 🚗 CARS MOCK DATA
 * 
 * Mock vehicle data for development and testing.
 * Clean implementation with English comments and data.
 */

export interface Car {
  id: string;
  model: string;
  plateNumber: string;
  year: string;
  color: string;
  type: string;
  status: 'active' | 'pending' | 'expired';
}

export const mockCars: Car[] = [
  {
    id: '1',
    model: 'Toyota Camry',
    plateNumber: '10-AA-123',
    year: '2020',
    color: 'White',
    type: 'Sedan',
    status: 'active'
  },
  {
    id: '2',
    model: 'Honda Civic',
    plateNumber: '10-BB-456',
    year: '2019',
    color: 'Silver',
    type: 'Sedan',
    status: 'pending'
  },
  {
    id: '3',
    model: 'Nissan Altima',
    plateNumber: '10-CC-789',
    year: '2021',
    color: 'Black',
    type: 'Sedan',
    status: 'active'
  },
  {
    id: '4',
    model: 'Hyundai Elantra',
    plateNumber: '10-DD-012',
    year: '2018',
    color: 'Blue',
    type: 'Sedan',
    status: 'expired'
  }
];

// Mock car types
export const mockCarTypes = [
  { type: 'sedan', name: 'Sedan', icon: '🚗' },
  { type: 'suv', name: 'SUV', icon: '🚙' },
  { type: 'hatchback', name: 'Hatchback', icon: '🚗' },
  { type: 'coupe', name: 'Coupe', icon: '🚗' }
];

// Mock car colors
export const mockCarColors = [
  { color: 'white', name: 'White', hex: '#FFFFFF' },
  { color: 'black', name: 'Black', hex: '#000000' },
  { color: 'silver', name: 'Silver', hex: '#C0C0C0' },
  { color: 'blue', name: 'Blue', hex: '#0000FF' },
  { color: 'red', name: 'Red', hex: '#FF0000' },
  { color: 'gray', name: 'Gray', hex: '#808080' }
];

// Mock car statuses
export const mockCarStatuses = [
  { status: 'active', name: 'Active', color: '#4CAF50' },
  { status: 'pending', name: 'Pending', color: '#FF9800' },
  { status: 'expired', name: 'Expired', color: '#F44336' }
];