export interface Driver {
  id: string;
  email: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  license_number: string;
  license_expiry_date: string; // ISO date string
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_number: string;
  vehicle_year?: number;
  status: DriverStatus;
  rating: number;
  created_at: string;
  updated_at: string;
  
  // UI полезные поля
  isAvailable?: boolean;
  avatar?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export enum DriverStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// Данные для регистрации водителя (отправляем на бэк)
export interface DriverRegistrationData {
  // Обязательные поля
  email: string;
  password: string;
  license_number: string;
  license_expiry_date: string; // YYYY-MM-DD format
  vehicle_number: string;
  
  // Опциональные поля
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  vehicle_category?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: number;
}

// Данные для обновления профиля водителя
export interface DriverUpdateData {
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  // Номер прав и номер авто нельзя менять без подтверждения
}

// Данные для смены документов (требует подтверждения админа)
export interface DriverDocumentUpdateData {
  license_number?: string;
  license_expiry_date?: string;
  vehicle_number?: string;
}

// Ответ от сервера при регистрации
export interface DriverRegistrationResponse {
  success: boolean;
  message: string;
  driver?: Omit<Driver, 'password_hash'>; // без пароля
  token?: string; // JWT токен если сразу логинимся
}

// Данные о местоположении водителя
export interface DriverLocation {
  driver_id: string;
  latitude: number;
  longitude: number;
  heading?: number; // направление движения
  speed?: number; // скорость
  accuracy?: number; // точность GPS
  timestamp: string;
}

// Статистика водителя
export interface DriverStats {
  total_trips: number;
  completed_trips: number;
  cancelled_trips: number;
  total_earnings: number;
  average_rating: number;
  total_ratings: number;
  online_hours_today: number;
  online_hours_week: number;
  online_hours_month: number;
}

// Данные для фильтрации водителей
export interface DriverFilters {
  status?: DriverStatus[];
  rating_min?: number;
  rating_max?: number;
  vehicle_year_min?: number;
  vehicle_year_max?: number;
  location_radius?: number; // радиус поиска в км
  is_available?: boolean;
}

// Сортировка водителей
export interface DriverSort {
  field: 'rating' | 'created_at' | 'total_trips' | 'distance';
  order: 'asc' | 'desc';
}

export default Driver;
