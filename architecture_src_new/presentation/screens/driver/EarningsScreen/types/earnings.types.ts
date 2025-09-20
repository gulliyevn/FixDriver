export type PeriodType = 'today' | 'week' | 'month' | 'year';

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

export interface TopDriver {
  id: string;
  name: string;
  level: string;
  rides: number;
  earnings: number;
  position: number;
  avatar: string | null;
}

export interface EarningsState {
  selectedPeriod: PeriodType;
  filterExpanded: boolean;
  isOnline: boolean;
  statusModalVisible: boolean;
  filterExpandAnim: any; // Animated.Value
}
