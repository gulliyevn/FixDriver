import APIClient from "./APIClient";

export interface DayStats {
  date: string; // YYYY-MM-DD
  hoursOnline: number;
  ridesCount: number;
  earnings: number;
  isQualified: boolean;
  timestamp: number;
}

export interface PeriodStats {
  totalHours: number;
  totalRides: number;
  totalEarnings: number;
  qualifiedDays: number;
  averageHoursPerDay: number;
  averageRidesPerDay: number;
}

export interface EarningsChartData {
  labels: string[];
  data: number[];
  period: "today" | "week" | "month" | "year";
}

export interface StatsRequest {
  driverId: string;
  period: "today" | "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
}

export interface DriverStats {
  driverId: string;
  currentEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  yearEarnings: number;
  totalRides: number;
  rating: number;
  level: number;
  nextLevelProgress: number;
  isOnline: boolean;
  lastActivity: string;
}

export class DriverStatsService {
  private static instance: DriverStatsService;

  static getInstance(): DriverStatsService {
    if (!DriverStatsService.instance) {
      DriverStatsService.instance = new DriverStatsService();
    }
    return DriverStatsService.instance;
  }

  async getEarningsChartData(
    driverId: string,
    period: "today" | "week" | "month" | "year",
  ): Promise<EarningsChartData> {
    try {
      const response = await APIClient.get<EarningsChartData>(
        `/driver-stats/${driverId}/earnings-chart`,
        { period },
      );
      return response.success && response.data
        ? response.data
        : { labels: [], data: [], period };
    } catch (error) {
      return { labels: [], data: [], period };
    }
  }

  async getDayStats(driverId: string, date: string): Promise<DayStats | null> {
    try {
      const response = await APIClient.get<DayStats>(
        `/driver-stats/${driverId}/day`,
        { date },
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async getPeriodStats(
    driverId: string,
    period: "week" | "month" | "year",
    startDate?: string,
    endDate?: string,
  ): Promise<PeriodStats | null> {
    try {
      const params: any = { period };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await APIClient.get<PeriodStats>(
        `/driver-stats/${driverId}/period`,
        params,
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async getDriverStats(driverId: string): Promise<DriverStats | null> {
    try {
      const response = await APIClient.get<DriverStats>(
        `/driver-stats/${driverId}`,
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async updateDriverStatus(
    driverId: string,
    isOnline: boolean,
  ): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(
        `/driver-stats/${driverId}/status`,
        { isOnline },
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  }

  async startShift(
    driverId: string,
  ): Promise<{ shiftId: string; startTime: string } | null> {
    try {
      const response = await APIClient.post<{
        shiftId: string;
        startTime: string;
      }>(`/driver-stats/${driverId}/shift/start`, {});
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async endShift(
    driverId: string,
    shiftId: string,
  ): Promise<{ earnings: number; hours: number; rides: number } | null> {
    try {
      const response = await APIClient.post<{
        earnings: number;
        hours: number;
        rides: number;
      }>(`/driver-stats/${driverId}/shift/end`, { shiftId });
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async getLeaderboard(
    driverId: string,
    period: "week" | "month" | "year",
  ): Promise<Array<{
    driverId: string;
    name: string;
    earnings: number;
    rides: number;
    position: number;
  }> | null> {
    try {
      const response = await APIClient.get<
        Array<{
          driverId: string;
          name: string;
          earnings: number;
          rides: number;
          position: number;
        }>
      >(`/driver-stats/leaderboard`, { period, driverId });
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async getAchievements(driverId: string): Promise<Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
    progress?: number;
    maxProgress?: number;
  }> | null> {
    try {
      const response = await APIClient.get<
        Array<{
          id: string;
          name: string;
          description: string;
          icon: string;
          unlockedAt?: string;
          progress?: number;
          maxProgress?: number;
        }>
      >(`/driver-stats/${driverId}/achievements`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async updateLocation(
    driverId: string,
    latitude: number,
    longitude: number,
  ): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(
        `/driver-stats/${driverId}/location`,
        { latitude, longitude },
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  }

  async getWeeklyGoal(driverId: string): Promise<{
    targetEarnings: number;
    currentEarnings: number;
    targetRides: number;
    currentRides: number;
    daysLeft: number;
  } | null> {
    try {
      const response = await APIClient.get<{
        targetEarnings: number;
        currentEarnings: number;
        targetRides: number;
        currentRides: number;
        daysLeft: number;
      }>(`/driver-stats/${driverId}/weekly-goal`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async updateWeeklyGoal(
    driverId: string,
    targetEarnings: number,
    targetRides: number,
  ): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(
        `/driver-stats/${driverId}/weekly-goal`,
        { targetEarnings, targetRides },
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  }
}

export default DriverStatsService;
