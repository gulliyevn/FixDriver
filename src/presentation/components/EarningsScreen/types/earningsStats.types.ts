export interface EarningsStats {
  totalRides: number;
  avgRating: number;
  workHours: number;
  completionRate: number;
  avgPerRide: number;
  totalHours: number;
  scheduleCompletion: number;
}

export interface StatsCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
