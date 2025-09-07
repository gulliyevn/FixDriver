/**
 * Driver domain entity used across app layers.
 */
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
  
  // Useful UI fields (optional, derived for presentation)
  isAvailable?: boolean;
  avatar?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  
  // Additional UI fields
  name?: string; // Full name for display
  carModel?: string; // Car model for display
  carNumber?: string; // Car number for display
  isOnline?: boolean; // Online/offline status
  clientsPerDay?: number; // Clients per day
  addresses?: string[]; // Route addresses
  times?: string[]; // Times per address
  tripDays?: string; // Trip days
  package?: 'base' | 'plus' | 'premium'; // Package type
}

/**
 * Driver status lifecycle and availability states.
 */
export enum DriverStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * Driver registration payload (sent to backend).
 */
export interface DriverRegistrationData {
  // Required fields
  email: string;
  password: string;
  license_number: string;
  license_expiry_date: string; // YYYY-MM-DD format
  vehicle_number: string;
  
  // Optional fields
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  vehicle_category?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: number;
}

/**
 * Driver profile update payload.
 */
export interface DriverUpdateData {
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  // License number and vehicle number cannot be changed without approval
}

/**
 * Document update payload (requires admin approval).
 */
export interface DriverDocumentUpdateData {
  license_number?: string;
  license_expiry_date?: string;
  vehicle_number?: string;
}

/**
 * Registration response from backend.
 */
export interface DriverRegistrationResponse {
  success: boolean;
  message: string;
  driver?: Omit<Driver, 'password_hash'>; // without password
  token?: string; // JWT token if auto-login
}

/**
 * Driver location telemetry.
 */
export interface DriverLocation {
  driver_id: string;
  latitude: number;
  longitude: number;
  heading?: number; // movement direction
  speed?: number; // speed
  accuracy?: number; // GPS accuracy
  timestamp: string;
}

/**
 * Driver aggregated statistics.
 */
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

/**
 * Driver filtering options.
 */
export interface DriverFilters {
  status?: DriverStatus[];
  rating_min?: number;
  rating_max?: number;
  vehicle_year_min?: number;
  vehicle_year_max?: number;
  location_radius?: number; // search radius in km
  is_available?: boolean;
}

/**
 * Driver sorting options.
 */
export interface DriverSort {
  field: 'rating' | 'created_at' | 'total_trips' | 'distance';
  order: 'asc' | 'desc';
}

export default Driver;
