import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../core/context/AuthContext';
import MockServices from '../mocks/MockServices';

// Types
export interface BalanceData {
  balance: number;
  earnings: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'payment' | 'topup' | 'withdrawal' | 'bonus' | 'penalty';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface BalanceActions {
  addEarnings: (amount: number) => Promise<{ newBalance: number; newEarnings: number; transactions: Transaction[] }>;
  topUpBalance: (amount: number) => Promise<{ newBalance: number; transactions: Transaction[] }>;
  withdrawBalance: (amount: number) => Promise<{ success: boolean; newBalance?: number; transactions?: Transaction[] }>;
  resetBalance: () => Promise<void>;
  resetEarnings: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshEarnings: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export interface UseBalanceReturn extends BalanceData, BalanceActions {
  isLoading: boolean;
  error: string | null;
  hasSufficientBalance: (amount: number) => boolean;
  formatBalance: (amount?: number) => string;
  formatEarnings: (amount?: number) => string;
}

/**
 * Hook for managing user balance and earnings
 * Integrates with gRPC services and provides reactive state management
 */
export const useBalance = (): UseBalanceReturn => {
  const { user } = useAuth();
  
  // State
  const [balance, setBalance] = useState<number>(0);
  const [earnings, setEarnings] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load balance from server
   */
  const refreshBalance = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with real gRPC call
      const balanceData = await MockServices.balance.getBalance(user.id);
      setBalance(balanceData);
      
      console.log('Balance refreshed:', balanceData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load balance';
      setError(errorMessage);
      console.error('Error refreshing balance:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Load earnings from server
   */
  const refreshEarnings = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with real gRPC call
      const earningsData = await MockServices.balance.getEarnings(user.id);
      setEarnings(earningsData);
      
      console.log('Earnings refreshed:', earningsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load earnings';
      setError(errorMessage);
      console.error('Error refreshing earnings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Load transactions from server
   */
  const refreshTransactions = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with real gRPC call
      const transactionsData = await MockServices.balance.getTransactions(user.id);
      setTransactions(transactionsData);
      
      console.log('Transactions refreshed:', transactionsData.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      setError(errorMessage);
      console.error('Error refreshing transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Add earnings to balance
   */
  const addEarnings = useCallback(async (amount: number): Promise<{ newBalance: number; newEarnings: number; transactions: Transaction[] }> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with real gRPC call
      const result = await MockServices.balance.addEarnings(user.id, amount);
      
      setBalance(result.newBalance);
      setEarnings(result.newEarnings);
      setTransactions(result.transactions);
      
      console.log('Earnings added:', amount, 'New balance:', result.newBalance);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add earnings';
      setError(errorMessage);
      console.error('Error adding earnings:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Top up balance
   */
  const topUpBalance = useCallback(async (amount: number): Promise<{ newBalance: number; transactions: Transaction[] }> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with real gRPC call
      const result = await MockServices.balance.topUpBalance(user.id, amount);
      
      setBalance(result.newBalance);
      setTransactions(result.transactions);
      
      console.log('Balance topped up:', amount, 'New balance:', result.newBalance);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to top up balance';
      setError(errorMessage);
      console.error('Error topping up balance:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Withdraw from balance
   */
  const withdrawBalance = useCallback(async (amount: number): Promise<{ success: boolean; newBalance?: number; transactions?: Transaction[] }> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with real gRPC call
      const result = await MockServices.balance.withdrawBalance(user.id, amount);
      
      if (result.success && result.newBalance !== undefined) {
        setBalance(result.newBalance);
        if (result.transactions) {
          setTransactions(result.transactions);
        }
      }
      
      console.log('Balance withdrawal:', amount, 'Success:', result.success);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw balance';
      setError(errorMessage);
      console.error('Error withdrawing balance:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Reset balance to zero
   */
  const resetBalance = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with real gRPC call
      await MockServices.balance.resetBalance(user.id);
      
      setBalance(0);
      setEarnings(0);
      setTransactions([]);
      
      console.log('Balance reset');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset balance';
      setError(errorMessage);
      console.error('Error resetting balance:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Reset earnings to zero
   */
  const resetEarnings = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with real gRPC call
      await MockServices.balance.resetEarnings(user.id);
      
      setEarnings(0);
      
      console.log('Earnings reset');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset earnings';
      setError(errorMessage);
      console.error('Error resetting earnings:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  /**
   * Check if user has sufficient balance
   */
  const hasSufficientBalance = useCallback((amount: number): boolean => {
    return balance >= amount;
  }, [balance]);

  /**
   * Format balance amount
   */
  const formatBalance = useCallback((amount?: number): string => {
    const value = amount ?? balance;
    return `${value.toFixed(2)} AFc`;
  }, [balance]);

  /**
   * Format earnings amount
   */
  const formatEarnings = useCallback((amount?: number): string => {
    const value = amount ?? earnings;
    return `${value.toFixed(2)} AFc`;
  }, [earnings]);

  // Load initial data when user changes
  useEffect(() => {
    if (user?.id) {
      refreshBalance();
      refreshEarnings();
      refreshTransactions();
    }
  }, [user?.id, refreshBalance, refreshEarnings, refreshTransactions]);

  return {
    // Data
    balance,
    earnings,
    transactions,
    
    // State
    isLoading,
    error,
    
    // Actions
    addEarnings,
    topUpBalance,
    withdrawBalance,
    resetBalance,
    resetEarnings,
    refreshBalance,
    refreshEarnings,
    refreshTransactions,
    
    // Utilities
    hasSufficientBalance,
    formatBalance,
    formatEarnings,
  };
};
