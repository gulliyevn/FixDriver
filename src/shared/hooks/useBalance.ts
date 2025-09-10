import { useEffect } from 'react';
import { useAuth } from '../../presentation/context/AuthContext';
import { useBalanceState } from './balance/useBalanceState';
import { useBalanceActions } from './balance/useBalanceActions';
import { useBalanceUtils } from './balance/useBalanceUtils';

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
  refreshBalance: (userId: string) => Promise<void>;
  refreshEarnings: (userId: string) => Promise<void>;
  refreshTransactions: (userId: string) => Promise<void>;
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
  
  // State management
  const {
    balance,
    earnings,
    transactions,
    isLoading,
    error,
    setBalance,
    setEarnings,
    setTransactions,
    setError,
    refreshBalance,
    refreshEarnings,
    refreshTransactions,
    resetAllData,
  } = useBalanceState();

  // Balance operations
  const {
    addEarnings,
    topUpBalance,
    withdrawBalance,
    resetBalance,
    resetEarnings,
  } = useBalanceActions({
    userId: user?.id || '',
    setBalance,
    setEarnings,
    setTransactions,
    setIsLoading: () => {}, // Loading is managed in state hook
    setError,
  });

  // Utility functions
  const {
    hasSufficientBalance: checkSufficientBalance,
    formatBalance: formatBalanceAmount,
    formatEarnings: formatEarningsAmount,
  } = useBalanceUtils();

  // Wrapper functions to maintain API compatibility
  const hasSufficientBalance = (amount: number): boolean => {
    return checkSufficientBalance(balance, amount);
  };

  const formatBalance = (amount?: number): string => {
    return formatBalanceAmount(amount ?? balance);
  };

  const formatEarnings = (amount?: number): string => {
    return formatEarningsAmount(amount ?? earnings);
  };

  // Load initial data when user changes
  useEffect(() => {
    if (user?.id) {
      refreshBalance(user.id);
      refreshEarnings(user.id);
      refreshTransactions(user.id);
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
