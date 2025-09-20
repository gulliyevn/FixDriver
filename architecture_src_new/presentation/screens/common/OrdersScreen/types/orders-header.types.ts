export type UserRole = 'client' | 'driver';

export interface OrdersHeaderProps {
  role: UserRole;
  isDark: boolean;
  onBackPress?: () => void;
  onFilterPress?: () => void;
  onNotificationsPress?: () => void;
  showBackButton?: boolean;
  showFilterButton?: boolean;
  showNotificationsButton?: boolean;
  // Фильтры
  filterExpandAnim?: any; // Animated.Value
  onToggleFilter?: () => void;
  onSelectFilter?: (key: string) => void;
  activeFilters?: Record<string, boolean>;
}

export interface OrdersHeaderState {
  title: string;
  subtitle?: string;
}

export interface OrdersHeaderActions {
  getTitleByRole: (role: UserRole) => string;
  getSubtitleByRole: (role: UserRole) => string | undefined;
}
