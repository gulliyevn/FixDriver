import { Address } from '../../../shared/mocks/residenceMock';
import { ADDRESS_CONSTANTS } from '../../../shared/constants';
import { AddressValidationResult, AddressComponents } from './AddressTypes';

export class AddressValidationService {
  /**
   * Validate address string
   */
  static async validateAddress(address: string): Promise<AddressValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!address || typeof address !== 'string') {
      errors.push('Address is required and must be a string');
      return { isValid: false, errors, warnings };
    }

    const trimmedAddress = address.trim();
    
    if (trimmedAddress.length < ADDRESS_CONSTANTS.VALIDATION.MIN_LENGTH) {
      errors.push(`Address must be at least ${ADDRESS_CONSTANTS.VALIDATION.MIN_LENGTH} characters long`);
    }

    if (trimmedAddress.length > 500) {
      warnings.push('Address is very long, consider shortening it');
    }

    // Check for required keywords
    const hasRequiredKeywords = ADDRESS_CONSTANTS.VALIDATION.REQUIRED_KEYWORDS.some(keyword => 
      trimmedAddress.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasRequiredKeywords) {
      warnings.push('Address should contain street, house, or building information');
    }

    // Check for suspicious patterns
    if (trimmedAddress.match(/^\d+$/)) {
      errors.push('Address cannot be only numbers');
    }

    if (trimmedAddress.match(/^[a-zA-Z\s]+$/)) {
      warnings.push('Address should contain more specific location details');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate coordinates
   */
  static async validateCoordinates(lat: number, lng: number): Promise<boolean> {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return false;
    }

    if (isNaN(lat) || isNaN(lng)) {
      return false;
    }

    if (lat < -90 || lat > 90) {
      return false;
    }

    if (lng < -180 || lng > 180) {
      return false;
    }

    return true;
  }

  /**
   * Validate address data object
   */
  static async validateAddressData(addressData: Partial<Address>): Promise<AddressValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!addressData) {
      errors.push('Address data is required');
      return { isValid: false, errors, warnings };
    }

    // Validate required fields
    if (!addressData.address || typeof addressData.address !== 'string') {
      errors.push('Address field is required and must be a string');
    }

    if (!addressData.latitude || typeof addressData.latitude !== 'number') {
      errors.push('Latitude is required and must be a number');
    }

    if (!addressData.longitude || typeof addressData.longitude !== 'number') {
      errors.push('Longitude is required and must be a number');
    }

    // Validate coordinates if provided
    if (addressData.latitude && addressData.longitude) {
      const coordinatesValid = await this.validateCoordinates(addressData.latitude, addressData.longitude);
      if (!coordinatesValid) {
        errors.push('Invalid coordinates provided');
      }
    }

    // Validate address string if provided
    if (addressData.address) {
      const addressValidation = await this.validateAddress(addressData.address);
      if (!addressValidation.isValid) {
        errors.push(...addressValidation.errors);
      }
      warnings.push(...addressValidation.warnings);
    }

    // Validate optional fields
    if (addressData.title && typeof addressData.title !== 'string') {
      errors.push('Title must be a string');
    }

    // Note: description field removed from Address type

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
