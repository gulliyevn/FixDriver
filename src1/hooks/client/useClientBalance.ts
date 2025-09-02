import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStorageKey, STORAGE_KEYS } from '../../utils/storageKeys';

export interface ClientTransaction {
  id: string;
  type: 'balance_topup' | 'package_purchase' | 'trip_payment' | 'cashback';
  amount: number;
  description: string;
  date: string;
  translationKey?: string;
  translationParams?: Record<string, string>;
  packageType?: string;
}

export interface ClientBalanceContextType {
  balance: number;
  transactions: ClientTransaction[];
  cashback: number;
  earnings?: number;
  topUpBalance: (amount: number) => Promise<void>;
  addEarnings?: (amount: number) => Promise<void>;
  deductBalance: (amount: number, description: string, packageType?: string) => Promise<boolean>;
  addTransaction: (transaction: Omit<ClientTransaction, 'id' | 'date'>) => Promise<void>;
  getCashback: () => Promise<number>;
  resetBalance?: () => Promise<void>;
  loadEarnings?: () => Promise<void>;
}

export const useClientBalance = (): ClientBalanceContextType => {
  const [balance, setBalance] = useState<number>(50); // Начальный баланс
  const [transactions, setTransactions] = useState<ClientTransaction[]>([]);
  const [cashback, setCashback] = useState<number>(0);
  
  // Получаем ключи с изоляцией по пользователю
  const balanceKey = useUserStorageKey(STORAGE_KEYS.CLIENT_BALANCE);
  const transactionsKey = useUserStorageKey(STORAGE_KEYS.CLIENT_TRANSACTIONS);
  const cashbackKey = useUserStorageKey(STORAGE_KEYS.CLIENT_CASHBACK);

  useEffect(() => {
    loadBalance();
    loadTransactions();
    loadCashback();
  }, []);

  const loadBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem(balanceKey);
      if (storedBalance) {
        setBalance(parseFloat(storedBalance));
      }
    } catch (error) {
      console.error('Error loading client balance:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(transactionsKey);
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
      console.error('Error loading client transactions:', error);
    }
  };

  const loadCashback = async () => {
    try {
      const storedCashback = await AsyncStorage.getItem(cashbackKey);
      if (storedCashback) {
        setCashback(parseFloat(storedCashback));
      }
    } catch (error) {
      console.error('Error loading client cashback:', error);
    }
  };

  const saveBalance = async (newBalance: number) => {
    try {
      await AsyncStorage.setItem(balanceKey, newBalance.toString());
      setBalance(newBalance);
    } catch (error) {
      console.error('Error saving client balance:', error);
    }
  };

  const saveTransactions = async (newTransactions: ClientTransaction[]) => {
    try {
      await AsyncStorage.setItem(transactionsKey, JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Error saving client transactions:', error);
    }
  };

  const saveCashback = async (newCashback: number) => {
    try {
      await AsyncStorage.setItem(cashbackKey, newCashback.toString());
      setCashback(newCashback);
    } catch (error) {
      console.error('Error saving client cashback:', error);
    }
  };

  const topUpBalance = async (amount: number) => {
    const newBalance = balance + amount;
    await saveBalance(newBalance);
    
    await addTransaction({
      type: 'balance_topup',
      amount: amount,
      description: `Balance top-up ${amount} AFc`,
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
    
    await addTransaction({
      type: 'package_purchase',
      amount: -amount,
      description,
      packageType,
    });

    return true;
  };

  const addTransaction = async (transaction: Omit<ClientTransaction, 'id' | 'date'>) => {
    const newTransaction: ClientTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const newTransactions = [newTransaction, ...transactions];
    await saveTransactions(newTransactions);
  };

  const getCashback = async (): Promise<number> => {
    // Здесь можно добавить логику расчета cashback
    // Пока возвращаем сохраненный cashback
    return cashback;
  };

  const resetBalance = async () => {
    try {
      console.log('🔄 Сброс клиентского баланса...');
      
      // Обнуляем баланс
      setBalance(0);
      await AsyncStorage.setItem(balanceKey, '0');
      
      // Очищаем транзакции
      setTransactions([]);
      await AsyncStorage.setItem(transactionsKey, JSON.stringify([]));
      
      // Обнуляем cashback
      setCashback(0);
      await AsyncStorage.setItem(cashbackKey, '0');
      
      console.log('✅ Клиентский баланс успешно сброшен');
    } catch (error) {
      console.error('❌ Ошибка при сбросе клиентского баланса:', error);
    }
  };

  // Dummy функция для совместимости с интерфейсом
  const addEarnings = async (amount: number) => {
    console.log('💵 Клиент не может зарабатывать, но функция добавлена для совместимости');
  };

  // Dummy функция для совместимости с интерфейсом
  const loadEarnings = async () => {
    console.log('💵 Клиент не может зарабатывать, но функция добавлена для совместимости');
  };

  return {
    balance,
    transactions,
    cashback,
    earnings: 0, // Клиенты не зарабатывают
    topUpBalance,
    addEarnings,
    deductBalance,
    addTransaction,
    getCashback,
    resetBalance,
    loadEarnings,
  };
}; 