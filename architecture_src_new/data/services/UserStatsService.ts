import { UserStats } from '../../presentation/screens/common/ProfileScreen/components/StatisticsCard';

export interface GetUserStatsRequest {
  userId: string;
  timeRange?: 'week' | 'month' | 'year' | 'all';
}

export interface GetUserStatsResponse {
  stats: UserStats;
  success: boolean;
  message?: string;
}

export class UserStatsService {
  private static instance: UserStatsService;

  public static getInstance(): UserStatsService {
    if (!UserStatsService.instance) {
      UserStatsService.instance = new UserStatsService();
    }
    return UserStatsService.instance;
  }

  /**
   * Get user statistics via gRPC
   */
  async getUserStats(request: GetUserStatsRequest): Promise<GetUserStatsResponse> {
    try {
      // TODO: Replace with actual gRPC call
      // const client = new UserStatsClient(grpcEndpoint);
      // const response = await client.getUserStats(request);
      
      // Mock data for now
      const mockStats: UserStats = {
        totalTrips: 127,
        totalEarnings: 2450.75,
        averageRating: 4.8,
        totalHours: 156,
        completedTrips: 125,
        cancelledTrips: 2,
      };

      return {
        stats: mockStats,
        success: true,
        message: 'Stats retrieved successfully',
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        stats: {
          totalTrips: 0,
          totalEarnings: 0,
          averageRating: 0,
          totalHours: 0,
          completedTrips: 0,
          cancelledTrips: 0,
        },
        success: false,
        message: 'Failed to fetch user statistics',
      };
    }
  }

  /**
   * Get user statistics for specific time range
   */
  async getUserStatsByTimeRange(
    userId: string, 
    timeRange: 'week' | 'month' | 'year' | 'all'
  ): Promise<GetUserStatsResponse> {
    return this.getUserStats({ userId, timeRange });
  }

  /**
   * Refresh user statistics (force reload)
   */
  async refreshUserStats(userId: string): Promise<GetUserStatsResponse> {
    return this.getUserStats({ userId, timeRange: 'all' });
  }
}

export default UserStatsService;
