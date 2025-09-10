import driverStatsService from '../../../data/datasources/driverStats/DriverStatsService';
import type { EarningsChartData } from '../../../data/datasources/driverStats/DriverStatsTypes';

/**
 * Domain usecase for earnings chart operations
 * Abstracts data layer access from presentation layer
 */
export const earningsChartOperations = {
  /**
   * Get earnings chart data for specified period
   */
  async getEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData> {
    try {
      return await driverStatsService.getEarningsChartData(period);
    } catch (error) {
      console.error('Error getting earnings chart data:', error);
      throw error;
    }
  },

  /**
   * Set driver ID for operations
   */
  setDriverId(driverId: string): void {
    try {
      driverStatsService.setDriverId(driverId);
    } catch (error) {
      console.error('Error setting driver ID:', error);
      throw error;
    }
  }
};
