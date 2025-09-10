/**
 * 📅 SCHEDULE MOCK DATA
 * 
 * Mock schedule data for development and testing.
 * Clean implementation with English comments and data.
 */

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  route: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  earnings: number;
  clientName?: string;
}

export const scheduleItemsMock: ScheduleItem[] = [
  {
    id: '1',
    day: 'Monday',
    time: '08:00 - 18:00',
    route: 'Home → Office → Home',
    status: 'scheduled',
    earnings: 450,
    clientName: 'John Smith'
  },
  {
    id: '2',
    day: 'Tuesday',
    time: '08:00 - 18:00',
    route: 'Home → Office → Home',
    status: 'completed',
    earnings: 420,
    clientName: 'Maria Johnson'
  },
  {
    id: '3',
    day: 'Wednesday',
    time: '08:00 - 18:00',
    route: 'Home → Office → Home',
    status: 'scheduled',
    earnings: 380,
    clientName: 'Alex Brown'
  },
  {
    id: '4',
    day: 'Thursday',
    time: '08:00 - 18:00',
    route: 'Home → Office → Home',
    status: 'completed',
    earnings: 460,
    clientName: 'Sarah Wilson'
  },
  {
    id: '5',
    day: 'Friday',
    time: '08:00 - 18:00',
    route: 'Home → Office → Home',
    status: 'scheduled',
    earnings: 400,
    clientName: 'Mike Davis'
  }
];

// Mock schedule statuses
export const mockScheduleStatuses = [
  { status: 'scheduled', name: 'Scheduled', color: '#FF9800', icon: '📅' },
  { status: 'completed', name: 'Completed', color: '#4CAF50', icon: '✅' },
  { status: 'cancelled', name: 'Cancelled', color: '#F44336', icon: '❌' }
];

// Mock schedule days
export const mockScheduleDays = [
  { day: 'Monday', short: 'Mon', index: 1 },
  { day: 'Tuesday', short: 'Tue', index: 2 },
  { day: 'Wednesday', short: 'Wed', index: 3 },
  { day: 'Thursday', short: 'Thu', index: 4 },
  { day: 'Friday', short: 'Fri', index: 5 },
  { day: 'Saturday', short: 'Sat', index: 6 },
  { day: 'Sunday', short: 'Sun', index: 7 }
];

// Mock schedule routes
export const mockScheduleRoutes = [
  { route: 'Home → Office → Home', distance: '15.2 km', duration: '45 min' },
  { route: 'Home → School → Home', distance: '8.5 km', duration: '25 min' },
  { route: 'Home → Airport → Home', distance: '25.8 km', duration: '60 min' },
  { route: 'Home → Hospital → Home', distance: '12.3 km', duration: '35 min' },
  { route: 'Home → Mall → Home', distance: '18.7 km', duration: '50 min' }
];

// Helper functions
export const getScheduleItemsByStatus = (status: ScheduleItem['status']): ScheduleItem[] => {
  return scheduleItemsMock.filter(item => item.status === status);
};

export const getScheduleItemsByDay = (day: string): ScheduleItem[] => {
  return scheduleItemsMock.filter(item => item.day === day);
};

export const getTotalEarnings = (): number => {
  return scheduleItemsMock.reduce((total, item) => total + item.earnings, 0);
};

export const getCompletedEarnings = (): number => {
  return scheduleItemsMock
    .filter(item => item.status === 'completed')
    .reduce((total, item) => total + item.earnings, 0);
};

export const getScheduledEarnings = (): number => {
  return scheduleItemsMock
    .filter(item => item.status === 'scheduled')
    .reduce((total, item) => total + item.earnings, 0);
};

export const getAverageEarnings = (): number => {
  const completedItems = scheduleItemsMock.filter(item => item.status === 'completed');
  if (completedItems.length === 0) return 0;
  return completedItems.reduce((total, item) => total + item.earnings, 0) / completedItems.length;
};