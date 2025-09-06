import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { driverStatsService } from '../../data/datasources/grpc/DriverStatsService';
import type { 
  DayStats, 
  PeriodStats, 
  EarningsChartData, 
  PerformanceMetrics, 
  DriverRanking 
} from '../../data/datasources/grpc/DriverStatsService';

// Types
export interface DriverStatsState {
  todayStats: DayStats | null;
  weekStats: PeriodStats | null;
  monthStats: PeriodStats | null;
  yearStats: DayStats[];
  performanceMetrics: PerformanceMetrics | null;
  driverRanking: DriverRanking | null;
  earningsChartData: EarningsChartData | null;
}

export interface DriverStatsActions {
  // Data fetching
  refreshTodayStats: () => Promise<void>;
  refreshWeekStats: () => Promise<void>;
  refreshMonthStats: () => Promise<void>;
  refreshYearStats: () => Promise<void>;
  refreshPerformanceMetrics: () => Promise<void>;
  refreshDriverRanking: () => Promise<void>;
  refreshEarningsChart: (period: 'today' | 'week' | 'month' | 'year') => Promise<void>;
  refreshAllStats: () => Promise<void>;
  
  // Specific queries
  getDayStats: (date: string) => Promise<DayStats | null>;
  getPeriodStats: (startDate: string, endDate: string) => Promise<PeriodStats | null>;
  getLastNDaysStats: (days: number) => Promise<DayStats[]>;
  getYesterdayStats: () => Promise<DayStats | null>;
  
  // Data saving
  saveDayStats: (stats: Omit<DayStats, 'timestamp'>) => Promise<void>;
  
  // Utilities
  clearError: () => void;
  formatEarnings: (amount: number) => string;
  formatHours: (hours: number) => string;
  calculateEfficiency: () => number;
}

export interface UseDriverStatsReturn extends DriverStatsState, DriverStatsActions {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Hook for managing driver statistics
 * Provides reactive state management and comprehensive statistics functionality
 */
export const useDriverStats = (): UseDriverStatsReturn => {
  const { user } = useAuth();
  
  // State
  const [todayStats, setTodayStats] = useState<DayStats | null>(null);
  const [weekStats, setWeekStats] = useState<PeriodStats | null>(null);
  const [monthStats, setMonthStats] = useState<PeriodStats | null>(null);
  const [yearStats, setYearStats] = useState<DayStats[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [driverRanking, setDriverRanking] = useState<DriverRanking | null>(null);
  const [earningsChartData, setEarningsChartData] = useState<EarningsChartData | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /**
   * Set driver ID in service
   */
  useEffect(() => {
    if (user?.id) {
      driverStatsService.setDriverId(user.id);
    }
  }, [user?.id]);

  /**
   * Refresh today's statistics
   */
  const refreshTodayStats = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await driverStatsService.getTodayStats();
      setTodayStats(stats);
      setLastUpdated(new Date());
      
      console.log('Today stats refreshed:', stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load today stats';
      setError(errorMessage);
      console.error('Error refreshing today stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh week statistics
   */
  const refreshWeekStats = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await driverStatsService.getWeekStats();
      setWeekStats(stats);
      setLastUpdated(new Date());
      
      console.log('Week stats refreshed:', stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load week stats';
      setError(errorMessage);
      console.error('Error refreshing week stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh month statistics
   */
  const refreshMonthStats = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await driverStatsService.getMonthStats();
      setMonthStats(stats);
      setLastUpdated(new Date());
      
      console.log('Month stats refreshed:', stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load month stats';
      setError(errorMessage);
      console.error('Error refreshing month stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh year statistics
   */
  const refreshYearStats = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await driverStatsService.getCurrentYearStats();
      setYearStats(stats);
      setLastUpdated(new Date());
      
      console.log('Year stats refreshed:', stats.length, 'days');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load year stats';
      setError(errorMessage);
      console.error('Error refreshing year stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh performance metrics
   */
  const refreshPerformanceMetrics = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const metrics = await driverStatsService.getPerformanceMetrics();
      setPerformanceMetrics(metrics);
      setLastUpdated(new Date());
      
      console.log('Performance metrics refreshed:', metrics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load performance metrics';
      setError(errorMessage);
      console.error('Error refreshing performance metrics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh driver ranking
   */
  const refreshDriverRanking = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const ranking = await driverStatsService.getDriverRanking();
      setDriverRanking(ranking);
      setLastUpdated(new Date());
      
      console.log('Driver ranking refreshed:', ranking);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load driver ranking';
      setError(errorMessage);
      console.error('Error refreshing driver ranking:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh earnings chart data
   */
  const refreshEarningsChart = useCallback(async (period: 'today' | 'week' | 'month' | 'year'): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const chartData = await driverStatsService.getEarningsChartData(period);
      setEarningsChartData(chartData);
      setLastUpdated(new Date());
      
      console.log('Earnings chart refreshed for period:', period);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load earnings chart';
      setError(errorMessage);
      console.error('Error refreshing earnings chart:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh all statistics
   */
  const refreshAllStats = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await Promise.all([
        refreshTodayStats(),
        refreshWeekStats(),
        refreshMonthStats(),
        refreshYearStats(),
        refreshPerformanceMetrics(),
        refreshDriverRanking(),
        refreshEarningsChart('week'), // Default to week view
      ]);
      
      console.log('All driver stats refreshed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh all stats';
      setError(errorMessage);
      console.error('Error refreshing all stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshTodayStats, refreshWeekStats, refreshMonthStats, refreshYearStats, refreshPerformanceMetrics, refreshDriverRanking, refreshEarningsChart]);

  /**
   * Get statistics for specific day
   */
  const getDayStats = useCallback(async (date: string): Promise<DayStats | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await driverStatsService.getDayStats(date);
      
      console.log('Day stats retrieved for:', date);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get day stats';
      setError(errorMessage);
      console.error('Error getting day stats:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get statistics for period
   */
  const getPeriodStats = useCallback(async (startDate: string, endDate: string): Promise<PeriodStats | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await driverStatsService.getPeriodStats(startDate, endDate);
      
      console.log('Period stats retrieved:', startDate, 'to', endDate);
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get period stats';
      setError(errorMessage);
      console.error('Error getting period stats:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get statistics for last N days
   */
  const getLastNDaysStats = useCallback(async (days: number): Promise<DayStats[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stats = await driverStatsService.getLastNDaysStats(days);
      
      console.log('Last N days stats retrieved:', days, 'days');
      return stats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get last N days stats';
      setError(errorMessage);
      console.error('Error getting last N days stats:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get yesterday's statistics
   */
  const getYesterdayStats = useCallback(async (): Promise<DayStats | null> => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return getDayStats(yesterdayStr);
  }, [getDayStats]);

  /**
   * Save daily statistics
   */
  const saveDayStats = useCallback(async (stats: Omit<DayStats, 'timestamp'>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await driverStatsService.saveDayStats(stats);
      setLastUpdated(new Date());
      
      console.log('Day stats saved:', stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save day stats';
      setError(errorMessage);
      console.error('Error saving day stats:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Format earnings amount
   */
  const formatEarnings = useCallback((amount: number): string => {
    return `${amount.toFixed(2)} AFc`;
  }, []);

  /**
   * Format hours
   */
  const formatHours = useCallback((hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  }, []);

  /**
   * Calculate efficiency (earnings per hour)
   */
  const calculateEfficiency = useCallback((): number => {
    if (!todayStats || todayStats.hoursOnline === 0) return 0;
    return todayStats.earnings / todayStats.hoursOnline;
  }, [todayStats]);

  // Load initial data when user changes
  useEffect(() => {
    if (user?.id) {
      refreshAllStats();
    }
  }, [user?.id, refreshAllStats]);

  return {
    // State
    todayStats,
    weekStats,
    monthStats,
    yearStats,
    performanceMetrics,
    driverRanking,
    earningsChartData,
    isLoading,
    error,
    lastUpdated,
    
    // Actions
    refreshTodayStats,
    refreshWeekStats,
    refreshMonthStats,
    refreshYearStats,
    refreshPerformanceMetrics,
    refreshDriverRanking,
    refreshEarningsChart,
    refreshAllStats,
    getDayStats,
    getPeriodStats,
    getLastNDaysStats,
    getYesterdayStats,
    saveDayStats,
    clearError,
    formatEarnings,
    formatHours,
    calculateEfficiency,
  };
};
