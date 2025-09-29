import { useState, useEffect } from 'react';
import { UserStats } from '../components/StatisticsCard';
import { UserStatsService, GetUserStatsRequest } from '../../../../../data/services/UserStatsService';

interface UseUserStatsReturn {
  stats: UserStats;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
  getStatsByTimeRange: (timeRange: 'week' | 'month' | 'year' | 'all') => Promise<void>;
}

export const useUserStats = (userId: string): UseUserStatsReturn => {
  const [stats, setStats] = useState<UserStats>({
    totalTrips: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalHours: 0,
    completedTrips: 0,
    cancelledTrips: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statsService = UserStatsService.getInstance();

  const fetchStats = async (request: GetUserStatsRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await statsService.getUserStats(request);
      
      if (response.success) {
        setStats(response.stats);
      } else {
        setError(response.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error in useUserStats:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    await fetchStats({ userId });
  };

  const getStatsByTimeRange = async (timeRange: 'week' | 'month' | 'year' | 'all') => {
    await fetchStats({ userId, timeRange });
  };

  useEffect(() => {
    if (userId) {
      fetchStats({ userId });
    }
  }, [userId]);

  return {
    stats,
    loading,
    error,
    refreshStats,
    getStatsByTimeRange,
  };
};
