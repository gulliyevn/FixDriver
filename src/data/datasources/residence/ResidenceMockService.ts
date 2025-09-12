import { Address } from '../../../shared/types/profile';
import { mockAddresses } from '../../../shared/mocks/data/addressMock';

/**
 * Residence Mock Service
 * 
 * Mock implementation for residence operations
 * Provides fallback data for development and testing
 */

export class ResidenceMockService {
  private addresses: Address[] = [...mockAddresses];

  /**
   * Get all user addresses from mock data
   */
  async getAddresses(): Promise<Address[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.addresses];
  }

  /**
   * Add new address to mock data
   */
  async addAddress(addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const newAddress: Address = {
      ...addressData,
      id: `address_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If this is the first address, make it default
    if (this.addresses.length === 0) {
      newAddress.isDefault = true;
    }

    this.addresses.push(newAddress);
    return newAddress;
  }

  /**
   * Update existing address in mock data
   */
  async updateAddress(id: string, addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.addresses.findIndex(addr => addr.id === id);
    if (index === -1) {
      throw new Error('Address not found');
    }

    const updatedAddress: Address = {
      ...this.addresses[index],
      ...addressData,
      id,
      updatedAt: new Date(),
    };

    this.addresses[index] = updatedAddress;
    return updatedAddress;
  }

  /**
   * Delete address from mock data
   */
  async deleteAddress(id: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.addresses.findIndex(addr => addr.id === id);
    if (index === -1) {
      throw new Error('Address not found');
    }

    const wasDefault = this.addresses[index].isDefault;
    this.addresses.splice(index, 1);

    // If we deleted the default address, make the first remaining address default
    if (wasDefault && this.addresses.length > 0) {
      this.addresses[0].isDefault = true;
    }
  }

  /**
   * Set default address in mock data
   */
  async setDefaultAddress(id: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = this.addresses.findIndex(addr => addr.id === id);
    if (index === -1) {
      throw new Error('Address not found');
    }

    // Remove default from all addresses
    this.addresses.forEach(addr => {
      addr.isDefault = false;
    });

    // Set the selected address as default
    this.addresses[index].isDefault = true;
  }
}
