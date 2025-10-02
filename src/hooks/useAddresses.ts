import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddressService, { Address, CreateAddressRequest, UpdateAddressRequest } from '../services/addressService';
import { useAuth } from '../context/AuthContext';
import { useUserStorageKey, STORAGE_KEYS } from '../utils/storageKeys';

interface UseAddressesReturn {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  refreshAddresses: () => Promise<void>;
  addAddress: (addressData: CreateAddressRequest) => Promise<boolean>;
  updateAddress: (id: string, updates: UpdateAddressRequest) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string) => Promise<boolean>;
}

const addressServiceInstance = new AddressService();

export const useAddresses = (): UseAddressesReturn => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const addressesKey = useUserStorageKey(STORAGE_KEYS.USER_ADDRESSES);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (__DEV__) {
        // DEV: загружаем из AsyncStorage
        const saved = await AsyncStorage.getItem(addressesKey);
        setAddresses(saved ? JSON.parse(saved) : []);
      } else {
        // PROD: загружаем из API
        if (user?.id) {
          const loadedAddresses = await addressServiceInstance.getAddresses(user.id);
          setAddresses(loadedAddresses);
        } else {
          setAddresses([]);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить адреса';
      setError(errorMessage);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, addressesKey]);

  const refreshAddresses = useCallback(async () => {
    await loadAddresses();
  }, [loadAddresses]);

  const addAddress = useCallback(async (addressData: CreateAddressRequest): Promise<boolean> => {
    try {
      if (__DEV__) {
        // DEV: сохраняем в AsyncStorage
        const newAddress: Address = {
          id: Date.now().toString(),
          ...addressData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updated = [...addresses, newAddress];
        setAddresses(updated);
        await AsyncStorage.setItem(addressesKey, JSON.stringify(updated));
        return true;
      } else {
        // PROD: отправляем в API
        if (!user?.id) return false;
        const newAddress = await addressServiceInstance.createAddress(user.id, addressData);
        if (newAddress) {
          setAddresses(prev => [...prev, newAddress]);
          return true;
        }
        return false;
      }
    } catch (err) {
      return false;
    }
  }, [addresses, addressesKey, user?.id]);

  const updateAddress = useCallback(async (id: string, updates: UpdateAddressRequest): Promise<boolean> => {
    try {
      if (__DEV__) {
        // DEV: обновляем в AsyncStorage
        const updated = addresses.map(addr => 
          addr.id === id ? { ...addr, ...updates, updatedAt: new Date().toISOString() } : addr
        );
        setAddresses(updated);
        await AsyncStorage.setItem(addressesKey, JSON.stringify(updated));
        return true;
      } else {
        // PROD: обновляем через API
        const updatedAddress = await addressServiceInstance.updateAddress(id, updates);
        if (updatedAddress) {
          setAddresses(prev => prev.map(addr => addr.id === id ? updatedAddress : addr));
          return true;
        }
        return false;
      }
    } catch (err) {
      return false;
    }
  }, [addresses, addressesKey]);

  const deleteAddress = useCallback(async (id: string): Promise<boolean> => {
    try {
      if (__DEV__) {
        // DEV: удаляем из AsyncStorage
        const updated = addresses.filter(addr => addr.id !== id);
        setAddresses(updated);
        await AsyncStorage.setItem(addressesKey, JSON.stringify(updated));
        return true;
      } else {
        // PROD: удаляем через API
        const success = await addressServiceInstance.deleteAddress(id);
        if (success) {
          setAddresses(prev => prev.filter(addr => addr.id !== id));
          return true;
        }
        return false;
      }
    } catch (err) {
      return false;
    }
  }, [addresses, addressesKey]);

  const setDefaultAddress = useCallback(async (id: string): Promise<boolean> => {
    try {
      const targetAddress = addresses.find(addr => addr.id === id);
      if (!targetAddress) return false;

      if (__DEV__) {
        // DEV: обновляем в AsyncStorage
        const updated = addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id || (addr.category === targetAddress.category && addr.isDefault && addr.id !== id ? false : addr.isDefault)
        }));
        setAddresses(updated);
        await AsyncStorage.setItem(addressesKey, JSON.stringify(updated));
        return true;
      } else {
        // PROD: обновляем через API
        if (!user?.id) return false;
        const success = await addressServiceInstance.setDefaultAddress(user.id, id);
        if (success) {
          setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id || (addr.category === targetAddress.category && addr.isDefault && addr.id !== id ? false : addr.isDefault)
          })));
          return true;
        }
        return false;
      }
    } catch (err) {
      return false;
    }
  }, [addresses, addressesKey, user?.id]);

  // Загружаем адреса при монтировании компонента
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