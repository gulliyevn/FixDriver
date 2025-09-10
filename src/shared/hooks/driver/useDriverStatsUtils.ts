import { useCallback } from 'react';

/**
 * Hook for driver statistics utility functions
 */
export const useDriverStatsUtils = () => {
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
    return `${wholeHours}h ${minutes}m`;
  }, []);

  /**
   * Calculate efficiency based on stats
   */
  const calculateEfficiency = useCallback((stats: {
    completedTrips?: number;
    totalTrips?: number;
    earnings?: number;
    hoursWorked?: number;
  }): number => {
    if (!stats.completedTrips || !stats.totalTrips || stats.totalTrips === 0) {
      return 0;
    }
    
    const completionRate = (stats.completedTrips / stats.totalTrips) * 100;
    
    // Add earnings per hour factor if available
    if (stats.earnings && stats.hoursWorked && stats.hoursWorked > 0) {
      const earningsPerHour = stats.earnings / stats.hoursWorked;
      const earningsFactor = Math.min(earningsPerHour / 10, 1) * 20; // Normalize to 0-20
      return Math.min(completionRate + earningsFactor, 100);
    }
    
    return completionRate;
  }, []);

  /**
   * Format percentage
   */
  const formatPercentage = useCallback((value: number): string => {
    return `${value.toFixed(1)}%`;
  }, []);

  /**
   * Format currency with custom precision
   */
  const formatCurrency = useCallback((amount: number, precision: number = 2): string => {
    return `${amount.toFixed(precision)} AFc`;
  }, []);

  /**
   * Format distance
   */
  const formatDistance = useCallback((distance: number): string => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }, []);

  /**
   * Format trip count
   */
  const formatTripCount = useCallback((count: number): string => {
    return count.toString();
  }, []);

  /**
   * Calculate average per trip
   */
  const calculateAveragePerTrip = useCallback((total: number, tripCount: number): number => {
    if (tripCount === 0) return 0;
    return total / tripCount;
  }, []);

  /**
   * Get performance grade
   */
  const getPerformanceGrade = useCallback((efficiency: number): string => {
    if (efficiency >= 90) return 'A+';
    if (efficiency >= 80) return 'A';
    if (efficiency >= 70) return 'B+';
    if (efficiency >= 60) return 'B';
    if (efficiency >= 50) return 'C+';
    if (efficiency >= 40) return 'C';
    return 'D';
  }, []);

  /**
   * Get performance color
   */
  const getPerformanceColor = useCallback((efficiency: number): string => {
    if (efficiency >= 80) return '#4CAF50'; // Green
    if (efficiency >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }, []);

  return {
    formatEarnings,
    formatHours,
    calculateEfficiency,
    formatPercentage,
    formatCurrency,
    formatDistance,
    formatTripCount,
    calculateAveragePerTrip,
    getPerformanceGrade,
    getPerformanceColor,
  };
};
