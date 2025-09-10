import { DriverVehicle } from '../types/driver/DriverVehicle';

export const mockDriverVehicles: DriverVehicle[] = [
  {
    id: '1',
    driverId: 'driver-1',
    vehicleNumber: 'АА 123 ББ',
    tariff: 'Стандарт',
    carBrand: 'Toyota',
    carModel: 'Camry',
    carYear: '2020',
    carMileage: '45000',
    passportPhoto: 'https://example.com/passport1.jpg',
    isActive: true,
    isVerified: true, // Верифицированный автомобиль
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    driverId: 'driver-1',
    vehicleNumber: 'ВВ 456 ГГ',
    tariff: 'Премиум',
    carBrand: 'BMW',
    carModel: 'X5',
    carYear: '2022',
    carMileage: '25000',
    passportPhoto: 'https://example.com/passport2.jpg',
    isActive: false,
    isVerified: false, // Ожидает верификации
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z',
  },
];

export const mockEmptyVehicles: DriverVehicle[] = [];

export const mockVehicleFormData = {
  vehicleNumber: '',
  tariff: '',
  carBrand: '',
  carModel: '',
  carYear: '',
  carMileage: '',
  passportPhoto: '',
};

export const mockVehicleFormErrors = {
  vehicleNumber: '',
  tariff: '',
  carBrand: '',
  carModel: '',
  carYear: '',
  carMileage: '',
  passportPhoto: '',
};

// Мок-ответы для API
export const mockVehicleResponse = {
  success: true,
  data: mockDriverVehicles[0],
};

export const mockVehiclesListResponse = {
  success: true,
  data: mockDriverVehicles,
};

export const mockErrorResponse = {
  success: false,
  error: 'Произошла ошибка при загрузке данных',
};
