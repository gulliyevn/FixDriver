/**
 * Balance context
 * Main balance and earnings management context
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth';
import { BalanceContextType, BalanceProviderProps, Transaction, EarningsResult } from './types';
import { 
  getStorageKeys, 
  loadBalanceFromStorage, 
  loadEarningsFromStorage, 
  loadTransactionsFromStorage,
  saveBalanceToStorage,
  saveEarningsToStorage,
  saveTransactionsToStorage,
  createTransaction
} from './utils';

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Storage keys for user-specific data
  const storageKeys = getStorageKeys(user?.id);

  // Load data on initialization
  useEffect(() => {
    if (user) {
      loadBalance();
      loadEarnings();
      loadTransactions();
    }
  }, [user]);

  const loadBalance = useCallback(async () => {
    const loadedBalance = await loadBalanceFromStorage(storageKeys.balance);
    setBalance(loadedBalance);
  }, [storageKeys.balance]);

  const loadEarnings = useCallback(async () => {
    const loadedEarnings = await loadEarningsFromStorage(storageKeys.earnings);
    setEarnings(loadedEarnings);
  }, [storageKeys.earnings]);

  const loadTransactions = useCallback(async () => {
    const loadedTransactions = await loadTransactionsFromStorage(storageKeys.transactions);
    setTransactions(loadedTransactions);
  }, [storageKeys.transactions]);

  const addEarnings = useCallback(async (amount: number): Promise<EarningsResult> => {
    // Functional updates to avoid race conditions on sequential calls
    let computedNewBalance = 0;
    let computedNewEarnings = 0;

    setBalance(prevBalance => {
      computedNewBalance = prevBalance + amount;
      return computedNewBalance;
    });

    setEarnings(prevEarnings => {
      computedNewEarnings = prevEarnings + amount;
      return computedNewEarnings;
    });

    // Save calculated values to AsyncStorage
    await Promise.all([
      saveBalanceToStorage(storageKeys.balance, computedNewBalance),
      saveEarningsToStorage(storageKeys.earnings, computedNewEarnings)
    ]);

    // Add transaction (also with functional update)
    const newTransaction = createTransaction('payment', amount, `Earnings ${amount} AFc`);
    
    let updatedTransactions: Transaction[] = [];
    setTransactions(prevTransactions => {
      updatedTransactions = [newTransaction, ...prevTransactions];
      return updatedTransactions;
    });
    
    await saveTransactionsToStorage(storageKeys.transactions, updatedTransactions);

    // Return new values for immediate use by calling code
    return { newBalance: computedNewBalance, newEarnings: computedNewEarnings };
  }, [storageKeys]);

  const topUpBalance = useCallback(async (amount: number) => {
    const newBalance = balance + amount;
    
    setBalance(newBalance);
    await saveBalanceToStorage(storageKeys.balance, newBalance);
    
    // Add transaction
    const newTransaction = createTransaction('topup', amount, `Top-up ${amount} AFc`);
    const newTransactions = [newTransaction, ...transactions];
    setTransactions(newTransactions);
    await saveTransactionsToStorage(storageKeys.transactions, newTransactions);
  }, [balance, transactions, storageKeys]);

  const withdrawBalance = useCallback(async (amount: number): Promise<boolean> => {
    if (balance < amount) {
      return false;
    }

    const newBalance = balance - amount;
    setBalance(newBalance);
    await saveBalanceToStorage(storageKeys.balance, newBalance);
    
    // Add transaction
    const newTransaction = createTransaction('withdrawal', -amount, `Withdrawal ${amount} AFc`);
    const newTransactions = [newTransaction, ...transactions];
    setTransactions(newTransactions);
    await saveTransactionsToStorage(storageKeys.transactions, newTransactions);

    return true;
  }, [balance, transactions, storageKeys]);

  const resetBalance = useCallback(async () => {
    try {
      setBalance(0);
      setEarnings(0);
      setTransactions([]);
      
      await Promise.all([
        saveBalanceToStorage(storageKeys.balance, 0),
        saveEarningsToStorage(storageKeys.earnings, 0),
        saveTransactionsToStorage(storageKeys.transactions, [])
      ]);
    } catch (error) {
      console.error('Error resetting balance:', error);
    }
  }, [storageKeys]);

  const resetEarnings = useCallback(async (): Promise<number> => {
    try {
      const oldEarnings = earnings;
      setEarnings(0);
      await saveEarningsToStorage(storageKeys.earnings, 0);
      
      console.log(`[BalanceContext] Earnings reset: ${oldEarnings} AFc → 0 AFc`);
      return oldEarnings;
    } catch (error) {
      console.error('Error resetting earnings:', error);
      return earnings; // Return current earnings in case of error
    }
  }, [earnings, storageKeys.earnings]);

  const value: BalanceContextType = {
    balance,
    earnings,
    transactions,
    addEarnings,
    topUpBalance,
    withdrawBalance,
    resetBalance,
    resetEarnings,
    loadBalance,
    loadEarnings,
  };

  return (
    <BalanceContext.Provider value={value}>
      {children}
    </BalanceContext.Provider>
  );
};
