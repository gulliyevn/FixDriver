import { Driver } from '../screens/client/DriverCard';

export const driversMock: Driver[] = [
  // Пример одного водителя, остальные можно сгенерировать аналогично
  {
    id: '1',
    name: 'Иван Иванов',
    rating: 4.9,
    totalRides: 320,
    carModel: 'Toyota Camry',
    carNumber: '90-AB-123',
    isOnline: true,
    distance: '1.2 км',
    estimatedTime: '7 мин',
    isAvailable: true,
    photo: undefined,
    package: 'plus',
    price: 10,
    experience: 7,
    vehicleYear: 2018,
    hasAirCondition: true,
    hasWifi: true,
    hasCharger: true,
    forMember: 'me',
    tripDays: 'пн, ср, пт',
    addresses: ['Дом ул. Низами 10', 'Офис БЦ Port Baku', 'Торговый центр 28 Mall'],
    departureTime: '08:00',
    arrivalTime: '18:30',
    schedule: 'пн, ср, пт (8:00-18:30)',
  },
  // ... (сюда можно добавить генерацию или копипасту других моков)
]; 