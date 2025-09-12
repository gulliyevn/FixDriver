/**
 * Balance context utilities
 * Utility functions for balance and transaction management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from './types';

/**
 * Get storage keys for user-specific data
 */
export const getStorageKeys = (userId: string | undefined) => {
  const userKey = userId || 'default';
  return {
    balance: `@balance_${userKey}`,
    earnings: `@earnings_${userKey}`,
    transactions: `@transactions_${userKey}`,
  };
};

/**
 * Load balance from AsyncStorage
 */
export const loadBalanceFromStorage = async (balanceKey: string): Promise<number> => {
  try {
    const savedBalance = await AsyncStorage.getItem(balanceKey);
    return savedBalance !== null ? parseFloat(savedBalance) : 0;
  } catch (error) {
    console.error('Error loading balance:', error);
    return 0;
  }
};

/**
 * Load earnings from AsyncStorage
 */
export const loadEarningsFromStorage = async (earningsKey: string): Promise<number> => {
  try {
    const savedEarnings = await AsyncStorage.getItem(earningsKey);
    return savedEarnings !== null ? parseFloat(savedEarnings) : 0;
  } catch (error) {
    console.error('Error loading earnings:', error);
    return 0;
  }
};

/**
 * Load transactions from AsyncStorage
 */
export const loadTransactionsFromStorage = async (transactionsKey: string): Promise<Transaction[]> => {
  try {
    const savedTransactions = await AsyncStorage.getItem(transactionsKey);
    return savedTransactions !== null ? JSON.parse(savedTransactions) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

/**
 * Save balance to AsyncStorage
 */
export const saveBalanceToStorage = async (balanceKey: string, balance: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(balanceKey, balance.toString());
  } catch (error) {
    console.error('Error saving balance:', error);
  }
};

/**
 * Save earnings to AsyncStorage
 */
export const saveEarningsToStorage = async (earningsKey: string, earnings: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(earningsKey, earnings.toString());
  } catch (error) {
    console.error('Error saving earnings:', error);
  }
};

/**
 * Save transactions to AsyncStorage
 */
export const saveTransactionsToStorage = async (transactionsKey: string, transactions: Transaction[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(transactionsKey, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

/**
 * Create a new transaction
 */
export const createTransaction = (
  type: Transaction['type'],
  amount: number,
  description: string
): Transaction => ({
  id: Date.now().toString(),
  type,
  amount,
  description,
  date: new Date().toISOString(),
});
