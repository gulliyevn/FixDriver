import { Address } from '../../../shared/mocks/shared/residenceMock';
import { AddressService } from '../../../data/datasources/address/AddressService';

/**
 * Domain usecase for address operations
 * Abstracts data layer access from presentation layer
 */
export const addressOperations = {
  /**
   * Get all addresses
   */
  async getAddresses(): Promise<Address[]> {
    try {
      // TODO: Replace with real API call
      // const addressService = AddressService.getInstance();
      // return await addressService.getAddresses();
      
      // Temporarily using mocks
      const { mockAddressStorage } = await import('../../../shared/mocks/shared/residenceMock');
      return await mockAddressStorage.getAddresses() || [];
    } catch (error) {
      console.error('Error getting addresses:', error);
      return [];
    }
  },

  /**
   * Create new address
   */
  async createAddress(addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address | null> {
    try {
      // TODO: Replace with real API call
      // const addressService = AddressService.getInstance();
      // return await addressService.createAddress(addressData);
      
      // Temporarily using mocks
      const { mockAddressStorage } = await import('../../../shared/mocks/shared/residenceMock');
      await mockAddressStorage.addAddress({
        id: Date.now().toString(),
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...addressData,
      } as any);
      const updated = await mockAddressStorage.getAddresses();
      return updated[updated.length - 1] || null;
    } catch (error) {
      console.error('Error creating address:', error);
      return null;
    }
  },

  /**
   * Update address
   */
  async updateAddress(id: string, updates: Partial<Address>): Promise<Address | null> {
    try {
      // TODO: Replace with real API call
      // const addressService = AddressService.getInstance();
      // return await addressService.updateAddress(id, updates);
      
      // Temporarily using mocks
      const { mockAddressStorage } = await import('../../../shared/mocks/shared/residenceMock');
      await mockAddressStorage.updateAddress(id, updates as any);
      const list = await mockAddressStorage.getAddresses();
      return list.find(a => a.id === id) || null;
    } catch (error) {
      console.error('Error updating address:', error);
      return null;
    }
  },

  /**
   * Delete address
   */
  async deleteAddress(id: string): Promise<boolean> {
    try {
      // TODO: Replace with real API call
      // const addressService = AddressService.getInstance();
      // return await addressService.deleteAddress(id);
      
      // Temporarily using mocks
      const { mockAddressStorage } = await import('../../../shared/mocks/shared/residenceMock');
      await mockAddressStorage.deleteAddress(id);
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      return false;
    }
  },

  /**
   * Set default address
   */
  async setDefaultAddress(id: string): Promise<boolean> {
    try {
      // TODO: Replace with real API call
      // const addressService = AddressService.getInstance();
      // return await addressService.setDefaultAddress(id);
      
      // Temporarily using mocks
      const { mockAddressStorage } = await import('../../../shared/mocks/shared/residenceMock');
      await mockAddressStorage.setDefaultAddress(id);
      return true;
    } catch (error) {
      console.error('Error setting default address:', error);
      return false;
    }
  }
};
