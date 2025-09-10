import driverStatsService from '../../../data/datasources/driverStats/DriverStatsService';
import type { 
  DayStats, 
  PeriodStats, 
  EarningsChartData
} from '../../../data/datasources/driverStats/DriverStatsTypes';

/**
 * Domain usecase for driver statistics operations
 * Abstracts data layer access from presentation layer
 */
export const driverStatsOperations = {
  /**
   * Get today's statistics
   */
  async getTodayStats(driverId: string): Promise<DayStats | null> {
    try {
      driverStatsService.setDriverId(driverId);
      return await driverStatsService.getDayStats(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error getting today stats:', error);
      return null;
    }
  },

  /**
   * Get week statistics
   */
  async getWeekStats(driverId: string): Promise<PeriodStats | null> {
    try {
      driverStatsService.setDriverId(driverId);
      return await driverStatsService.getWeekStats();
    } catch (error) {
      console.error('Error getting week stats:', error);
      return null;
    }
  },

  /**
   * Get month statistics
   */
  async getMonthStats(driverId: string): Promise<PeriodStats | null> {
    try {
      driverStatsService.setDriverId(driverId);
      return await driverStatsService.getMonthStats();
    } catch (error) {
      console.error('Error getting month stats:', error);
      return null;
    }
  },

  /**
   * Get year statistics
   */
  async getYearStats(driverId: string): Promise<DayStats[]> {
    try {
      driverStatsService.setDriverId(driverId);
      return await driverStatsService.getCurrentYearStats();
    } catch (error) {
      console.error('Error getting year stats:', error);
      return [];
    }
  },


  /**
   * Get earnings chart data
   */
  async getEarningsChartData(driverId: string, period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData | null> {
    try {
      driverStatsService.setDriverId(driverId);
      return await driverStatsService.getEarningsChartData(period);
    } catch (error) {
      console.error('Error getting earnings chart data:', error);
      return null;
    }
  },

  /**
   * Get specific day statistics
   */
  async getDayStats(driverId: string, date: string): Promise<DayStats | null> {
    try {
      driverStatsService.setDriverId(driverId);
      return await driverStatsService.getDayStats(date);
    } catch (error) {
      console.error('Error getting day stats:', error);
      return null;
    }
  },

  /**
   * Get period statistics
   */
  async getPeriodStats(driverId: string, startDate: string, endDate: string): Promise<PeriodStats | null> {
    try {
      driverStatsService.setDriverId(driverId);
      return await driverStatsService.getPeriodStats(startDate, endDate);
    } catch (error) {
      console.error('Error getting period stats:', error);
      return null;
    }
  },

  /**
   * Get last N days statistics
   */
  async getLastNDaysStats(driverId: string, days: number): Promise<DayStats[]> {
    try {
      driverStatsService.setDriverId(driverId);
      return await driverStatsService.getLastNDaysStats(days);
    } catch (error) {
      console.error('Error getting last N days stats:', error);
      return [];
    }
  },

  /**
   * Get yesterday statistics
   */
  async getYesterdayStats(driverId: string): Promise<DayStats | null> {
    try {
      driverStatsService.setDriverId(driverId);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return await driverStatsService.getDayStats(yesterday.toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error getting yesterday stats:', error);
      return null;
    }
  },

  /**
   * Save day statistics
   */
  async saveDayStats(driverId: string, stats: Omit<DayStats, 'timestamp'>): Promise<void> {
    try {
      driverStatsService.setDriverId(driverId);
      await driverStatsService.saveDayStats(stats);
    } catch (error) {
      console.error('Error saving day stats:', error);
      throw error;
    }
  }
};
