import APIClient from '../api/APIClient';
import { Address } from '../../../shared/mocks/shared/residenceMock';
import { ADDRESS_CONSTANTS } from '../../../shared/constants/addressConstants';
import { IAddressService, AddressValidationResult, GeocodingResponse } from './AddressTypes';
import { AddressValidationService } from './AddressValidationService';
import { AddressUtils } from './AddressUtils';
import { t } from '../../../shared/i18n';

export class AddressService implements IAddressService {
  private static instance: AddressService;
  private apiClient: typeof APIClient;

  private constructor() {
    this.apiClient = APIClient;
  }

  public static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService();
    }
    return AddressService.instance;
  }

  /**
   * Get all addresses
   */
  async getAddresses(): Promise<Address[]> {
    try {
      const response = await this.apiClient.get(ADDRESS_CONSTANTS.ENDPOINTS.ADDRESSES);
      return (response.data as Address[]) || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
  }

  /**
   * Create new address
   */
  async createAddress(addressData: Partial<Address>): Promise<Address> {
    try {
      // Validate address data
      const validation = await AddressValidationService.validateAddressData(addressData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const response = await this.apiClient.post(ADDRESS_CONSTANTS.ENDPOINTS.ADDRESSES, addressData);
      return response.data as Address;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  /**
   * Update existing address
   */
  async updateAddress(addressId: string, addressData: Partial<Address>): Promise<Address> {
    try {
      // Validate address data
      const validation = await AddressValidationService.validateAddressData(addressData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const response = await this.apiClient.put(
        `${ADDRESS_CONSTANTS.ENDPOINTS.ADDRESSES}/${addressId}`,
        addressData
      );
      return response.data as Address;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  /**
   * Delete address
   */
  async deleteAddress(addressId: string): Promise<boolean> {
    try {
      await this.apiClient.delete(`${ADDRESS_CONSTANTS.ENDPOINTS.ADDRESSES}/${addressId}`);
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      return false;
    }
  }

  /**
   * Validate address string
   */
  async validateAddress(address: string): Promise<AddressValidationResult> {
    return AddressValidationService.validateAddress(address);
  }

  /**
   * Validate coordinates
   */
  async validateCoordinates(lat: number, lng: number): Promise<boolean> {
    return AddressValidationService.validateCoordinates(lat, lng);
  }

  /**
   * Validate address data object
   */
  async validateAddressData(addressData: Partial<Address>): Promise<AddressValidationResult> {
    return AddressValidationService.validateAddressData(addressData);
  }


  /**
   * Format address for display
   */
  formatAddress(address: Address): string {
    return AddressUtils.formatAddress(address);
  }

  /**
   * Calculate distance between two coordinates
   */
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    return AddressUtils.calculateDistance(lat1, lng1, lat2, lng2);
  }

  /**
   * Parse address components from address string
   */
  parseAddressComponents(address: string) {
    return AddressUtils.parseAddressComponents(address);
  }

  /**
   * Get addresses via gRPC
   * TODO: Implement real gRPC call
   */
  async getAddressesGrpc(): Promise<Address[]> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return [];
    } catch (error) {
      console.error('gRPC getAddresses error:', error);
      return [];
    }
  }

  /**
   * Create address via gRPC
   * TODO: Implement real gRPC call
   */
  async createAddressGrpc(addressData: Partial<Address>): Promise<Address> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id: Date.now().toString(),
        title: addressData.title || t('address.newAddress'),
        address: addressData.address || '',
        latitude: addressData.latitude || 0,
        longitude: addressData.longitude || 0,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('gRPC createAddress error:', error);
      throw error;
    }
  }
}
