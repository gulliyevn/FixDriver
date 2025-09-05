import { 
  IDriverStatsService, 
  DayStats, 
  PeriodStats, 
  EarningsChartData, 
  PerformanceMetrics, 
  DriverRanking 
} from './types/IDriverStatsService';
import MockServices from '../../../shared/mocks/MockServices';

/**
 * Driver Stats Service
 * Manages driver statistics with gRPC integration
 */
export class DriverStatsService implements IDriverStatsService {
  private driverId: string | null = null;

  /**
   * Set current driver ID
   */
  setDriverId(driverId: string): void {
    this.driverId = driverId;
  }

  /**
   * Get current driver ID
   */
  getDriverId(): string | null {
    return this.driverId;
  }

  /**
   * Get earnings chart data for specified period
   */
  async getEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData> {
    try {
      if (!this.driverId) {
        throw new Error('Driver ID not set');
      }

      // TODO: Replace with real gRPC call
      const chartData = await MockServices.driverStats.getEarningsChartData(this.driverId, period);
      
      console.log(`Earnings chart data retrieved for period: ${period}`);
      return chartData;
    } catch (error) {
      console.error('Error getting earnings chart data:', error);
      throw error;
    }
  }

  /**
   * Save daily statistics
   */
  async saveDayStats(stats: Omit<DayStats, 'timestamp'>): Promise<void> {
    try {
      if (!this.driverId) {
        throw new Error('Driver ID not set');
      }

      // TODO: Replace with real gRPC call
      await MockServices.driverStats.saveDayStats(this.driverId, stats);
      
      console.log(`Day stats saved for ${stats.date}:`, stats);
    } catch (error) {
      console.error('Error saving day stats:', error);
      throw error;
    }
  }

  /**
   * Get statistics for specific day
   */
  async getDayStats(date: string): Promise<DayStats | null> {
    try {
      if (!this.driverId) {
        throw new Error('Driver ID not set');
      }

      // TODO: Replace with real gRPC call
      const dayStats = await MockServices.driverStats.getDayStats(this.driverId, date);
      
      return dayStats;
    } catch (error) {
      console.error('Error getting day stats:', error);
      return null;
    }
  }

  /**
   * Get statistics for period
   */
  async getPeriodStats(startDate: string, endDate: string): Promise<PeriodStats> {
    try {
      if (!this.driverId) {
        throw new Error('Driver ID not set');
      }

      // TODO: Replace with real gRPC call
      const periodStats = await MockServices.driverStats.getPeriodStats(this.driverId, startDate, endDate);
      
      return periodStats;
    } catch (error) {
      console.error('Error getting period stats:', error);
      return {
        totalHours: 0,
        totalRides: 0,
        totalEarnings: 0,
        qualifiedDays: 0,
        averageHoursPerDay: 0,
        averageRidesPerDay: 0,
      };
    }
  }

  /**
   * Get statistics for last N days
   */
  async getLastNDaysStats(days: number): Promise<DayStats[]> {
    try {
      if (!this.driverId) {
        throw new Error('Driver ID not set');
      }

      // TODO: Replace with real gRPC call
      const stats = await MockServices.driverStats.getLastNDaysStats(this.driverId, days);
      
      return stats;
    } catch (error) {
      console.error('Error getting last N days stats:', error);
      return [];
    }
  }

  /**
   * Get current month statistics
   */
  async getCurrentMonthStats(): Promise<DayStats[]> {
    const today = new Date();
    const daysInMonth = today.getDate();
    
    return this.getLastNDaysStats(daysInMonth);
  }

  /**
   * Get current year statistics
   */
  async getCurrentYearStats(): Promise<DayStats[]> {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysInYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    return this.getLastNDaysStats(daysInYear);
  }

  /**
   * Get week statistics (last 7 days)
   */
  async getWeekStats(): Promise<PeriodStats> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return this.getPeriodStats(startDateStr, endDate);
  }

  /**
   * Get month statistics (last 30 days)
   */
  async getMonthStats(): Promise<PeriodStats> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return this.getPeriodStats(startDateStr, endDate);
  }

  /**
   * Get today's statistics
   */
  async getTodayStats(): Promise<DayStats | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.getDayStats(today);
  }

  /**
   * Get driver performance metrics
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      if (!this.driverId) {
        throw new Error('Driver ID not set');
      }

      // TODO: Replace with real gRPC call
      const metrics = await MockServices.driverStats.getPerformanceMetrics(this.driverId);
      
      return metrics;
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return {
        rating: 0,
        completionRate: 0,
        responseTime: 0,
        totalTrips: 0,
        totalEarnings: 0,
        averageEarningsPerTrip: 0,
      };
    }
  }

  /**
   * Get driver ranking
   */
  async getDriverRanking(): Promise<DriverRanking> {
    try {
      if (!this.driverId) {
        throw new Error('Driver ID not set');
      }

      // TODO: Replace with real gRPC call
      const ranking = await MockServices.driverStats.getDriverRanking(this.driverId);
      
      return ranking;
    } catch (error) {
      console.error('Error getting driver ranking:', error);
      return {
        position: 0,
        totalDrivers: 0,
        percentile: 0,
        category: 'bronze',
      };
    }
  }
}

// Export singleton instance
export const driverStatsService = new DriverStatsService();
export default driverStatsService;

// Re-export types for convenience
export type { 
  DayStats, 
  PeriodStats, 
  EarningsChartData, 
  PerformanceMetrics, 
  DriverRanking 
} from './types/IDriverStatsService';
