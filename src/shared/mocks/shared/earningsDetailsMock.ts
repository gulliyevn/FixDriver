/**
 * Mock Earnings Details Data
 * Mock data for detailed earnings statistics
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

export interface HourlyActivityItem {
  hour: string;
  rides: number;
  earnings: string;
  efficiency: number;
}

export interface DistanceMetricItem {
  metric: string;
  value: string;
  icon: string;
  description?: string;
}

export interface RoutePointItem {
  id: string;
  point: string;
  status: 'In Progress' | 'Upcoming';
  time: string;
  address: string;
  clientName?: string;
}

// Mock ride history data
export const mockRideHistory: RideHistoryItem[] = [
  {
    id: '1',
    clientName: 'John',
    clientSurname: 'Doe',
    amount: '45 AFc',
    datetime: '21.08 14:30',
    status: 'Completed',
    rating: 5.0,
    distance: '3.2 km',
    duration: '12 min'
  },
  {
    id: '2',
    clientName: 'Jane',
    clientSurname: 'Smith',
    amount: '32 AFc',
    datetime: '21.08 13:15',
    status: 'Completed',
    rating: 4.8,
    distance: '2.8 km',
    duration: '10 min'
  },
  {
    id: '3',
    clientName: 'Mike',
    clientSurname: 'Johnson',
    amount: '28 AFc',
    datetime: '21.08 12:45',
    status: 'Completed',
    rating: 4.9,
    distance: '2.5 km',
    duration: '8 min'
  },
  {
    id: '4',
    clientName: 'Sarah',
    clientSurname: 'Wilson',
    amount: '0 AFc',
    datetime: '21.08 11:20',
    status: 'Cancelled',
    distance: '1.2 km',
    duration: '5 min'
  },
  {
    id: '5',
    clientName: 'David',
    clientSurname: 'Brown',
    amount: '38 AFc',
    datetime: '21.08 10:30',
    status: 'Completed',
    rating: 4.7,
    distance: '3.0 km',
    duration: '11 min'
  },
];

// Mock hourly activity data
export const mockHourlyActivity: HourlyActivityItem[] = [
  { hour: '06:00', rides: 2, earnings: '45 AFc', efficiency: 85 },
  { hour: '07:00', rides: 5, earnings: '120 AFc', efficiency: 92 },
  { hour: '08:00', rides: 8, earnings: '180 AFc', efficiency: 88 },
  { hour: '09:00', rides: 6, earnings: '140 AFc', efficiency: 90 },
  { hour: '10:00', rides: 4, earnings: '95 AFc', efficiency: 87 },
  { hour: '11:00', rides: 3, earnings: '70 AFc', efficiency: 83 },
  { hour: '12:00', rides: 7, earnings: '160 AFc', efficiency: 91 },
  { hour: '13:00', rides: 9, earnings: '200 AFc', efficiency: 94 },
  { hour: '14:00', rides: 6, earnings: '135 AFc', efficiency: 89 },
  { hour: '15:00', rides: 5, earnings: '115 AFc', efficiency: 86 },
  { hour: '16:00', rides: 4, earnings: '90 AFc', efficiency: 84 },
  { hour: '17:00', rides: 8, earnings: '185 AFc', efficiency: 93 },
  { hour: '18:00', rides: 10, earnings: '220 AFc', efficiency: 96 },
  { hour: '19:00', rides: 7, earnings: '155 AFc', efficiency: 88 },
  { hour: '20:00', rides: 5, earnings: '110 AFc', efficiency: 85 },
  { hour: '21:00', rides: 3, earnings: '65 AFc', efficiency: 82 },
  { hour: '22:00', rides: 2, earnings: '40 AFc', efficiency: 80 },
];

// Mock distance metrics data
export const mockDistanceMetrics: DistanceMetricItem[] = [
  {
    metric: 'Total Distance',
    value: '125.5 km',
    icon: '📏',
    description: 'Total distance driven today'
  },
  {
    metric: 'Average Trip',
    value: '3.2 km',
    icon: '🚗',
    description: 'Average distance per trip'
  },
  {
    metric: 'Longest Trip',
    value: '8.7 km',
    icon: '🛣️',
    description: 'Longest single trip today'
  },
  {
    metric: 'Fuel Efficiency',
    value: '7.2 L/100km',
    icon: '⛽',
    description: 'Average fuel consumption'
  },
];

// Mock route points data
export const mockRoutePoints: RoutePointItem[] = [
  {
    id: '1',
    point: 'Pickup',
    status: 'In Progress',
    time: '14:30',
    address: '123 Main Street, Baku',
    clientName: 'John Doe'
  },
  {
    id: '2',
    point: 'Dropoff',
    status: 'Upcoming',
    time: '14:45',
    address: '456 Central Avenue, Baku',
    clientName: 'John Doe'
  },
  {
    id: '3',
    point: 'Pickup',
    status: 'Upcoming',
    time: '15:00',
    address: '789 Business District, Baku',
    clientName: 'Jane Smith'
  },
  {
    id: '4',
    point: 'Dropoff',
    status: 'Upcoming',
    time: '15:15',
    address: '321 Residential Area, Baku',
    clientName: 'Jane Smith'
  },
];

// Mock earnings summary data
export const mockEarningsSummary = {
  today: {
    totalEarnings: '1,250 AFc',
    totalRides: 45,
    averageEarning: '27.8 AFc',
    workingHours: '8.5 hours',
    efficiency: '92%'
  },
  week: {
    totalEarnings: '8,750 AFc',
    totalRides: 315,
    averageEarning: '27.8 AFc',
    workingHours: '59.5 hours',
    efficiency: '89%'
  },
  month: {
    totalEarnings: '35,000 AFc',
    totalRides: 1260,
    averageEarning: '27.8 AFc',
    workingHours: '238 hours',
    efficiency: '87%'
  }
};

// Mock performance metrics
export const mockPerformanceMetrics = {
  rating: 4.8,
  completionRate: 96.5,
  responseTime: '2.3 min',
  customerSatisfaction: 94.2,
  peakHours: ['08:00-10:00', '17:00-19:00'],
  bestAreas: ['City Center', 'Business District', 'Airport'],
  recommendations: [
    'Focus on peak hours for maximum earnings',
    'Maintain high rating to get priority bookings',
    'Consider working in high-demand areas'
  ]
};