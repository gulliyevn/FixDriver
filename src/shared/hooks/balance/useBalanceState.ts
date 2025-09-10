import { useState, useCallback } from 'react';
import { Transaction } from '../useBalance';
import { balanceOperations } from '../../../domain/usecases/balance/balanceOperations';

/**
 * Hook for managing balance state and data loading
 */
export const useBalanceState = () => {
  const [balance, setBalance] = useState<number>(0);
  const [earnings, setEarnings] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load balance from server
   */
  const refreshBalance = useCallback(async (userId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const balanceData = await balanceOperations.getBalance(userId);
      setBalance(balanceData);
      
      console.log('Balance refreshed:', balanceData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load balance';
      setError(errorMessage);
      console.error('Error refreshing balance:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load earnings from server
   */
  const refreshEarnings = useCallback(async (userId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const earningsData = await balanceOperations.getEarnings(userId);
      setEarnings(earningsData);
      
      console.log('Earnings refreshed:', earningsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load earnings';
      setError(errorMessage);
      console.error('Error refreshing earnings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load transactions from server
   */
  const refreshTransactions = useCallback(async (userId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const transactionsData = await balanceOperations.getTransactions(userId);
      setTransactions(transactionsData);
      
      console.log('Transactions refreshed:', transactionsData.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      setError(errorMessage);
      console.error('Error refreshing transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset all balance data
   */
  const resetAllData = useCallback(() => {
    setBalance(0);
    setEarnings(0);
    setTransactions([]);
    setError(null);
  }, []);

  return {
    // State
    balance,
    earnings,
    transactions,
    isLoading,
    error,
    
    // Setters
    setBalance,
    setEarnings,
    setTransactions,
    setError,
    
    // Actions
    refreshBalance,
    refreshEarnings,
    refreshTransactions,
    resetAllData,
  };
};
