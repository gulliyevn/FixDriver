import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DriverTransaction {
  id: string;
  type: 'earnings' | 'withdrawal' | 'bonus' | 'commission';
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

const DRIVER_BALANCE_KEY = 'driver_balance';
const DRIVER_TRANSACTIONS_KEY = 'driver_transactions';
const DRIVER_EARNINGS_KEY = 'driver_earnings';

export const useDriverBalance = (): DriverBalanceContextType => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<DriverTransaction[]>([]);
  const [earnings, setEarnings] = useState<number>(0);

  useEffect(() => {
    loadBalance();
    loadTransactions();
    loadEarnings();
  }, []);

  const loadBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem(DRIVER_BALANCE_KEY);
      if (storedBalance) {
        setBalance(parseFloat(storedBalance));
      }
    } catch (error) {
      console.error('Error loading driver balance:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(DRIVER_TRANSACTIONS_KEY);
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
      const storedEarnings = await AsyncStorage.getItem(DRIVER_EARNINGS_KEY);
      if (storedEarnings) {
        setEarnings(parseFloat(storedEarnings));
      }
    } catch (error) {
      console.error('Error loading driver earnings:', error);
    }
  };

  const saveBalance = async (newBalance: number) => {
    try {
      await AsyncStorage.setItem(DRIVER_BALANCE_KEY, newBalance.toString());
      setBalance(newBalance);
    } catch (error) {
      console.error('Error saving driver balance:', error);
    }
  };

  const saveTransactions = async (newTransactions: DriverTransaction[]) => {
    try {
      await AsyncStorage.setItem(DRIVER_TRANSACTIONS_KEY, JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving driver transactions:', error);
    }
  };

  const saveEarnings = async (newEarnings: number) => {
    try {
      await AsyncStorage.setItem(DRIVER_EARNINGS_KEY, newEarnings.toString());
      setEarnings(newEarnings);
    } catch (error) {
      console.error('Error saving driver earnings:', error);
    }
  };

  const topUpBalance = async (amount: number) => {
    const newBalance = balance + amount;
    await saveBalance(newBalance);
    
    await addTransaction({
      type: 'earnings',
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