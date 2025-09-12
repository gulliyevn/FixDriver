import { useState, useEffect } from 'react';
import { Address } from '../../../../../../shared/types/profile';
import { ResidenceService } from '../../../../../../data/datasources/residence/ResidenceService';

/**
 * Residence State Hook
 * 
 * Manages residence data state and operations
 * Integrates with gRPC services for backend communication
 */

export const useResidenceState = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const residenceService = new ResidenceService();

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await residenceService.getAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const refreshAddresses = async () => {
    await loadAddresses();
  };

  const addAddress = async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newAddress = await residenceService.addAddress(addressData);
      setAddresses(prev => [...prev, newAddress]);
      return true;
    } catch (err) {
      console.error('Failed to add address:', err);
      return false;
    }
  };

  const updateAddress = async (id: string, addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const updatedAddress = await residenceService.updateAddress(id, addressData);
      setAddresses(prev => prev.map(addr => addr.id === id ? updatedAddress : addr));
      return true;
    } catch (err) {
      console.error('Failed to update address:', err);
      return false;
    }
  };

  const deleteAddress = async (id: string): Promise<boolean> => {
    try {
      await residenceService.deleteAddress(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete address:', err);
      return false;
    }
  };

  const setDefaultAddress = async (id: string): Promise<boolean> => {
    try {
      await residenceService.setDefaultAddress(id);
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      })));
      return true;
    } catch (err) {
      console.error('Failed to set default address:', err);
      return false;
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  return {
    addresses,
    loading,
    error,
    refreshAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
