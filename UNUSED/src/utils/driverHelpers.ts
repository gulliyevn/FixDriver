import { Driver } from '../types/driver';

export interface DriverFilter {
  id: string;
  label: string;
  icon: string;
}

export interface FilteredDriver extends Driver {
  isExpanded?: boolean;
}

export const driverFilters: DriverFilter[] = [
  { id: 'all', label: 'Все', icon: 'list' },
  { id: 'online', label: 'Онлайн', icon: 'radio-button-on' },
  { id: 'offline', label: 'Офлайн', icon: 'radio-button-off' },
  { id: 'available', label: 'Свободны', icon: 'checkmark-circle' },
  { id: 'busy', label: 'Заняты', icon: 'time' },
];

export const filterDrivers = (
  drivers: Driver[],
  selectedFilter: string,
  searchQuery: string
): FilteredDriver[] => {
  let filtered = drivers;

  // Применяем фильтр по статусу
  switch (selectedFilter) {
    case 'online':
      filtered = filtered.filter(driver => driver.isAvailable);
      break;
    case 'offline':
      filtered = filtered.filter(driver => !driver.isAvailable);
      break;
    case 'available':
      filtered = filtered.filter(driver => driver.isAvailable && driver.status === 'active');
      break;
    case 'busy':
      filtered = filtered.filter(driver => !driver.isAvailable || driver.status !== 'active');
      break;
    default:
      // 'all' - показываем всех
      break;
  }

  // Применяем поиск
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(driver => 
      driver.first_name.toLowerCase().includes(query) ||
      driver.last_name.toLowerCase().includes(query) ||
      driver.vehicle_brand?.toLowerCase().includes(query) ||
      driver.vehicle_model?.toLowerCase().includes(query) ||
      driver.vehicle_number?.toLowerCase().includes(query)
    );
  }

  return filtered.map(driver => ({ ...driver, isExpanded: false }));
};

export const getDriverStatusText = (driver: Driver): string => {
  if (!driver.isAvailable) return 'Офлайн';
  if (driver.status === 'active') return 'Свободен';
  return 'Занят';
};

export const getDriverStatusColor = (driver: Driver): string => {
  if (!driver.isAvailable) return '#6B7280';
  if (driver.status === 'active') return '#10B981';
  return '#F59E0B';
};

export const formatDriverName = (driver: Driver): string => {
  return `${driver.first_name} ${driver.last_name}`;
};

export const formatVehicleInfo = (driver: Driver): string => {
  const parts = [];
  if (driver.vehicle_brand) parts.push(driver.vehicle_brand);
  if (driver.vehicle_model) parts.push(driver.vehicle_model);
  if (driver.vehicle_year) parts.push(driver.vehicle_year.toString());
  return parts.join(' ');
};

export const formatLicenseInfo = (driver: Driver): string => {
  return `${driver.license_number} (до ${new Date(driver.license_expiry_date).toLocaleDateString('ru-RU')})`;
};

export const getDriverRatingText = (rating: number): string => {
  if (rating >= 4.8) return 'Отлично';
  if (rating >= 4.5) return 'Хорошо';
  if (rating >= 4.0) return 'Удовлетворительно';
  return 'Плохо';
};

export const getDriverRatingColor = (rating: number): string => {
  if (rating >= 4.8) return '#10B981';
  if (rating >= 4.5) return '#3B82F6';
  if (rating >= 4.0) return '#F59E0B';
  return '#EF4444';
};

export const sortDrivers = (drivers: FilteredDriver[], sortBy: string): FilteredDriver[] => {
  const sorted = [...drivers];
  
  switch (sortBy) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => formatDriverName(a).localeCompare(formatDriverName(b)));
    case 'vehicle':
      return sorted.sort((a, b) => formatVehicleInfo(a).localeCompare(formatVehicleInfo(b)));
    case 'status':
      return sorted.sort((a, b) => {
        const aStatus = getDriverStatusText(a);
        const bStatus = getDriverStatusText(b);
        return aStatus.localeCompare(bStatus);
      });
    default:
      return sorted;
  }
}; 