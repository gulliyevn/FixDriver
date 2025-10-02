/**
 * ⚠️ DEV ONLY - TEMPORARY HOOK ⚠️
 * 
 * Хук для работы с временной регистрацией через AsyncStorage
 * 
 * TODO: УДАЛИТЬ ПЕРЕД ПРОДАКШЕНОМ!
 */

import { useState, useCallback } from 'react';
import DevRegistrationService, { DevRegisteredUser } from '../services/DevRegistrationService';

export const useDevRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Регистрация клиента (dev-режим)
   */
  const registerClient = useCallback(async (data: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<DevRegisteredUser | null> => {
    if (!__DEV__) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await DevRegistrationService.saveClientRegistration(data);
      
      // Логируем статистику
      await DevRegistrationService.logDevRegistrationStats();
      
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Регистрация водителя (dev-режим)
   */
  const registerDriver = useCallback(async (data: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    country: string;
    licenseNumber: string;
    licenseExpiry: string;
    vehicleNumber: string;
    experience: string;
    carBrand: string;
    carModel: string;
    carYear: string;
    carMileage: string;
    tariff: string;
    licensePhoto?: string;
    passportPhoto?: string;
  }): Promise<DevRegisteredUser | null> => {
    if (!__DEV__) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const driver = await DevRegistrationService.saveDriverRegistration(data);
      
      // Логируем статистику
      await DevRegistrationService.logDevRegistrationStats();
      
      return driver;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Получить всех пользователей
   */
  const getAllUsers = useCallback(async (): Promise<DevRegisteredUser[]> => {
    if (!__DEV__) return [];

    try {
      return await DevRegistrationService.getAllDevUsers();
    } catch (err) {
      return [];
    }
  }, []);

  /**
   * Очистить все регистрации
   */
  const clearAll = useCallback(async (): Promise<boolean> => {
    if (!__DEV__) return false;

    try {
      await DevRegistrationService.clearAllDevRegistrations();
      return true;
    } catch (err) {
      return false;
    }
  }, []);

  /**
   * Показать статистику
   */
  const showStats = useCallback(async () => {
    if (!__DEV__) return;
    await DevRegistrationService.logDevRegistrationStats();
  }, []);

  return {
    registerClient,
    registerDriver,
    getAllUsers,
    clearAll,
    showStats,
    isLoading,
    error,
    isDevMode: __DEV__,
  };
};

export default useDevRegistration;

