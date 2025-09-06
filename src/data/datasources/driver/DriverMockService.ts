import { 
  Driver, 
  DriverRegistrationData, 
  DriverRegistrationResponse,
  DriverUpdateData,
  DriverStats,
  DriverFilters,
  DriverSort,
  DriverStatus 
} from '../../../shared/types/driver';
import { createMockDriver, createMockDriverStats, createMockDrivers } from '../../../shared/mocks';
import { DRIVER_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class DriverMockService {
  /**
   * Mock driver registration
   */
  static async mockDriverRegistration(data: DriverRegistrationData): Promise<DriverRegistrationResponse> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDriver = createMockDriver(data);

        resolve({
          success: true,
          message: 'Registration successful! Your application is under review.',
          driver: mockDriver,
          token: 'mock_jwt_token_' + Date.now(),
        });
      }, DRIVER_CONSTANTS.MOCK_DELAY);
    });
  }

  /**
   * Mock get driver profile
   */
  static mockGetDriverProfile(driverId: string): Driver {
    return createMockDriver({}, driverId);
  }

  /**
   * Mock update driver profile
   */
  static mockUpdateDriverProfile(driverId: string, data: DriverUpdateData): Driver {
    return {
      ...this.mockGetDriverProfile(driverId),
      ...data,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Mock get driver statistics
   */
  static mockGetDriverStats(): DriverStats {
    return createMockDriverStats();
  }

  /**
   * Mock get drivers list
   */
  static mockGetDrivers(): Driver[] {
    return createMockDrivers();
  }

  /**
   * Mock update driver documents
   */
  static mockUpdateDriverDocuments(): { success: boolean; message: string } {
    return {
      success: true,
      message: 'Documents sent for administrator review',
    };
  }
}
