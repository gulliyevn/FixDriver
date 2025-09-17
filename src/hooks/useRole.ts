import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/user';

/**
 * Хук для получения текущей роли пользователя
 * Возвращает 'driver' или 'client'
 */
export const useRole = (): UserRole => {
  const { user } = useAuth();
  return user?.role || UserRole.CLIENT;
};

/**
 * Хук для получения префиксов ключей в зависимости от роли
 */
export const useRoleKeys = () => {
  const role = useRole();
  
  const getStorageKey = (baseKey: string): string => {
    return role === UserRole.DRIVER ? `driver_${baseKey}` : `client_${baseKey}`;
  };
  
  const getApiEndpoint = (baseEndpoint: string): string => {
    return role === UserRole.DRIVER ? `/driver${baseEndpoint}` : `/client${baseEndpoint}`;
  };
  
  return {
    role,
    getStorageKey,
    getApiEndpoint,
    isDriver: role === UserRole.DRIVER,
    isClient: role === UserRole.CLIENT,
  };
};