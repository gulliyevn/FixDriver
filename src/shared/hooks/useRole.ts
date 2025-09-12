import { useAuth } from '../../presentation/context/auth/AuthContext';
import { UserRole } from '../types/user';

/**
 * Hook for getting current user role
 * Returns 'driver' or 'client'
 */
export const useRole = (): UserRole => {
  const { user } = useAuth();
  return user?.role || UserRole.CLIENT;
};

/**
 * Hook for getting key prefixes based on role
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