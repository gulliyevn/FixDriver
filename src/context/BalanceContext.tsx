import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useI18n } from '../hooks/useI18n';

export interface Transaction {
  id: string;
  type: 'package_purchase' | 'balance_topup' | 'subscription_renewal';
  amount: number;
  description: string;
  translationKey?: string;
  translationParams?: Record<string, string>;
  date: string;
  packageType?: string;
}

interface BalanceContextType {
  balance: number;
  transactions: Transaction[];
  topUpBalance: (amount: number) => Promise<void>;
  deductBalance: (amount: number, description: string, packageType?: string) => Promise<boolean>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

const BALANCE_KEY = 'user_balance';
const TRANSACTIONS_KEY = 'user_transactions';

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [balance, setBalance] = useState<number>(50); // Начальный баланс
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Загружаем баланс и транзакции при инициализации
  useEffect(() => {
    loadBalance();
    loadTransactions();
  }, []);

  const loadBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem(BALANCE_KEY);
      if (storedBalance) {
        setBalance(parseFloat(storedBalance));
      }
    } catch (error) {
      console.log('Error loading balance:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions);
        
        // Миграция: добавляем translationKey для старых транзакций пополнения
        const migratedTransactions = parsedTransactions.map((transaction: any) => {
          if (transaction.type === 'balance_topup' && !transaction.translationKey) {
            return {
              ...transaction,
              translationKey: 'client.paymentHistory.transactions.topUp',
              translationParams: { amount: Math.abs(transaction.amount).toString() }
            };
          }
          return transaction;
        });
        
        setTransactions(migratedTransactions);
      }
    } catch (error) {
      console.log('Error loading transactions:', error);
    }
  };

  const saveBalance = async (newBalance: number) => {
    try {
      await AsyncStorage.setItem(BALANCE_KEY, newBalance.toString());
      setBalance(newBalance);
    } catch (error) {
      console.log('Error saving balance:', error);
    }
  };

  const saveTransactions = async (newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.log('Error saving transactions:', error);
    }
  };

  const topUpBalance = async (amount: number) => {
    const newBalance = balance + amount;
    await saveBalance(newBalance);
    
    // Добавляем транзакцию пополнения
    await addTransaction({
      type: 'balance_topup',
      amount: amount,
      description: `Balance top-up ${amount} AFC`, // Английский текст как fallback
      translationKey: 'client.paymentHistory.transactions.topUp',
      translationParams: { amount: amount.toString() },
    });
  };

  const deductBalance = async (amount: number, description: string, packageType?: string): Promise<boolean> => {
    if (balance < amount) {
      return false; // Insufficient funds
    }

    const newBalance = balance - amount;
    await saveBalance(newBalance);
    
    // Добавляем транзакцию списания
    await addTransaction({
      type: 'package_purchase',
      amount: -amount,
      description,
      packageType,
    });

    return true;
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    // Если это транзакция покупки пакета, добавляем ключи переводов
    if (transaction.type === 'package_purchase' && transaction.packageType) {
      const packageNameForTranslation = transaction.packageType === 'plus' ? 'plus' : transaction.packageType;
      newTransaction.translationKey = 'client.paymentHistory.transactions.packagePurchase';
      newTransaction.translationParams = { packageName: packageNameForTranslation };
    } else if (transaction.type === 'subscription_renewal' && transaction.packageType) {
      const packageNameForTranslation = transaction.packageType === 'plus' ? 'plus' : transaction.packageType;
      newTransaction.translationKey = 'client.paymentHistory.transactions.subscriptionRenewal';
      newTransaction.translationParams = { packageName: packageNameForTranslation };
    }

    const newTransactions = [newTransaction, ...transactions];
    await saveTransactions(newTransactions);
  };

  return (
    <BalanceContext.Provider value={{
      balance,
      transactions,
      topUpBalance,
      deductBalance,
      addTransaction,
    }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}; 