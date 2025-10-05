export type PeriodType = "today" | "week" | "month" | "year";

export interface EarningsData {
  total: string;
}

export interface QuickStats {
  totalTrips: number;
  totalEarnings: string;
  averageRating: number;
  onlineHours: number;
}

export interface Ride {
  id: string;
  from: string;
  to: string;
  time: string;
  earnings: string;
  rating: number;
}

export interface EarningsState {
  selectedPeriod: PeriodType;
  filterExpanded: boolean;
  isOnline: boolean;
  statusModalVisible: boolean;
  filterExpandAnim: unknown; // Animated.Value
}
