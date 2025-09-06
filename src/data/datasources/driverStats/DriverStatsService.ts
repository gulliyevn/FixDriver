import { DriverStatsMockService } from './DriverStatsMockService';
import { DriverStatsApiService } from './DriverStatsApiService';
import { DriverStatsGrpcService } from './DriverStatsGrpcService';
import { 
  DayStats, 
  PeriodStats, 
  EarningsChartData, 
  IDriverStatsService 
} from './DriverStatsTypes';

// Configuration for switching between mock and production
const CONFIG = {
  USE_MOCK: __DEV__, // Use mock in development
};

class DriverStatsServiceImpl implements IDriverStatsService {
  private driverId: string = 'default_driver';
  private mockService: DriverStatsMockService;
  private apiService: DriverStatsApiService;
  private grpcService: DriverStatsGrpcService;

  constructor() {
    this.mockService = new DriverStatsMockService(this.driverId);
    this.apiService = new DriverStatsApiService(this.driverId);
    this.grpcService = new DriverStatsGrpcService(this.driverId);
  }

  setDriverId(id: string) {
    this.driverId = id;
    this.mockService.setDriverId(id);
    this.apiService.setDriverId(id);
    this.grpcService.setDriverId(id);
  }

  // Get earnings chart data
  async getEarningsChartData(period: 'today' | 'week' | 'month' | 'year'): Promise<EarningsChartData> {
    if (CONFIG.USE_MOCK) {
      return this.mockService.getMockEarningsChartData(period);
    }
    
    try {
      return await this.apiService.getRealEarningsChartData(period);
    } catch (error) {
      // Fallback to mock data on error
      return this.mockService.getMockEarningsChartData(period);
    }
  }

  // Save day statistics
  async saveDayStats(stats: Omit<DayStats, 'timestamp'>): Promise<void> {
    if (CONFIG.USE_MOCK) {
      return this.mockService.saveMockDayStats(stats);
    }
    
    return this.apiService.saveRealDayStats(stats);
  }

  // Get statistics for specific day
  async getDayStats(date: string): Promise<DayStats | null> {
    if (CONFIG.USE_MOCK) {
      return this.mockService.getMockDayStats(date);
    }
    
    return this.apiService.getRealDayStats(date);
  }

  // Get statistics for period
  async getPeriodStats(startDate: string, endDate: string): Promise<PeriodStats> {
    if (CONFIG.USE_MOCK) {
      return this.mockService.getMockPeriodStats(startDate, endDate);
    }
    
    return this.apiService.getRealPeriodStats(startDate, endDate);
  }

  // Get statistics for last N days
  async getLastNDaysStats(days: number): Promise<DayStats[]> {
    if (CONFIG.USE_MOCK) {
      return this.mockService.getMockLastNDaysStats(days);
    }
    
    return this.apiService.getRealLastNDaysStats(days);
  }

  // Get statistics for current month
  async getCurrentMonthStats(): Promise<DayStats[]> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return this.getLastNDaysStats(endOfMonth.getDate());
  }

  // Get statistics for current year
  async getCurrentYearStats(): Promise<DayStats[]> {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysInYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    
    return this.getLastNDaysStats(daysInYear);
  }

  // Get statistics for week (last 7 days)
  async getWeekStats(): Promise<PeriodStats> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return this.getPeriodStats(startDateStr, endDate);
  }

  // Get statistics for month (last 30 days)
  async getMonthStats(): Promise<PeriodStats> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    const startDateStr = startDate.toISOString().split('T')[0];
    
    return this.getPeriodStats(startDateStr, endDate);
  }

  // Sync driver statistics with backend via gRPC
  async syncWithBackend(): Promise<boolean> {
    return this.grpcService.syncWithBackendGrpc();
  }

  // Clear mock data (for testing)
  clearMockData(): void {
    this.mockService.clearMockData();
  }

  // Get all mock data (for debugging)
  getAllMockData(): { [driverId: string]: DayStats[] } {
    return this.mockService.getAllMockData();
  }
}

const DriverStatsService = new DriverStatsServiceImpl();
export default DriverStatsService;
