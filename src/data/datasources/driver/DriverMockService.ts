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
import { createMockDriver } from '../../../shared/mocks/driver/driverMock';
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
    return {
      total_trips: 0,
      completed_trips: 0,
      cancelled_trips: 0,
      total_earnings: 0,
      average_rating: 0,
      total_ratings: 0,
      online_hours_today: 0,
      online_hours_week: 0,
      online_hours_month: 0,
    } as DriverStats;
  }

  /**
   * Mock get drivers list
   */
  static mockGetDrivers(): Driver[] {
    return [
      createMockDriver({}, 'driver1'),
      createMockDriver({}, 'driver2'),
      createMockDriver({}, 'driver3'),
    ];
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
