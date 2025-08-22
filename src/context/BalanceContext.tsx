import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

interface BalanceContextType {
  balance: number;
  earnings: number;
  transactions: any[];
  addEarnings: (amount: number) => Promise<{ newBalance: number; newEarnings: number }>;
  topUpBalance: (amount: number) => Promise<void>;
  withdrawBalance: (amount: number) => Promise<boolean>;
  resetBalance: () => Promise<void>;
  resetEarnings: () => Promise<number>; // Обнуляет только earnings, возвращает старое значение
  loadBalance: () => Promise<void>;
  loadEarnings: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const useBalanceContext = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalanceContext must be used within a BalanceProvider');
  }
  return context;
};

interface BalanceProviderProps {
  children: React.ReactNode;
}

export const BalanceProvider: React.FC<BalanceProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // Ключи для AsyncStorage
  const balanceKey = `@balance_${user?.id || 'default'}`;
  const earningsKey = `@earnings_${user?.id || 'default'}`;
  const transactionsKey = `@transactions_${user?.id || 'default'}`;

  // Загружаем данные при инициализации
  useEffect(() => {
    if (user) {
      loadBalance();
      loadEarnings();
      loadTransactions();
    }
  }, [user]);

  const loadBalance = async () => {
    try {
      const savedBalance = await AsyncStorage.getItem(balanceKey);
      if (savedBalance !== null) {
        setBalance(parseFloat(savedBalance));
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
      setBalance(0);
    }
  };

  const loadEarnings = async () => {
    try {
      const savedEarnings = await AsyncStorage.getItem(earningsKey);
      if (savedEarnings !== null) {
        const parsedEarnings = parseFloat(savedEarnings);
        setEarnings(parsedEarnings);
      } else {
        setEarnings(0);
      }
    } catch (error) {
      console.error('Error loading earnings:', error);
      setEarnings(0);
    }
  };

  const loadTransactions = async () => {
    try {
      const savedTransactions = await AsyncStorage.getItem(transactionsKey);
      if (savedTransactions !== null) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    }
  };

  const addEarnings = async (amount: number) => {
    // Функциональные обновления, чтобы избежать гонок при последовательных вызовах
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

    // Сохраняем в AsyncStorage рассчитанные значения
    await AsyncStorage.setItem(balanceKey, computedNewBalance.toString());
    await AsyncStorage.setItem(earningsKey, computedNewEarnings.toString());

    // Добавляем транзакцию (также с функциональным обновлением)
    const newTransaction = {
      id: Date.now().toString(),
      type: 'payment',
      amount: amount,
      description: `Earnings ${amount} AFc`,
      date: new Date().toISOString(),
    };

    let updatedTransactions: any[] = [];
    setTransactions(prevTransactions => {
      updatedTransactions = [newTransaction, ...prevTransactions];
      return updatedTransactions;
    });
    await AsyncStorage.setItem(transactionsKey, JSON.stringify(updatedTransactions));

    // Возвращаем новые значения для немедленного использования вызывающим кодом
    return { newBalance: computedNewBalance, newEarnings: computedNewEarnings };
  };

  const topUpBalance = async (amount: number) => {
    const newBalance = balance + amount;
    
    setBalance(newBalance);
    await AsyncStorage.setItem(balanceKey, newBalance.toString());
    
    // Добавляем транзакцию
    const newTransaction = {
      id: Date.now().toString(),
      type: 'topup',
      amount: amount,
      description: `Top-up ${amount} AFc`,
      date: new Date().toISOString(),
    };
    
    const newTransactions = [newTransaction, ...transactions];
    setTransactions(newTransactions);
    await AsyncStorage.setItem(transactionsKey, JSON.stringify(newTransactions));
  };

  const withdrawBalance = async (amount: number): Promise<boolean> => {
    if (balance < amount) {
      return false;
    }

    const newBalance = balance - amount;
    setBalance(newBalance);
    await AsyncStorage.setItem(balanceKey, newBalance.toString());
    
    // Добавляем транзакцию
    const newTransaction = {
      id: Date.now().toString(),
      type: 'withdrawal',
      amount: -amount,
      description: `Withdrawal ${amount} AFc`,
      date: new Date().toISOString(),
    };
    
    const newTransactions = [newTransaction, ...transactions];
    setTransactions(newTransactions);
    await AsyncStorage.setItem(transactionsKey, JSON.stringify(newTransactions));

    return true;
  };

  const resetBalance = async () => {
    try {
      setBalance(0);
      setEarnings(0);
      setTransactions([]);
      
      await AsyncStorage.setItem(balanceKey, '0');
      await AsyncStorage.setItem(earningsKey, '0');
      await AsyncStorage.setItem(transactionsKey, JSON.stringify([]));
    } catch (error) {
      console.error('❌ Ошибка при сбросе баланса:', error);
    }
  };

  const resetEarnings = async (): Promise<number> => {
    try {
      const oldEarnings = earnings;
      setEarnings(0);
      await AsyncStorage.setItem(earningsKey, '0');
      
      console.log(`[BalanceContext] Заработок обнулен: ${oldEarnings} AFc → 0 AFc`);
      return oldEarnings;
    } catch (error) {
      console.error('❌ Ошибка при сбросе заработка:', error);
      return earnings; // Возвращаем текущие earnings в случае ошибки
    }
  };

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
