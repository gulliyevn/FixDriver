import { Address } from '../../../shared/mocks/residenceMock';
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
      const { getAddresses } = await import('../../../shared/mocks/residenceMock');
      return await getAddresses() || [];
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
      const { addAddress } = await import('../../../shared/mocks/residenceMock');
      return await addAddress(addressData);
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
      const { updateAddress } = await import('../../../shared/mocks/residenceMock');
      return await updateAddress(id, updates);
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
      const { deleteAddress } = await import('../../../shared/mocks/residenceMock');
      return await deleteAddress(id);
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
      const { setDefaultAddress } = await import('../../../shared/mocks/residenceMock');
      return await setDefaultAddress(id);
    } catch (error) {
      console.error('Error setting default address:', error);
      return false;
    }
  }
};
