import React, { useMemo, useEffect, useState } from 'react';
import { useBalance } from '../../../../../shared/hooks/useBalance';
import { useDriverStats } from '../../../../../shared/hooks/useDriverStats';

export const useEarningsData = (period: 'today' | 'week' | 'month' | 'year') => {
  const { balance, earnings, transactions } = useBalance();
  const { todayStats, weekStats, monthStats, yearStats, isLoading } = useDriverStats();

  const [quickStats, setQuickStats] = useState({
    totalTrips: 0,
    totalEarnings: '0.00',
    averageRating: 0,
    onlineHours: 0,
  });

  const [periodStats, setPeriodStats] = useState<any[]>([]);

  useEffect(() => {
    // Update quick stats based on period
    switch (period) {
      case 'today':
        if (todayStats) {
          setQuickStats({
            totalTrips: todayStats.ridesCount || 0,
            totalEarnings: todayStats.earnings?.toFixed(2) || '0.00',
            averageRating: 4.5, // Mock data
            onlineHours: todayStats.hoursOnline || 0,
          });
        }
        break;
      case 'week':
        if (weekStats) {
          setQuickStats({
            totalTrips: weekStats.totalRides || 0,
            totalEarnings: weekStats.totalEarnings?.toFixed(2) || '0.00',
            averageRating: 4.5, // Mock data
            onlineHours: weekStats.totalHours || 0,
          });
        }
        break;
      case 'month':
        if (monthStats) {
          setQuickStats({
            totalTrips: monthStats.totalRides || 0,
            totalEarnings: monthStats.totalEarnings?.toFixed(2) || '0.00',
            averageRating: 4.5, // Mock data
            onlineHours: monthStats.totalHours || 0,
          });
        }
        break;
      case 'year':
        if (yearStats && yearStats.length > 0) {
          const totalRides = yearStats.reduce((sum, stat) => sum + (stat.ridesCount || 0), 0);
          const totalEarnings = yearStats.reduce((sum, stat) => sum + (stat.earnings || 0), 0);
          const totalHours = yearStats.reduce((sum, stat) => sum + (stat.hoursOnline || 0), 0);
          
          setQuickStats({
            totalTrips: totalRides,
            totalEarnings: totalEarnings.toFixed(2),
            averageRating: 4.5, // Mock data
            onlineHours: totalHours,
          });
        }
        break;
    }
  }, [period, todayStats, weekStats, monthStats, yearStats]);

  useEffect(() => {
    // Update period stats based on period
    switch (period) {
      case 'today':
        setPeriodStats(todayStats ? [todayStats] : []);
        break;
      case 'week':
        setPeriodStats([]); // Week stats are aggregated
        break;
      case 'month':
        setPeriodStats([]); // Month stats are aggregated
        break;
      case 'year':
        setPeriodStats(yearStats || []);
        break;
    }
  }, [period, todayStats, weekStats, monthStats, yearStats]);

  return {
    quickStats,
    periodStats,
    isLoading,
  };
};
