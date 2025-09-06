import apiClient from '../api/APIClient';
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
  DriverSort 
} from '../../../shared/types/driver';
import { ENV_CONFIG } from '../../../shared/config/environment';
import { DriverValidationService } from './DriverValidationService';
import { DriverMockService } from './DriverMockService';
import { DriverGrpcService } from './DriverGrpcService';
import { DriverListParams, DriverListDto, IDriverService } from './DriverTypes';

class DriverService implements IDriverService {
  private static BASE_URL = ENV_CONFIG.API.BASE_URL;

  // Paginated list of drivers
  static async getDriversPaged(params: DriverListParams): Promise<APIResponse<DriverListDto>> {
    return apiClient.get<DriverListDto>('/drivers', params as Record<string, unknown>);
  }

  // Driver registration
  static async registerDriver(data: DriverRegistrationData): Promise<DriverRegistrationResponse> {
    try {
      // Validate registration data
      DriverValidationService.validateDriverRegistration(data);

      const response = await fetch(`${this.BASE_URL}/drivers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration error');
      }

      return result;
    } catch (error) {
      console.error('Driver registration error:', error);
      
      // In development mode return mock data
      if (__DEV__) {
        return DriverMockService.mockDriverRegistration(data);
      }
      
      throw error;
    }
  }

  // Get driver profile
  static async getDriverProfile(driverId: string): Promise<Driver> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/${driverId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error getting profile');
      }

      return await response.json();
    } catch (error) {
      if (__DEV__) {
        return DriverMockService.mockGetDriverProfile(driverId);
      }
      throw error;
    }
  }

  // Update driver profile
  static async updateDriverProfile(driverId: string, data: DriverUpdateData): Promise<Driver> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/${driverId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error updating profile');
      }

      return await response.json();
    } catch (error) {
      if (__DEV__) {
        return DriverMockService.mockUpdateDriverProfile(driverId, data);
      }
      throw error;
    }
  }

  // Update driver documents
  static async updateDriverDocuments(driverId: string, data: DriverDocumentUpdateData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/${driverId}/documents`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error updating documents');
      }

      return await response.json();
    } catch (error) {
      if (__DEV__) {
        return DriverMockService.mockUpdateDriverDocuments();
      }
      throw error;
    }
  }

  // Get driver statistics
  static async getDriverStats(driverId: string): Promise<DriverStats> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/${driverId}/stats`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error getting statistics');
      }

      return await response.json();
    } catch (error) {
      if (__DEV__) {
        return DriverMockService.mockGetDriverStats();
      }
      throw error;
    }
  }

  // Update driver location
  static async updateDriverLocation(location: Omit<DriverLocation, 'driver_id'>): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        throw new Error('Error updating location');
      }
    } catch (error) {
      if (__DEV__) {
        return;
      }
      throw error;
    }
  }

  // Get list of drivers (for admin or client search)
  static async getDrivers(filters?: DriverFilters, sort?: DriverSort): Promise<Driver[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }

      if (sort) {
        params.append('sort_field', sort.field);
        params.append('sort_order', sort.order);
      }

      const response = await fetch(`${this.BASE_URL}/drivers?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error getting drivers list');
      }

      return await response.json();
    } catch (error) {
      if (__DEV__) {
        return DriverMockService.mockGetDrivers();
      }
      throw error;
    }
  }

  // Change availability status
  static async toggleAvailability(isAvailable: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers/availability`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ is_available: isAvailable }),
      });

      if (!response.ok) {
        throw new Error('Error changing status');
      }
    } catch (error) {
      if (__DEV__) {
        return;
      }
      throw error;
    }
  }

  // Utilities
  private static getToken(): string | null {
    // Here should be logic to get token from AsyncStorage
    return 'mock_token';
  }

  /**
   * Sync driver data with backend via gRPC
   * TODO: Implement real gRPC call
   */
  static async syncWithBackend(): Promise<boolean> {
    return DriverGrpcService.syncWithBackendGrpc();
  }
}

export default DriverService;
