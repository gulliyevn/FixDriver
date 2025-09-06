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
    color: 'Белый',
    type: 'Седан',
    status: 'active'
  },
  {
    id: '2',
    model: 'Honda Civic',
    plateNumber: '10-BB-456',
    year: '2019',
    color: 'Серебристый',
    type: 'Седан',
    status: 'pending'
  }
]; 