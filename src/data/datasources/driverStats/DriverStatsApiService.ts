import { DayStats, PeriodStats, EarningsChartData } from './DriverStatsTypes';
import { DRIVER_STATS_CONSTANTS } from '../../../shared/constants';

export class DriverStatsApiService {
  private driverId: string = 'default_driver';

  constructor(driverId?: string) {
    if (driverId) {
      this.driverId = driverId;
    }
  }

  setDriverId(id: string) {
    this.driverId = id;
  }

  /**
   * Get authorization token (stub)
   */
  private async getAuthToken(): Promise<string> {
    // In real application this will get token from AuthService
    return 'mock_token';
  }

  /**
   * Get real earnings chart data
   */
  async getRealEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData> {
    try {
      const response = await fetch(`${DRIVER_STATS_CONSTANTS.API.BASE_URL}${DRIVER_STATS_CONSTANTS.ENDPOINTS.EARNINGS_CHART}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          driverId: this.driverId,
          period,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        labels: data.labels,
        data: data.data,
        period
      };
    } catch (error) {
      console.error('[DriverStatsService] Error getting chart data:', error);
      throw error;
    }
  }

  /**
   * Save real day statistics
   */
  async saveRealDayStats(stats: Omit<DayStats, 'timestamp'>): Promise<void> {
    try {
      const response = await fetch(`${DRIVER_STATS_CONSTANTS.API.BASE_URL}${DRIVER_STATS_CONSTANTS.ENDPOINTS.SAVE_DAY_STATS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          driverId: this.driverId,
          ...stats,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      console.log(`[DriverStatsService] Statistics saved to DB for ${stats.date}`);
    } catch (error) {
      console.error('[DriverStatsService] Error saving statistics to DB:', error);
      throw error;
    }
  }

  /**
   * Get real day statistics
   */
  async getRealDayStats(date: string): Promise<DayStats | null> {
    try {
      const response = await fetch(`${DRIVER_STATS_CONSTANTS.API.BASE_URL}${DRIVER_STATS_CONSTANTS.ENDPOINTS.GET_DAY_STATS}?date=${date}&driverId=${this.driverId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[DriverStatsService] Error getting day statistics from DB:', error);
      return null;
    }
  }

  /**
   * Get real period statistics
   */
  async getRealPeriodStats(startDate: string, endDate: string): Promise<PeriodStats> {
    try {
      const response = await fetch(`${DRIVER_STATS_CONSTANTS.API.BASE_URL}${DRIVER_STATS_CONSTANTS.ENDPOINTS.GET_PERIOD_STATS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          driverId: this.driverId,
          startDate,
          endDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[DriverStatsService] Error getting period statistics from DB:', error);
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
   * Get real last N days statistics
   */
  async getRealLastNDaysStats(days: number): Promise<DayStats[]> {
    try {
      const response = await fetch(`${DRIVER_STATS_CONSTANTS.API.BASE_URL}${DRIVER_STATS_CONSTANTS.ENDPOINTS.GET_LAST_N_DAYS}?days=${days}&driverId=${this.driverId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('[DriverStatsService] Error getting last days statistics from DB:', error);
      return [];
    }
  }
}
