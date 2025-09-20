// Types for DriverStatsService
export interface DayStats {
  date: string; // YYYY-MM-DD
  hoursOnline: number;
  ridesCount: number;
  earnings: number;
  isQualified: boolean;
  timestamp: number;
}

export interface PeriodStats {
  totalHours: number;
  totalRides: number;
  totalEarnings: number;
  qualifiedDays: number;
  averageHoursPerDay: number;
  averageRidesPerDay: number;
}

export interface EarningsChartData {
  labels: string[];
  data: number[];
  period: 'today' | 'week' | 'month' | 'year';
}

export interface PerformanceMetrics {
  rating: number;
  completionRate: number;
  responseTime: number;
  totalTrips: number;
  totalEarnings: number;
  averageEarningsPerTrip: number;
}

export interface DriverRanking {
  position: number;
  totalDrivers: number;
  percentile: number;
  category: 'bronze' | 'silver' | 'gold' | 'platinum';
}

/**
 * Driver Stats Service Interface
 * Defines contract for driver statistics management
 */
export interface IDriverStatsService {
  /**
   * Set current driver ID
   * @param driverId - Driver identifier
   */
  setDriverId(driverId: string): void;

  /**
   * Get current driver ID
   * @returns Current driver ID or null
   */
  getDriverId(): string | null;

  /**
   * Get earnings chart data for specified period
   * @param period - Time period for chart data
   * @returns Chart data with labels and values
   */
  getEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData>;

  /**
   * Save daily statistics
   * @param stats - Daily statistics data
   */
  saveDayStats(stats: Omit<DayStats, 'timestamp'>): Promise<void>;

  /**
   * Get statistics for specific day
   * @param date - Date in YYYY-MM-DD format
   * @returns Day statistics or null if not found
   */
  getDayStats(date: string): Promise<DayStats | null>;

  /**
   * Get statistics for period
   * @param startDate - Start date in YYYY-MM-DD format
   * @param endDate - End date in YYYY-MM-DD format
   * @returns Period statistics
   */
  getPeriodStats(startDate: string, endDate: string): Promise<PeriodStats>;

  /**
   * Get statistics for last N days
   * @param days - Number of days
   * @returns Array of daily statistics
   */
  getLastNDaysStats(days: number): Promise<DayStats[]>;

  /**
   * Get current month statistics
   * @returns Array of daily statistics for current month
   */
  getCurrentMonthStats(): Promise<DayStats[]>;

  /**
   * Get current year statistics
   * @returns Array of daily statistics for current year
   */
  getCurrentYearStats(): Promise<DayStats[]>;

  /**
   * Get week statistics (last 7 days)
   * @returns Week period statistics
   */
  getWeekStats(): Promise<PeriodStats>;

  /**
   * Get month statistics (last 30 days)
   * @returns Month period statistics
   */
  getMonthStats(): Promise<PeriodStats>;

  /**
   * Get today's statistics
   * @returns Today's statistics or null if not found
   */
  getTodayStats(): Promise<DayStats | null>;

  /**
   * Get driver performance metrics
   * @returns Performance metrics
   */
  getPerformanceMetrics(): Promise<PerformanceMetrics>;

  /**
   * Get driver ranking
   * @returns Driver ranking information
   */
  getDriverRanking(): Promise<DriverRanking>;
}
