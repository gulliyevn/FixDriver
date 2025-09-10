import { EarningsChartData } from '../../data/datasources/DriverStatsService';

/**
 * Create mock earnings chart data
 */
export function createMockEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): EarningsChartData {
  const mockData = {
    today: {
      labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
      data: [15, 25, 35, 45, 30]
    },
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [120, 150, 180, 200, 220, 250, 280]
    },
    month: {
      labels: ['1', '5', '10', '15', '20', '25', '30'],
      data: [800, 1200, 1600, 2000, 2400, 2800, 3200]
    },
    year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000, 52000, 55000, 58000, 62000]
    }
  };

  return {
    labels: mockData[period].labels,
    data: mockData[period].data,
    period
  };
}
