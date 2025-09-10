import { useState, useEffect } from 'react';
import { useDriverBalanceStorage } from './useDriverBalanceStorage';
import { useDriverBalanceTransactions } from './useDriverBalanceTransactions';
import { useDriverBalanceOperations } from './useDriverBalanceOperations';
import { DRIVER_BALANCE_CONSTANTS } from '../../constants/driverBalanceConstants';

export interface DriverTransaction {
  id: string;
  type: 'payment' | 'topup' | 'refund' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  translationKey?: string;
  translationParams?: Record<string, string>;
}

export interface DriverBalanceContextType {
  balance: number;
  transactions: DriverTransaction[];
  earnings: number;
  topUpBalance: (amount: number) => Promise<void>;
  addEarnings: (amount: number) => Promise<void>;
  withdrawBalance: (amount: number) => Promise<boolean>;
  addTransaction: (transaction: Omit<DriverTransaction, 'id' | 'date'>) => Promise<void>;
  getEarnings: () => Promise<number>;
  loadBalance: () => Promise<void>;
  loadEarnings: () => Promise<void>;
  resetBalance: () => Promise<void>;
}

/**
 * Main hook for driver balance management
 */
export const useDriverBalance = (): DriverBalanceContextType => {
  const [balance, setBalance] = useState<number>(DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_BALANCE);
  const [transactions, setTransactions] = useState<DriverTransaction[]>([]);
  const [earnings, setEarnings] = useState<number>(DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_EARNINGS);
  
  const { loadBalance: loadBalanceFromStorage, loadEarnings: loadEarningsFromStorage, clearAllData } = useDriverBalanceStorage();
  const { loadTransactions: loadTransactionsFromStorage, addTransaction: addTransactionToStorage } = useDriverBalanceTransactions();
  const { topUpBalance: performTopUp, addEarnings: performAddEarnings, withdrawBalance: performWithdraw } = useDriverBalanceOperations();

  useEffect(() => {
    loadBalance();
    loadTransactions();
    loadEarnings();
  }, []);

  const loadBalance = async () => {
    try {
      const loadedBalance = await loadBalanceFromStorage();
      setBalance(loadedBalance);
    } catch (error) {
      console.error('Error loading driver balance:', error);
      setBalance(DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_BALANCE);
    }
  };

  const loadTransactions = async () => {
    try {
      const loadedTransactions = await loadTransactionsFromStorage();
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error('Error loading driver transactions:', error);
      setTransactions([]);
    }
  };

  const loadEarnings = async () => {
    try {
      const loadedEarnings = await loadEarningsFromStorage();
      setEarnings(loadedEarnings);
    } catch (error) {
      console.error('Error loading driver earnings:', error);
      setEarnings(DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_EARNINGS);
    }
  };

  const topUpBalance = async (amount: number) => {
    try {
      const { newBalance, newTransactions } = await performTopUp(amount, balance, transactions);
      setBalance(newBalance);
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error topping up balance:', error);
    }
  };

  const addEarnings = async (amount: number) => {
    try {
      const { newBalance, newEarnings, newTransactions } = await performAddEarnings(amount, balance, earnings, transactions);
      setBalance(newBalance);
      setEarnings(newEarnings);
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error adding earnings:', error);
    }
  };

  const withdrawBalance = async (amount: number): Promise<boolean> => {
    try {
      const result = await performWithdraw(amount, balance, transactions);
      if (result.success) {
        setBalance(result.newBalance!);
        setTransactions(result.newTransactions!);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error withdrawing balance:', error);
      return false;
    }
  };

  const addTransaction = async (transaction: Omit<DriverTransaction, 'id' | 'date'>) => {
    try {
      const newTransactions = await addTransactionToStorage(transaction, transactions);
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const getEarnings = async (): Promise<number> => {
    return earnings;
  };

  const resetBalance = async () => {
    try {
      await clearAllData();
      setBalance(DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_BALANCE);
      setTransactions([]);
      setEarnings(DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_EARNINGS);
    } catch (error) {
      console.error('Error resetting balance:', error);
    }
  };

  return {
    balance,
    transactions,
    earnings,
    topUpBalance,
    addEarnings,
    withdrawBalance,
    addTransaction,
    getEarnings,
    loadBalance,
    loadEarnings,
    resetBalance,
  };
};