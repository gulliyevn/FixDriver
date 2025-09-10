import { useState } from 'react';
import type { 
  DayStats, 
  PeriodStats, 
  EarningsChartData
} from '../../../data/datasources/driverStats/DriverStatsTypes';

/**
 * Hook for managing driver statistics state
 */
export const useDriverStatsState = () => {
  const [todayStats, setTodayStats] = useState<DayStats | null>(null);
  const [weekStats, setWeekStats] = useState<PeriodStats | null>(null);
  const [monthStats, setMonthStats] = useState<PeriodStats | null>(null);
  const [yearStats, setYearStats] = useState<DayStats[]>([]);
  const [earningsChartData, setEarningsChartData] = useState<EarningsChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Set loading state
   */
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  /**
   * Set error state
   */
  const setErrorState = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  return {
    // State
    todayStats,
    weekStats,
    monthStats,
    yearStats,
    earningsChartData,
    isLoading,
    error,
    
    // Setters
    setTodayStats,
    setWeekStats,
    setMonthStats,
    setYearStats,
    setEarningsChartData,
    setLoading,
    setErrorState,
    
    // Actions
    clearError,
  };
};
