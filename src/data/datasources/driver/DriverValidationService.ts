import { DriverRegistrationData } from '../../../shared/types/driver';
import { DRIVER_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class DriverValidationService {
  /**
   * Validate required fields for driver registration
   */
  static validateRequiredFields(data: DriverRegistrationData): void {
    const requiredFields = DRIVER_CONSTANTS.VALIDATION.REQUIRED_FIELDS;
    for (const field of requiredFields) {
      if (!data[field as keyof DriverRegistrationData]) {
        throw new Error(`Field ${field} is required`);
      }
    }
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): void {
    const emailRegex = DRIVER_CONSTANTS.VALIDATION.EMAIL_REGEX;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address');
    }
  }

  /**
   * Validate license expiry date
   */
  static validateLicenseExpiry(expiryDate: string): void {
    const expiry = new Date(expiryDate);
    const today = new Date();
    if (expiry <= today) {
      throw new Error('Driver license has expired');
    }
  }

  /**
   * Validate vehicle year
   */
  static validateVehicleYear(vehicleYear?: number): void {
    if (vehicleYear) {
      const currentYear = new Date().getFullYear();
      if (vehicleYear < DRIVER_CONSTANTS.VALIDATION.MIN_VEHICLE_YEAR || 
          vehicleYear > currentYear + DRIVER_CONSTANTS.VALIDATION.MAX_VEHICLE_YEAR_OFFSET) {
        throw new Error('Invalid vehicle year');
      }
    }
  }

  /**
   * Validate all driver registration data
   */
  static validateDriverRegistration(data: DriverRegistrationData): void {
    this.validateRequiredFields(data);
    this.validateEmail(data.email);
    this.validateLicenseExpiry(data.license_expiry_date);
    this.validateVehicleYear(data.vehicle_year);
  }
}
