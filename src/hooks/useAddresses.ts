import { useState, useEffect, useCallback } from 'react';
import { Address } from '../mocks/residenceMock';
import { addressService, CreateAddressRequest, UpdateAddressRequest } from '../services/addressService';

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

export const useAddresses = (): UseAddressesReturn => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Заменить на реальный API вызов
      // const loadedAddresses = await addressService.getAddresses();
      
      // Временно используем моки
      const { getAddresses } = await import('../mocks/residenceMock');
      const loadedAddresses = await getAddresses() || [];
      
      setAddresses(loadedAddresses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить адреса';
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAddresses = useCallback(async () => {
    await loadAddresses();
  }, [loadAddresses]);

  const addAddress = useCallback(async (addressData: CreateAddressRequest): Promise<boolean> => {
    try {
      // TODO: Заменить на реальный API вызов
      // const newAddress = await addressService.createAddress(addressData);
      
      // Временно используем моки
      const { addAddress: mockAddAddress } = await import('../mocks/residenceMock');
      const newAddress = await mockAddAddress(addressData);
      
      setAddresses(prev => [...prev, newAddress]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось добавить адрес';

      return false;
    }
  }, []);

  const updateAddress = useCallback(async (id: string, updates: UpdateAddressRequest): Promise<boolean> => {
    try {
      // TODO: Заменить на реальный API вызов
      // const updatedAddress = await addressService.updateAddress(id, updates);
      
      // Временно используем моки
      const { updateAddress: mockUpdateAddress } = await import('../mocks/residenceMock');
      const updatedAddress = await mockUpdateAddress(id, updates);
      
      if (updatedAddress) {
        setAddresses(prev => 
          prev.map(addr => addr.id === id ? updatedAddress : addr)
        );
        return true;
      } else {
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить адрес';

      return false;
    }
  }, []);

  const deleteAddress = useCallback(async (id: string): Promise<boolean> => {
    try {
      // TODO: Заменить на реальный API вызов
      // const success = await addressService.deleteAddress(id);
      
      // Временно используем моки
      const { deleteAddress: mockDeleteAddress } = await import('../mocks/residenceMock');
      const success = await mockDeleteAddress(id);
      
      if (success) {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        return true;
      } else {
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось удалить адрес';

      return false;
    }
  }, []);

  const setDefaultAddress = useCallback(async (id: string): Promise<boolean> => {
    try {
      // TODO: Заменить на реальный API вызов
      // const success = await addressService.setDefaultAddress(id);
      
      // Временно используем моки
      const { setDefaultAddress: mockSetDefault } = await import('../mocks/residenceMock');
      const success = await mockSetDefault(id);
      
      if (success) {
        // Находим адрес, который устанавливаем как дефолтный
        const targetAddress = addresses.find(addr => addr.id === id);
        if (!targetAddress) return false;
        
        // Обновляем состояние локально - сбрасываем isDefault только для адресов той же категории
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id || (addr.category === targetAddress.category && addr.isDefault && addr.id !== id ? false : addr.isDefault)
          }))
        );
        return true;
      } else {
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось установить адрес по умолчанию';

      return false;
    }
  }, [addresses]);

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