import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import MockServices from '../../shared/mocks/MockServices';

// 📋 Types
interface Transaction {
  id: string;
  type: 'payment' | 'topup' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
}

interface BalanceContextType {
  balance: number;
  earnings: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addEarnings: (amount: number) => Promise<{ newBalance: number; newEarnings: number }>;
  topUpBalance: (amount: number) => Promise<void>;
  withdrawBalance: (amount: number) => Promise<boolean>;
  resetBalance: () => Promise<void>;
  resetEarnings: () => Promise<number>;
  loadBalance: () => Promise<void>;
  loadEarnings: () => Promise<void>;
  clearError: () => void;
}

export const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

interface BalanceProviderProps {
  children: ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadBalance();
      loadEarnings();
      loadTransactions();
    }
  }, [user]);

  const loadBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userBalance = await MockServices.balance.getBalance(user?.id || '');
      setBalance(userBalance);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load balance';
      setError(errorMessage);
      console.error('Error loading balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEarnings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userEarnings = await MockServices.balance.getEarnings(user?.id || '');
      setEarnings(userEarnings);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load earnings';
      setError(errorMessage);
      console.error('Error loading earnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userTransactions = await MockServices.balance.getTransactions(user?.id || '');
      setTransactions(userTransactions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load transactions';
      setError(errorMessage);
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEarnings = async (amount: number): Promise<{ newBalance: number; newEarnings: number }> => {
    try {
      setError(null);
      
      const result = await MockServices.balance.addEarnings(user?.id || '', amount);
      
      setBalance(result.newBalance);
      setEarnings(result.newEarnings);
      setTransactions(result.transactions);
      
      return { newBalance: result.newBalance, newEarnings: result.newEarnings };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add earnings';
      setError(errorMessage);
      throw error;
    }
  };

  const topUpBalance = async (amount: number): Promise<void> => {
    try {
      setError(null);
      
      const result = await MockServices.balance.topUpBalance(user?.id || '', amount);
      
      setBalance(result.newBalance);
      setTransactions(result.transactions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to top up balance';
      setError(errorMessage);
      throw error;
    }
  };

  const withdrawBalance = async (amount: number): Promise<boolean> => {
    try {
      setError(null);
      
      const result = await MockServices.balance.withdrawBalance(user?.id || '', amount);
      
      if (result.success) {
        setBalance(result.newBalance);
        setTransactions(result.transactions);
        return true;
      } else {
        setError('Insufficient balance');
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to withdraw balance';
      setError(errorMessage);
      return false;
    }
  };

  const resetBalance = async (): Promise<void> => {
    try {
      setError(null);
      
      await MockServices.balance.resetBalance(user?.id || '');
      
      setBalance(0);
      setEarnings(0);
      setTransactions([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset balance';
      setError(errorMessage);
      throw error;
    }
  };

  const resetEarnings = async (): Promise<number> => {
    try {
      setError(null);
      
      const oldEarnings = earnings;
      const result = await MockServices.balance.resetEarnings(user?.id || '');
      
      setEarnings(0);
      return oldEarnings;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset earnings';
      setError(errorMessage);
      return earnings;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: BalanceContextType = {
    balance,
    earnings,
    transactions,
    isLoading,
    error,
    addEarnings,
    topUpBalance,
    withdrawBalance,
    resetBalance,
    resetEarnings,
    loadBalance,
    loadEarnings,
    clearError,
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
};

export default BalanceContext;
