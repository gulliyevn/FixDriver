import { Address } from '../../../shared/mocks/shared/residenceMock';
import { ADDRESS_CONSTANTS } from '../../../shared/constants/addressConstants';
import { AddressValidationResult, AddressComponents } from './AddressTypes';
import { t } from '../../../shared/i18n';

export class AddressValidationService {
  /**
   * Validate address string
   */
  static async validateAddress(address: string): Promise<AddressValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!address || typeof address !== 'string') {
      errors.push(t('address.validation.required'));
      return { isValid: false, errors, warnings };
    }

    const trimmedAddress = address.trim();
    
    if (trimmedAddress.length < ADDRESS_CONSTANTS.VALIDATION.MIN_LENGTH) {
      errors.push(t('address.validation.minLength', { min: ADDRESS_CONSTANTS.VALIDATION.MIN_LENGTH }));
    }

    if (trimmedAddress.length > 500) {
      warnings.push(t('address.validation.tooLong'));
    }

    // Check for required keywords
    const hasRequiredKeywords = ADDRESS_CONSTANTS.VALIDATION.REQUIRED_KEYWORDS.some(keyword => 
      trimmedAddress.toLowerCase().includes(keyword.toLowerCase())
    );

    if (!hasRequiredKeywords) {
      warnings.push(t('address.validation.missingKeywords'));
    }

    // Check for suspicious patterns
    if (trimmedAddress.match(/^\d+$/)) {
      errors.push(t('address.validation.onlyNumbers'));
    }

    if (trimmedAddress.match(/^[a-zA-Z\s]+$/)) {
      warnings.push(t('address.validation.tooGeneric'));
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
      errors.push(t('address.validation.dataRequired'));
      return { isValid: false, errors, warnings };
    }

    // Validate required fields
    if (!addressData.address || typeof addressData.address !== 'string') {
      errors.push(t('address.validation.addressRequired'));
    }

    if (!addressData.latitude || typeof addressData.latitude !== 'number') {
      errors.push(t('address.validation.latitudeRequired'));
    }

    if (!addressData.longitude || typeof addressData.longitude !== 'number') {
      errors.push(t('address.validation.longitudeRequired'));
    }

    // Validate coordinates if provided
    if (addressData.latitude && addressData.longitude) {
      const coordinatesValid = await this.validateCoordinates(addressData.latitude, addressData.longitude);
      if (!coordinatesValid) {
        errors.push(t('address.validation.invalidCoordinates'));
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
      errors.push(t('address.validation.titleMustBeString'));
    }

    // Note: description field removed from Address type

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
