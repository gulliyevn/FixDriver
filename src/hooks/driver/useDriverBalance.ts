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
  addEarnings: (amount: number) => Promise<void>;
  withdrawBalance: (amount: number) => Promise<boolean>;
  addTransaction: (transaction: Omit<DriverTransaction, 'id' | 'date'>) => Promise<void>;
  getEarnings: () => Promise<number>;
  loadBalance: () => Promise<void>;
  loadEarnings: () => Promise<void>;
  resetBalance: () => Promise<void>;
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
      // Загружаем сохраненный баланс
      const savedBalance = await AsyncStorage.getItem(balanceKey);
      if (savedBalance !== null) {
        setBalance(parseFloat(savedBalance));
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error('Error loading driver balance:', error);
      setBalance(0);
    }
  };

  const loadTransactions = async () => {
    try {
      // Загружаем сохраненные транзакции
      const savedTransactions = await AsyncStorage.getItem(transactionsKey);
      if (savedTransactions !== null) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error loading driver transactions:', error);
      setTransactions([]);
    }
  };

  const loadEarnings = async () => {
    try {
      console.log('🔄 loadEarnings вызван');
      // Загружаем сохраненные заработки
      const savedEarnings = await AsyncStorage.getItem(earningsKey);
      console.log('🔄 Загруженные earnings из AsyncStorage:', savedEarnings);
      console.log('🔄 Текущие earnings в состоянии:', earnings);
      if (savedEarnings !== null) {
        const parsedEarnings = parseFloat(savedEarnings);
        console.log('🔄 Устанавливаем earnings:', parsedEarnings);
        setEarnings(parsedEarnings);
      } else {
        console.log('🔄 Устанавливаем earnings: 0 (нет сохраненных)');
        setEarnings(0);
      }
    } catch (error) {
      console.error('Error loading driver earnings:', error);
      setEarnings(0);
    }
  };

  const saveBalance = async (newBalance: number) => {
    try {
      console.log('💾 saveBalance вызван с балансом:', newBalance);
      await AsyncStorage.setItem(balanceKey, newBalance.toString());
      setBalance(newBalance);
      console.log('💾 Баланс обновлен в состоянии:', newBalance);
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
    console.log('💰 topUpBalance вызван с суммой:', amount);
    console.log('💰 Текущий баланс:', balance);
    console.log('💰 Тип amount:', typeof amount);
    console.log('💰 Тип balance:', typeof balance);
    
    const newBalance = balance + amount;
    console.log('💰 Новый баланс будет:', newBalance);
    
    // Сначала обновляем состояние
    setBalance(newBalance);
    console.log('💰 Баланс обновлен в состоянии:', newBalance);
    
    // Затем сохраняем в AsyncStorage
    await AsyncStorage.setItem(balanceKey, newBalance.toString());
    console.log('💰 Баланс сохранен в AsyncStorage');
    
    await addTransaction({
      type: 'topup',
      amount: amount,
      description: `TopUp ${amount} AFc`,
      translationKey: 'driver.balance.transactions.topup',
      translationParams: { amount: amount.toString() },
    });
    
    console.log('💰 Транзакция добавлена');
    
    // Принудительно перезагружаем баланс для синхронизации
    setTimeout(() => {
      loadBalance();
    }, 100);
  };

  const addEarnings = async (amount: number) => {
    console.log('💵 addEarnings вызван с суммой:', amount);
    console.log('💵 Текущий баланс:', balance);
    console.log('💵 Текущие заработки:', earnings);
    
    const newBalance = balance + amount;
    const newEarnings = earnings + amount;
    
    console.log('💵 Новый баланс будет:', newBalance);
    console.log('💵 Новые заработки будут:', newEarnings);
    
    // Обновляем состояние
    setBalance(newBalance);
    setEarnings(newEarnings);
    
    // Сохраняем в AsyncStorage
    console.log('💾 Сохраняем в AsyncStorage - balance:', newBalance, 'earnings:', newEarnings);
    await AsyncStorage.setItem(balanceKey, newBalance.toString());
    await AsyncStorage.setItem(earningsKey, newEarnings.toString());
    console.log('💾 Сохранено в AsyncStorage');
    
    await addTransaction({
      type: 'payment',
      amount: amount,
      description: `Earnings ${amount} AFc`,
      translationKey: 'driver.balance.transactions.earnings',
      translationParams: { amount: amount.toString() },
    });
    
    console.log('💵 Заработки добавлены');
    console.log('💵 Состояние обновлено - баланс:', newBalance, 'earnings:', newEarnings);
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

  const resetBalance = async () => {
    try {
      console.log('🔄 Сброс баланса...');
      
      // Обнуляем баланс
      setBalance(0);
      await AsyncStorage.setItem(balanceKey, '0');
      
      // Очищаем транзакции
      setTransactions([]);
      await AsyncStorage.setItem(transactionsKey, JSON.stringify([]));
      
      // Обнуляем заработки тоже
      setEarnings(0);
      await AsyncStorage.setItem(earningsKey, '0');
      
      console.log('✅ Баланс и earnings успешно сброшены');
    } catch (error) {
      console.error('❌ Ошибка при сбросе баланса:', error);
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
    loadBalance, // Экспортируем для принудительного обновления
    loadEarnings, // Экспортируем для принудительного обновления
    resetBalance,
  };
}; 