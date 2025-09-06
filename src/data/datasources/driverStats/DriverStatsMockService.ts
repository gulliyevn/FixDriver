import { DayStats, PeriodStats, EarningsChartData } from './DriverStatsTypes';
import { createMockEarningsChartData } from '../../../shared/mocks';

export class DriverStatsMockService {
  private mockDatabase: { [driverId: string]: DayStats[] } = {};

  constructor(private driverId: string = 'default_driver') {}

  setDriverId(id: string) {
    this.driverId = id;
  }

  /**
   * Get mock earnings chart data
   */
  async getMockEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return createMockEarningsChartData(period);
  }

  /**
   * Save mock day statistics
   */
  async saveMockDayStats(stats: Omit<DayStats, 'timestamp'>): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dayStats: DayStats = {
        ...stats,
        timestamp: Date.now(),
      };

      if (!this.mockDatabase[this.driverId]) {
        this.mockDatabase[this.driverId] = [];
      }

      // Remove old record for this day if exists
      this.mockDatabase[this.driverId] = this.mockDatabase[this.driverId].filter(
        stat => stat.date !== stats.date
      );

      // Add new record
      this.mockDatabase[this.driverId].push(dayStats);

      console.log(`[DriverStatsService] Statistics saved for ${stats.date}:`, dayStats);
    } catch (error) {
      console.error('[DriverStatsService] Error saving statistics:', error);
      throw error;
    }
  }

  /**
   * Get mock day statistics
   */
  async getMockDayStats(date: string): Promise<DayStats | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const driverStats = this.mockDatabase[this.driverId] || [];
      const dayStats = driverStats.find(stat => stat.date === date);
      
      return dayStats || null;
    } catch (error) {
      console.error('[DriverStatsService] Error getting day statistics:', error);
      return null;
    }
  }

  /**
   * Get mock period statistics
   */
  async getMockPeriodStats(startDate: string, endDate: string): Promise<PeriodStats> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const driverStats = this.mockDatabase[this.driverId] || [];
      const periodStats = driverStats.filter(
        stat => stat.date >= startDate && stat.date <= endDate
      );

      if (periodStats.length === 0) {
        return {
          totalHours: 0,
          totalRides: 0,
          totalEarnings: 0,
          qualifiedDays: 0,
          averageHoursPerDay: 0,
          averageRidesPerDay: 0,
        };
      }

      const totalHours = periodStats.reduce((sum, stat) => sum + stat.hoursOnline, 0);
      const totalRides = periodStats.reduce((sum, stat) => sum + stat.ridesCount, 0);
      const totalEarnings = periodStats.reduce((sum, stat) => sum + stat.earnings, 0);
      const qualifiedDays = periodStats.filter(stat => stat.isQualified).length;

      return {
        totalHours,
        totalRides,
        totalEarnings,
        qualifiedDays,
        averageHoursPerDay: totalHours / periodStats.length,
        averageRidesPerDay: totalRides / periodStats.length,
      };
    } catch (error) {
      console.error('[DriverStatsService] Error getting period statistics:', error);
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
   * Get mock last N days statistics
   */
  async getMockLastNDaysStats(days: number): Promise<DayStats[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const driverStats = this.mockDatabase[this.driverId] || [];
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return driverStats.filter(stat => {
        const statDate = new Date(stat.date);
        return statDate >= startDate && statDate <= endDate;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
      console.error('[DriverStatsService] Error getting last days statistics:', error);
      return [];
    }
  }

  /**
   * Clear mock data (for testing)
   */
  clearMockData(): void {
    this.mockDatabase = {};
  }

  /**
   * Get all mock data (for debugging)
   */
  getAllMockData(): { [driverId: string]: DayStats[] } {
    return { ...this.mockDatabase };
  }
}
