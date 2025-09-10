import { useCallback } from 'react';
import { driverBalanceOperations } from '../../../domain/usecases/driver/driverBalanceOperations';

/**
 * Hook for driver balance storage operations
 */
export const useDriverBalanceStorage = () => {
  const loadBalance = useCallback(async (): Promise<number> => {
    return driverBalanceOperations.loadBalance();
  }, []);

  const saveBalance = useCallback(async (balance: number): Promise<void> => {
    return driverBalanceOperations.saveBalance(balance);
  }, []);

  const loadEarnings = useCallback(async (): Promise<number> => {
    return driverBalanceOperations.loadEarnings();
  }, []);

  const saveEarnings = useCallback(async (earnings: number): Promise<void> => {
    return driverBalanceOperations.saveEarnings(earnings);
  }, []);

  const clearAllData = useCallback(async (): Promise<void> => {
    return driverBalanceOperations.clearAllData();
  }, []);

  return {
    loadBalance,
    saveBalance,
    loadEarnings,
    saveEarnings,
    clearAllData,
  };
};
