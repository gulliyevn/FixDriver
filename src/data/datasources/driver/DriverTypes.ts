import { APIResponse } from '../api/APITypes';
import { 
  Driver, 
  DriverRegistrationData, 
  DriverRegistrationResponse,
  DriverUpdateData,
  DriverDocumentUpdateData,
  DriverStats,
  DriverLocation,
  DriverFilters,
  DriverSort,
  DriverStatus 
} from '../../../shared/types/driver';

export interface DriverListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  favoritesOnly?: boolean;
  onlineOnly?: boolean;
}

export interface DriverListDto {
  items: Driver[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IDriverService {
  getDriversPaged(params: DriverListParams): Promise<APIResponse<DriverListDto>>;
  registerDriver(data: DriverRegistrationData): Promise<DriverRegistrationResponse>;
  getDriverProfile(driverId: string): Promise<Driver>;
  updateDriverProfile(driverId: string, data: DriverUpdateData): Promise<Driver>;
  updateDriverDocuments(driverId: string, data: DriverDocumentUpdateData): Promise<{ success: boolean; message: string }>;
  getDriverStats(driverId: string): Promise<DriverStats>;
  updateDriverLocation(location: Omit<DriverLocation, 'driver_id'>): Promise<void>;
  getDrivers(filters?: DriverFilters, sort?: DriverSort): Promise<Driver[]>;
  toggleAvailability(isAvailable: boolean): Promise<void>;
  syncWithBackend(): Promise<boolean>;
}
