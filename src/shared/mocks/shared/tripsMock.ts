/**
 * 🚗 TRIPS MOCK DATA
 * 
 * Mock trip data for development and testing.
 * Clean implementation with English comments and data.
 */

export interface Trip {
  id: string;
  title: string;
  description?: string;
  amount: string;
  type: 'completed' | 'cancelled' | 'scheduled';
  status: 'completed' | 'cancelled' | 'scheduled';
  date: string;
  time: string;
  driver?: string;
  route?: string;
}

// Function to get translated mock data
export const getMockTrips = (t: (key: string) => string): Trip[] => [
  {
    id: '1',
    title: t('client.trips.mock.tripToCityCenter'),
    description: t('client.trips.mock.routeLeninGagarin'),
    amount: '15.50 AFc',
    type: 'completed',
    status: 'completed',
    date: '2024-01-15',
    time: '14:30',
    driver: 'Ali Aliyev',
    route: 'Lenin Street - Gagarin Street'
  },
  {
    id: '2',
    title: t('client.trips.mock.tripToAirport'),
    description: t('client.trips.mock.routeHomeAirport'),
    amount: '25.00 AFc',
    type: 'completed',
    status: 'completed',
    date: '2024-01-14',
    time: '08:15',
    driver: 'Veli Veliyev',
    route: 'Home - Airport'
  },
  {
    id: '3',
    title: t('client.trips.mock.tripToSchool'),
    description: t('client.trips.mock.routeHomeSchool'),
    amount: '8.75 AFc',
    type: 'completed',
    status: 'completed',
    date: '2024-01-13',
    time: '07:45',
    driver: 'Rashid Rashidov',
    route: 'Home - School'
  },
  {
    id: '4',
    title: t('client.trips.mock.tripToHospital'),
    description: t('client.trips.mock.routeHomeHospital'),
    amount: '12.25 AFc',
    type: 'cancelled',
    status: 'cancelled',
    date: '2024-01-12',
    time: '16:20',
    driver: 'Samir Samirov',
    route: 'Home - Hospital'
  },
  {
    id: '5',
    title: t('client.trips.mock.tripToMall'),
    description: t('client.trips.mock.routeHomeMall'),
    amount: '18.50 AFc',
    type: 'scheduled',
    status: 'scheduled',
    date: '2024-01-16',
    time: '15:00',
    driver: 'Tamer Tamerov',
    route: 'Home - Mall'
  }
];

// Mock trip types
export const mockTripTypes = [
  { type: 'completed', name: 'Completed', icon: '✅', color: '#4CAF50' },
  { type: 'cancelled', name: 'Cancelled', icon: '❌', color: '#F44336' },
  { type: 'scheduled', name: 'Scheduled', icon: '📅', color: '#FF9800' }
];

// Mock trip statuses
export const mockTripStatuses = [
  { status: 'completed', name: 'Completed', color: '#4CAF50' },
  { status: 'cancelled', name: 'Cancelled', color: '#F44336' },
  { status: 'scheduled', name: 'Scheduled', color: '#FF9800' }
];

// Mock trip routes
export const mockTripRoutes = [
  { route: 'Lenin Street - Gagarin Street', distance: '5.2 km', duration: '15 min' },
  { route: 'Home - Airport', distance: '12.8 km', duration: '25 min' },
  { route: 'Home - School', distance: '3.5 km', duration: '10 min' },
  { route: 'Home - Hospital', distance: '7.1 km', duration: '18 min' },
  { route: 'Home - Mall', distance: '9.3 km', duration: '22 min' }
];

// Helper functions
export const getTripsByType = (trips: Trip[], type: Trip['type']): Trip[] => {
  return trips.filter(trip => trip.type === type);
};

export const getTripsByStatus = (trips: Trip[], status: Trip['status']): Trip[] => {
  return trips.filter(trip => trip.status === status);
};

export const getTripsByDate = (trips: Trip[], date: string): Trip[] => {
  return trips.filter(trip => trip.date === date);
};

export const getTotalAmount = (trips: Trip[]): number => {
  return trips.reduce((total, trip) => {
    const amount = parseFloat(trip.amount.replace(' AFc', ''));
    return total + amount;
  }, 0);
};

export const getCompletedTrips = (trips: Trip[]): Trip[] => {
  return trips.filter(trip => trip.status === 'completed');
};

export const getScheduledTrips = (trips: Trip[]): Trip[] => {
  return trips.filter(trip => trip.status === 'scheduled');
};

export const getCancelledTrips = (trips: Trip[]): Trip[] => {
  return trips.filter(trip => trip.status === 'cancelled');
};