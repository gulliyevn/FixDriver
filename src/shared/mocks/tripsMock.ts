/**
 * Mock data for trips
 * Temporary mock data for development
 */

import { Trip } from '../types/Trip';

export const getMockTrips = (t: (key: string) => string): Trip[] => {
  return [
    {
      id: '1',
      title: t('trips.mock.completedTrip'),
      date: '2024-01-15',
      time: '14:30',
      amount: '$25.50',
      status: 'completed',
      type: 'completed',
      description: t('trips.mock.tripDescription'),
      driver: t('trips.mock.driverName')
    },
    {
      id: '2',
      title: t('trips.mock.cancelledTrip'),
      date: '2024-01-14',
      time: '10:15',
      amount: '$0.00',
      status: 'cancelled',
      type: 'cancelled',
      description: t('trips.mock.cancelledDescription')
    },
    {
      id: '3',
      title: t('trips.mock.scheduledTrip'),
      date: '2024-01-16',
      time: '09:00',
      amount: '$18.75',
      status: 'scheduled',
      type: 'scheduled',
      description: t('trips.mock.scheduledDescription'),
      driver: t('trips.mock.driverName2')
    }
  ];
};
