import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStorageKey, STORAGE_KEYS } from '../../utils/storageKeys';

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
  withdrawBalance: (amount: number) => Promise<boolean>;
  addTransaction: (transaction: Omit<DriverTransaction, 'id' | 'date'>) => Promise<void>;
  getEarnings: () => Promise<number>;
}

export const useDriverBalance = (): DriverBalanceContextType => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<DriverTransaction[]>([]);
  const [earnings, setEarnings] = useState<number>(0);
  
  // Получаем ключи с изоляцией по пользователю
  const balanceKey = useUserStorageKey(STORAGE_KEYS.DRIVER_BALANCE);
  const transactionsKey = useUserStorageKey(STORAGE_KEYS.DRIVER_TRANSACTIONS);
  const earningsKey = useUserStorageKey(STORAGE_KEYS.DRIVER_EARNINGS);

  useEffect(() => {
    loadBalance();
    loadTransactions();
    loadEarnings();
  }, []);

  const loadBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem(balanceKey);
      if (storedBalance) {
        setBalance(parseFloat(storedBalance));
      }
    } catch (error) {
      console.error('Error loading driver balance:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(transactionsKey);
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions);
        setTransactions(parsedTransactions);
      }
    } catch (error) {
      console.error('Error loading driver transactions:', error);
    }
  };

  const loadEarnings = async () => {
    try {
      const storedEarnings = await AsyncStorage.getItem(earningsKey);
      if (storedEarnings) {
        setEarnings(parseFloat(storedEarnings));
      }
    } catch (error) {
      console.error('Error loading driver earnings:', error);
    }
  };

  const saveBalance = async (newBalance: number) => {
    try {
      await AsyncStorage.setItem(balanceKey, newBalance.toString());
      setBalance(newBalance);
    } catch (error) {
      console.error('Error saving driver balance:', error);
    }
  };

  const saveTransactions = async (newTransactions: DriverTransaction[]) => {
    try {
      await AsyncStorage.setItem(transactionsKey, JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving driver transactions:', error);
    }
  };

  const saveEarnings = async (newEarnings: number) => {
    try {
      await AsyncStorage.setItem(earningsKey, newEarnings.toString());
      setEarnings(newEarnings);
    } catch (error) {
      console.error('Error saving driver earnings:', error);
    }
  };

  const topUpBalance = async (amount: number) => {
    const newBalance = balance + amount;
    await saveBalance(newBalance);
    
    await addTransaction({
      type: 'topup',
      amount: amount,
      description: `Earnings ${amount} AFc`,
      translationKey: 'driver.balance.transactions.earnings',
      translationParams: { amount: amount.toString() },
    });
  };

  const withdrawBalance = async (amount: number): Promise<boolean> => {
    if (balance < amount) {
      return false; // Insufficient funds
    }

    const newBalance = balance - amount;
    await saveBalance(newBalance);
    
    await addTransaction({
      type: 'withdrawal',
      amount: -amount,
      description: `Withdrawal ${amount} AFc`,
      translationKey: 'driver.balance.transactions.withdrawal',
      translationParams: { amount: amount.toString() },
    });

    return true;
  };

  const addTransaction = async (transaction: Omit<DriverTransaction, 'id' | 'date'>) => {
    const newTransaction: DriverTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const newTransactions = [newTransaction, ...transactions];
    await saveTransactions(newTransactions);
  };

  const getEarnings = async (): Promise<number> => {
    // Здесь можно добавить логику расчета заработков
    // Пока возвращаем сохраненные заработки
    return earnings;
  };

  return {
    balance,
    transactions,
    earnings,
    topUpBalance,
    withdrawBalance,
    addTransaction,
    getEarnings,
  };
}; 