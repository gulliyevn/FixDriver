/**
 * 📊 EARNINGS DETAILS MOCK DATA
 * 
 * Centralized exports for earnings details mock data.
 * Clean implementation with English comments and modular structure.
 */

// Export types and data modules
export * from './RideHistory';
export * from './HourlyActivity';
export * from './DistanceMetrics';

// Export combined data
export { mockRideHistory } from './RideHistory';
export { mockHourlyActivity } from './HourlyActivity';
export { mockDistanceMetrics } from './DistanceMetrics';

// Export helper functions
export {
  getRideHistoryByStatus,
  getRideHistoryByDateRange,
  getTotalEarningsFromHistory
} from './RideHistory';

export {
  getHourlyActivityByTimeRange,
  getPeakHours,
  getTotalRidesFromActivity,
  getTotalEarningsFromActivity
} from './HourlyActivity';

export {
  getDistanceMetricsByCategory,
  getMetricByName,
  getAllMetricsWithDescriptions,
  formatMetricValue
} from './DistanceMetrics';
