// Централизованные моки и утилиты для DriverModal
// Переносит локальные моки из `src/components/DriverModal.tsx`

import { mockClients, mockDrivers } from './index';

export type TripDotStyle = 'default' | 'blue' | 'location';

export interface DriverTripItem {
  text: string;
  time: string;
  dotStyle: TripDotStyle;
}

export interface DriverInfoMock {
  schedule: string;
  price: string; // Включает валюту AFc
  distance: string; // В км
  time: string; // В минутах
  childName: string;
  childAge: string; // В годах
  childType: string; // сын/дочь
}

export const getClientName = (clientId: string): string => {
  const client = mockClients.find((c) => c.id === clientId);
  return client ? `${client.first_name} ${client.last_name}` : `Клиент ${clientId}`;
};

export const getDriverInfo = (driverId: string): DriverInfoMock => {
  const schedules = ['пн-пт', 'пн, ср, пт', 'вт, чт, сб', 'пн-сб'];
  const prices = ['25.5 AFc', '18.75 AFc', '22.0 AFc', '30.0 AFc'];
  const distances = ['5.2', '3.8', '4.5', '6.1'];
  const times = ['30', '25', '28', '35'];
  const childNames = ['Алиса', 'Михаил', 'Елена', 'Дмитрий'];
  const childAges = ['8', '12', '10', '9'];
  const childTypes = ['дочь', 'сын', 'дочь', 'сын'];

  const numeric = parseInt((driverId || '').replace(/\D/g, ''), 10);
  const index = Number.isFinite(numeric) && numeric > 0 ? numeric % schedules.length : 0;

  return {
    schedule: schedules[index],
    price: prices[index],
    distance: distances[index],
    time: times[index],
    childName: childNames[index],
    childAge: childAges[index],
    childType: childTypes[index],
  };
};

export const getDriverTrips = (driverId: string): DriverTripItem[] => {
  const tripTemplates = [
    ['Дом', 'Офис', 'Школа'],
    ['Центр города', 'Аэропорт', 'Торговый центр'],
    ['Больница', 'Университет', 'Парк'],
    ['Вокзал', 'Рынок', 'Спортзал'],
  ];
  const timeTemplates = [
    ['07:30', '08:15', '17:45'],
    ['08:00', '09:30', '18:30'],
    ['07:45', '12:00', '19:15'],
    ['08:30', '14:20', '20:00'],
  ];

  const numeric = parseInt((driverId || '').replace(/\D/g, ''), 10);
  const index = Number.isFinite(numeric) && numeric > 0 ? numeric % tripTemplates.length : 0;

  const trips = tripTemplates[index];
  const times = timeTemplates[index];

  return trips.map((trip, i) => ({
    text: trip,
    time: times[i],
    dotStyle: (i === 0 ? 'default' : i === 1 ? 'blue' : 'location') as TripDotStyle,
  }));
};

export const getSampleDriverId = (): string => (mockDrivers[0]?.id ?? 'driver_1');
export const getSampleClientId = (): string => (mockClients[0]?.id ?? 'client_1');


