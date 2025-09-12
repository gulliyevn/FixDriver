import { Address } from '../../../shared/types/profile';
import { ResidenceGrpcService } from './ResidenceGrpcService';
import { ResidenceMockService } from './ResidenceMockService';

/**
 * Residence Service
 * 
 * Main service for managing user addresses
 * Integrates gRPC with mock fallback for development
 */

export class ResidenceService {
  private grpcService: ResidenceGrpcService;
  private mockService: ResidenceMockService;

  constructor() {
    this.grpcService = new ResidenceGrpcService();
    this.mockService = new ResidenceMockService();
  }

  /**
   * Get all user addresses
   */
  async getAddresses(): Promise<Address[]> {
    try {
      return await this.grpcService.getAddresses();
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.getAddresses();
    }
  }

  /**
   * Add new address
   */
  async addAddress(addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    try {
      return await this.grpcService.addAddress(addressData);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.addAddress(addressData);
    }
  }

  /**
   * Update existing address
   */
  async updateAddress(id: string, addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    try {
      return await this.grpcService.updateAddress(id, addressData);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.updateAddress(id, addressData);
    }
  }

  /**
   * Delete address
   */
  async deleteAddress(id: string): Promise<void> {
    try {
      await this.grpcService.deleteAddress(id);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.deleteAddress(id);
    }
  }

  /**
   * Set default address
   */
  async setDefaultAddress(id: string): Promise<void> {
    try {
      await this.grpcService.setDefaultAddress(id);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.setDefaultAddress(id);
    }
  }
}
