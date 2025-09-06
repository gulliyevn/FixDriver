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

// Interface for API responses
export interface EarningsChartData {
  labels: string[];
  data: number[];
  period: 'today' | 'week' | 'month' | 'year';
}

// Interface for API requests
export interface StatsRequest {
  driverId: string;
  period: 'today' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}

export interface IDriverStatsService {
  getEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData>;
  saveDayStats(stats: Omit<DayStats, 'timestamp'>): Promise<void>;
  getDayStats(date: string): Promise<DayStats | null>;
  getPeriodStats(startDate: string, endDate: string): Promise<PeriodStats>;
  getLastNDaysStats(days: number): Promise<DayStats[]>;
  getCurrentMonthStats(): Promise<DayStats[]>;
  getCurrentYearStats(): Promise<DayStats[]>;
  getWeekStats(): Promise<PeriodStats>;
  getMonthStats(): Promise<PeriodStats>;
  syncWithBackend(): Promise<boolean>;
}
