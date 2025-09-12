/**
 * 🚗 DRIVER MODAL MOCK DATA
 * 
 * Mock data for driver modal components.
 * Clean implementation with English comments and data.
 */

import mockUsers from '../data/users';

export type TripDotStyle = 'default' | 'blue' | 'location';

export interface DriverTripItem {
  text: string;
  time: string;
  dotStyle: TripDotStyle;
}

export interface DriverInfoMock {
  schedule: string;
  price: string; // Includes currency AFc
  distance: string; // In kilometers
  time: string; // In minutes
  childName: string;
  childAge: string; // In years
  childType: string; // son/daughter
}

export const getClientName = (clientId: string): string => {
  const client = mockClients.find((c) => c.id === clientId);
  return client ? `${client.name} ${client.surname}` : `Client ${clientId}`;
};

export const getDriverInfo = (driverId: string): DriverInfoMock => {
  const schedules = ['Mon-Fri', 'Mon, Wed, Fri', 'Tue, Thu, Sat', 'Mon-Sat'];
  const prices = ['15.50 AFc', '18.75 AFc', '22.00 AFc', '25.25 AFc'];
  const distances = ['5.2 km', '7.8 km', '12.3 km', '15.6 km'];
  const times = ['15 min', '22 min', '35 min', '42 min'];
  const childNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
  const childAges = ['8 years', '10 years', '12 years', '14 years'];
  const childTypes = ['daughter', 'son', 'daughter', 'son'];

  const randomIndex = Math.floor(Math.random() * schedules.length);
  
  return {
    schedule: schedules[randomIndex],
    price: prices[randomIndex],
    distance: distances[randomIndex],
    time: times[randomIndex],
    childName: childNames[randomIndex],
    childAge: childAges[randomIndex],
    childType: childTypes[randomIndex],
  };
};

export const getDriverTripItems = (driverId: string): DriverTripItem[] => {
  const tripTexts = [
    'Pick up from home',
    'Drop off at school',
    'Pick up from school',
    'Drop off at home'
  ];
  
  const tripTimes = ['08:00', '08:15', '15:00', '15:15'];
  
  const dotStyles: TripDotStyle[] = ['location', 'default', 'default', 'location'];
  
  return tripTexts.map((text, index) => ({
    text,
    time: tripTimes[index],
    dotStyle: dotStyles[index]
  }));
};

export const getDriverRating = (driverId: string): number => {
  // Mock rating between 4.0 and 5.0
  return Math.round((4.0 + Math.random()) * 10) / 10;
};

export const getDriverStatus = (driverId: string): string => {
  const statuses = ['Available', 'Busy', 'Offline'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const getDriverVehicle = (driverId: string): string => {
  const vehicles = [
    'Toyota Camry 2020',
    'Honda Civic 2019',
    'Nissan Altima 2021',
    'Hyundai Elantra 2018'
  ];
  return vehicles[Math.floor(Math.random() * vehicles.length)];
};

export const getDriverExperience = (driverId: string): string => {
  const experiences = ['2 years', '3 years', '5 years', '7 years'];
  return experiences[Math.floor(Math.random() * experiences.length)];
};

export const getDriverLanguages = (driverId: string): string[] => {
  const languages = [
    ['English', 'Azerbaijani'],
    ['English', 'Russian', 'Azerbaijani'],
    ['English', 'Turkish', 'Azerbaijani'],
    ['English', 'Azerbaijani', 'Persian']
  ];
  return languages[Math.floor(Math.random() * languages.length)];
};

export const getDriverSpecializations = (driverId: string): string[] => {
  const specializations = [
    ['Child Safety', 'School Routes'],
    ['Airport Transfers', 'Long Distance'],
    ['City Center', 'Business District'],
    ['Hospital Routes', 'Emergency Transport']
  ];
  return specializations[Math.floor(Math.random() * specializations.length)];
};