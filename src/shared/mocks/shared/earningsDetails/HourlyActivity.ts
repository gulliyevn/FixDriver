/**
 * ⏰ HOURLY ACTIVITY MOCK DATA
 * 
 * Mock data for hourly activity statistics.
 * Clean implementation with English comments and data.
 */

export interface HourlyActivityItem {
  hour: string;
  rides: number;
  earnings: string;
  efficiency: number;
}

export const mockHourlyActivity: HourlyActivityItem[] = [
  { hour: '06:00', rides: 2, earnings: '25.50 AFc', efficiency: 85 },
  { hour: '07:00', rides: 5, earnings: '68.75 AFc', efficiency: 92 },
  { hour: '08:00', rides: 8, earnings: '112.40 AFc', efficiency: 88 },
  { hour: '09:00', rides: 6, earnings: '89.20 AFc', efficiency: 78 },
  { hour: '10:00', rides: 4, earnings: '56.80 AFc', efficiency: 82 },
  { hour: '11:00', rides: 3, earnings: '42.15 AFc', efficiency: 75 },
  { hour: '12:00', rides: 7, earnings: '98.60 AFc', efficiency: 90 },
  { hour: '13:00', rides: 9, earnings: '134.25 AFc', efficiency: 95 },
  { hour: '14:00', rides: 6, earnings: '87.40 AFc', efficiency: 80 },
  { hour: '15:00', rides: 5, earnings: '73.85 AFc', efficiency: 77 },
  { hour: '16:00', rides: 8, earnings: '119.70 AFc', efficiency: 89 },
  { hour: '17:00', rides: 10, earnings: '145.90 AFc', efficiency: 93 },
  { hour: '18:00', rides: 12, earnings: '178.35 AFc', efficiency: 96 },
  { hour: '19:00', rides: 9, earnings: '132.80 AFc', efficiency: 87 },
  { hour: '20:00', rides: 6, earnings: '89.45 AFc', efficiency: 83 },
  { hour: '21:00', rides: 4, earnings: '61.20 AFc', efficiency: 79 },
  { hour: '22:00', rides: 3, earnings: '45.75 AFc', efficiency: 74 },
  { hour: '23:00', rides: 2, earnings: '32.10 AFc', efficiency: 71 }
];

/**
 * Get hourly activity by time range
 */
export const getHourlyActivityByTimeRange = (startHour: string, endHour: string): HourlyActivityItem[] => {
  return mockHourlyActivity.filter(activity => {
    const hour = parseInt(activity.hour.split(':')[0]);
    const start = parseInt(startHour.split(':')[0]);
    const end = parseInt(endHour.split(':')[0]);
    return hour >= start && hour <= end;
  });
};

/**
 * Get peak hours (highest efficiency)
 */
export const getPeakHours = (limit: number = 5): HourlyActivityItem[] => {
  return mockHourlyActivity
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, limit);
};

/**
 * Get total rides from hourly activity
 */
export const getTotalRidesFromActivity = (activities: HourlyActivityItem[]): number => {
  return activities.reduce((total, activity) => total + activity.rides, 0);
};

/**
 * Get total earnings from hourly activity
 */
export const getTotalEarningsFromActivity = (activities: HourlyActivityItem[]): number => {
  return activities.reduce((total, activity) => {
    const amount = parseFloat(activity.earnings.replace(' AFc', ''));
    return total + amount;
  }, 0);
};
