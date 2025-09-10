/**
 * 📊 DRIVER STATS SERVICE
 * 
 * Mock driver stats service for development and testing.
 * Easy to replace with gRPC implementation.
 */

export default class DriverStatsService {
  /**
   * Get driver statistics
   */
  async getStats(driverId: string): Promise<any> {
    return {
      totalTrips: 150,
      totalEarnings: 2500.00,
      rating: 4.8,
      completedTrips: 145,
      cancelledTrips: 5,
    };
  }

  /**
   * Get driver earnings for period
   */
  async getEarnings(driverId: string, period: string): Promise<any[]> {
    return [
      { date: '2024-01-01', amount: 125.50 },
      { date: '2024-01-02', amount: 98.75 },
      { date: '2024-01-03', amount: 156.25 },
    ];
  }

  /**
   * Get driver performance metrics
   */
  async getPerformance(driverId: string): Promise<any> {
    return {
      averageRating: 4.8,
      responseTime: 2.5,
      completionRate: 96.7,
    };
  }
}
