import { useEffect, useState } from 'react';
import { useAuth } from '../../presentation/context/auth/AuthContext';
import { useDriverStatsState } from './driver/useDriverStatsState';
import { useDriverStatsActions } from './driver/useDriverStatsActions';
import { useDriverStatsUtils } from './driver/useDriverStatsUtils';
import type { 
  DayStats, 
  PeriodStats, 
  EarningsChartData
} from '../../data/datasources/driverStats/DriverStatsTypes';

// Types
export interface DriverStatsState {
  todayStats: DayStats | null;
  weekStats: PeriodStats | null;
  monthStats: PeriodStats | null;
  yearStats: DayStats[];
  earningsChartData: EarningsChartData | null;
}

export interface DriverStatsActions {
  // Data fetching
  refreshTodayStats: () => Promise<void>;
  refreshWeekStats: () => Promise<void>;
  refreshMonthStats: () => Promise<void>;
  refreshYearStats: () => Promise<void>;
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
  
  // State management
  const {
    todayStats,
    weekStats,
    monthStats,
    yearStats,
    earningsChartData,
    isLoading,
    error,
    setTodayStats,
    setWeekStats,
    setMonthStats,
    setYearStats,
    setEarningsChartData,
    setLoading,
    setErrorState,
    clearError,
  } = useDriverStatsState();

  // Statistics actions
  const {
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
  } = useDriverStatsActions({
    driverId: user?.id || '',
    setTodayStats,
    setWeekStats,
    setMonthStats,
    setYearStats,
    setEarningsChartData,
    setLoading,
    setError: setErrorState,
  });

  // Utility functions
  const {
    formatEarnings,
    formatHours,
    calculateEfficiency,
  } = useDriverStatsUtils();

  // Additional state for last updated
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Wrapper functions to maintain API compatibility
  const calculateEfficiencyWrapper = (): number => {
    if (!todayStats) return 0;
    return calculateEfficiency({
      completedTrips: todayStats.ridesCount,
      totalTrips: todayStats.ridesCount,
      earnings: todayStats.earnings,
      hoursWorked: todayStats.hoursOnline,
    });
  };

  // Load initial data when user changes
  useEffect(() => {
    if (user?.id) {
      refreshAllStats();
      setLastUpdated(new Date());
    }
  }, [user?.id, refreshAllStats]);

  return {
    // Data
    todayStats,
    weekStats,
    monthStats,
    yearStats,
    earningsChartData,
    
    // State
    isLoading,
    error,
    lastUpdated,
    
    // Actions
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
    
    // Utilities
    clearError,
    formatEarnings,
    formatHours,
    calculateEfficiency: calculateEfficiencyWrapper,
  };
};