import { useState, useEffect, useCallback } from 'react';
import { Address } from '../mocks/shared/residenceMock';
import { ADDRESS_CONSTANTS } from '../constants/addressConstants';
import { addressOperations } from '../../domain/usecases/address/addressOperations';

interface UseAddressesReturn {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  refreshAddresses: () => Promise<void>;
  addAddress: (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateAddress: (id: string, updates: Partial<Address>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
}

export const useAddresses = (): UseAddressesReturn => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedAddresses = await addressOperations.getAddresses();
      setAddresses(loadedAddresses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ADDRESS_CONSTANTS.ERROR_MESSAGES.LOAD_FAILED;
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAddresses = useCallback(async () => {
    await loadAddresses();
  }, [loadAddresses]);

  const addAddress = useCallback(async (addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const newAddress = await addressOperations.createAddress(addressData);
      
      if (newAddress) {
        setAddresses(prev => [...prev, newAddress]);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ADDRESS_CONSTANTS.ERROR_MESSAGES.ADD_FAILED;

      return false;
    }
  }, []);

  const updateAddress = useCallback(async (id: string, updates: Partial<Address>): Promise<boolean> => {
    try {
      const updatedAddress = await addressOperations.updateAddress(id, updates);
      
      if (updatedAddress) {
        setAddresses(prev => 
          prev.map(addr => addr.id === id ? updatedAddress : addr)
        );
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ADDRESS_CONSTANTS.ERROR_MESSAGES.UPDATE_FAILED;

      return false;
    }
  }, []);

  const deleteAddress = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = await addressOperations.deleteAddress(id);
      
      if (success) {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ADDRESS_CONSTANTS.ERROR_MESSAGES.DELETE_FAILED;

      return false;
    }
  }, []);

  const setDefaultAddress = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = await addressOperations.setDefaultAddress(id);
      
      if (success) {
        // Find the address we're setting as default
        const targetAddress = addresses.find(addr => addr.id === id);
        if (!targetAddress) return false;
        
        // Update state locally - reset isDefault only for addresses of the same category
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id || (addr.category === targetAddress.category && addr.isDefault && addr.id !== id ? false : addr.isDefault)
          }))
        );
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ADDRESS_CONSTANTS.ERROR_MESSAGES.SET_DEFAULT_FAILED;

      return false;
    }
  }, [addresses]);

  // Load addresses when component mounts
  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

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