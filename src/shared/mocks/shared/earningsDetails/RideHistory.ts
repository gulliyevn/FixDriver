/**
 * 🚗 RIDE HISTORY MOCK DATA
 * 
 * Mock data for ride history statistics.
 * Clean implementation with English comments and data.
 */

export interface RideHistoryItem {
  id: string;
  clientName: string;
  clientSurname: string;
  amount: string;
  datetime: string;
  status: 'Completed' | 'In Progress' | 'Cancelled';
  rating?: number;
  distance?: string;
  duration?: string;
}

export const mockRideHistory: RideHistoryItem[] = [
  {
    id: '1',
    clientName: 'Anna',
    clientSurname: 'Ivanova',
    amount: '15.50 AFc',
    datetime: '2024-01-15 14:30',
    status: 'Completed',
    rating: 5,
    distance: '5.2 km',
    duration: '12 min'
  },
  {
    id: '2',
    clientName: 'Maria',
    clientSurname: 'Petrova',
    amount: '22.75 AFc',
    datetime: '2024-01-15 16:45',
    status: 'Completed',
    rating: 4,
    distance: '8.1 km',
    duration: '18 min'
  },
  {
    id: '3',
    clientName: 'Elena',
    clientSurname: 'Sidorova',
    amount: '18.25 AFc',
    datetime: '2024-01-15 18:20',
    status: 'Completed',
    rating: 5,
    distance: '6.7 km',
    duration: '15 min'
  },
  {
    id: '4',
    clientName: 'Olga',
    clientSurname: 'Kozlova',
    amount: '0.00 AFc',
    datetime: '2024-01-15 19:10',
    status: 'Cancelled',
    distance: '2.1 km',
    duration: '5 min'
  }
];

/**
 * Get ride history by status
 */
export const getRideHistoryByStatus = (status: 'Completed' | 'In Progress' | 'Cancelled'): RideHistoryItem[] => {
  return mockRideHistory.filter(ride => ride.status === status);
};

/**
 * Get ride history by date range
 */
export const getRideHistoryByDateRange = (startDate: string, endDate: string): RideHistoryItem[] => {
  return mockRideHistory.filter(ride => {
    const rideDate = ride.datetime.split(' ')[0];
    return rideDate >= startDate && rideDate <= endDate;
  });
};

/**
 * Get total earnings from ride history
 */
export const getTotalEarningsFromHistory = (rides: RideHistoryItem[]): number => {
  return rides
    .filter(ride => ride.status === 'Completed')
    .reduce((total, ride) => {
      const amount = parseFloat(ride.amount.replace(' AFc', ''));
      return total + amount;
    }, 0);
};
