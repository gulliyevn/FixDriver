import { useCallback } from 'react';
import { driverStatsOperations } from '../../../domain/usecases/driver/driverStatsOperations';
import type { 
  DayStats, 
  PeriodStats, 
  EarningsChartData
} from '../../../data/datasources/driverStats/DriverStatsTypes';

interface UseDriverStatsActionsProps {
  driverId: string;
  setTodayStats: (stats: DayStats | null) => void;
  setWeekStats: (stats: PeriodStats | null) => void;
  setMonthStats: (stats: PeriodStats | null) => void;
  setYearStats: (stats: DayStats[]) => void;
  setEarningsChartData: (data: EarningsChartData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Hook for driver statistics actions
 */
export const useDriverStatsActions = ({
  driverId,
  setTodayStats,
  setWeekStats,
  setMonthStats,
  setYearStats,
  setEarningsChartData,
  setLoading,
  setError,
}: UseDriverStatsActionsProps) => {
  /**
   * Refresh today's statistics
   */
  const refreshTodayStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const stats = await driverStatsOperations.getTodayStats(driverId);
      setTodayStats(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load today stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [driverId, setTodayStats, setLoading, setError]);

  /**
   * Refresh week statistics
   */
  const refreshWeekStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const stats = await driverStatsOperations.getWeekStats(driverId);
      setWeekStats(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load week stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [driverId, setWeekStats, setLoading, setError]);

  /**
   * Refresh month statistics
   */
  const refreshMonthStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const stats = await driverStatsOperations.getMonthStats(driverId);
      setMonthStats(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load month stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [driverId, setMonthStats, setLoading, setError]);

  /**
   * Refresh year statistics
   */
  const refreshYearStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const stats = await driverStatsOperations.getYearStats(driverId);
      setYearStats(stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load year stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [driverId, setYearStats, setLoading, setError]);


  /**
   * Refresh earnings chart data
   */
  const refreshEarningsChart = useCallback(async (period: 'today' | 'week' | 'month' | 'year'): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverStatsOperations.getEarningsChartData(driverId, period);
      setEarningsChartData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load earnings chart data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [driverId, setEarningsChartData, setLoading, setError]);

  /**
   * Refresh all statistics
   */
  const refreshAllStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        refreshTodayStats(),
        refreshWeekStats(),
        refreshMonthStats(),
        refreshYearStats(),
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load all stats';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [refreshTodayStats, refreshWeekStats, refreshMonthStats, refreshYearStats, setLoading, setError]);

  /**
   * Get specific day statistics
   */
  const getDayStats = useCallback(async (date: string): Promise<DayStats | null> => {
    try {
      return await driverStatsOperations.getDayStats(driverId, date);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get day stats';
      setError(errorMessage);
      return null;
    }
  }, [driverId, setError]);

  /**
   * Get period statistics
   */
  const getPeriodStats = useCallback(async (startDate: string, endDate: string): Promise<PeriodStats | null> => {
    try {
      return await driverStatsOperations.getPeriodStats(driverId, startDate, endDate);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get period stats';
      setError(errorMessage);
      return null;
    }
  }, [driverId, setError]);

  /**
   * Get last N days statistics
   */
  const getLastNDaysStats = useCallback(async (days: number): Promise<DayStats[]> => {
    try {
      return await driverStatsOperations.getLastNDaysStats(driverId, days);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get last N days stats';
      setError(errorMessage);
      return [];
    }
  }, [driverId, setError]);

  /**
   * Get yesterday statistics
   */
  const getYesterdayStats = useCallback(async (): Promise<DayStats | null> => {
    try {
      return await driverStatsOperations.getYesterdayStats(driverId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get yesterday stats';
      setError(errorMessage);
      return null;
    }
  }, [driverId, setError]);

  /**
   * Save day statistics
   */
  const saveDayStats = useCallback(async (stats: Omit<DayStats, 'timestamp'>): Promise<void> => {
    try {
      await driverStatsOperations.saveDayStats(driverId, stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save day stats';
      setError(errorMessage);
      throw err;
    }
  }, [driverId, setError]);

  return {
    refreshTodayStats,
    refreshWeekStats,
    refreshMonthStats,
    refreshYearStats,
    refreshEarningsChart,
    refreshAllStats,
    getDayStats,
    getPeriodStats,
    getLastNDaysStats,
    getYesterdayStats,
    saveDayStats,
  };
};
