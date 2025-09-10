import { DriverTransaction } from '../../../shared/hooks/driver/useDriverBalance';
import { DRIVER_BALANCE_CONSTANTS } from '../../../shared/constants/driverBalanceConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserStorageKey, STORAGE_KEYS } from '../../../shared/utils/storageKeys';

/**
 * Domain usecase for driver balance operations
 * Abstracts data layer access from presentation layer
 */
export const driverBalanceOperations = {
  /**
   * Load balance from storage
   */
  async loadBalance(): Promise<number> {
    try {
      const balanceKey = getUserStorageKey(STORAGE_KEYS.DRIVER_BALANCE);
      const savedBalance = await AsyncStorage.getItem(balanceKey);
      return savedBalance !== null ? parseFloat(savedBalance) : DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_BALANCE;
    } catch (error) {
      console.error('Error loading driver balance:', error);
      return DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_BALANCE;
    }
  },

  /**
   * Save balance to storage
   */
  async saveBalance(balance: number): Promise<void> {
    try {
      const balanceKey = getUserStorageKey(STORAGE_KEYS.DRIVER_BALANCE);
      await AsyncStorage.setItem(balanceKey, balance.toString());
    } catch (error) {
      console.error('Error saving driver balance:', error);
      throw error;
    }
  },

  /**
   * Load earnings from storage
   */
  async loadEarnings(): Promise<number> {
    try {
      const earningsKey = getUserStorageKey(STORAGE_KEYS.DRIVER_EARNINGS);
      const savedEarnings = await AsyncStorage.getItem(earningsKey);
      return savedEarnings !== null ? parseFloat(savedEarnings) : DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_EARNINGS;
    } catch (error) {
      console.error('Error loading driver earnings:', error);
      return DRIVER_BALANCE_CONSTANTS.DEFAULTS.INITIAL_EARNINGS;
    }
  },

  /**
   * Save earnings to storage
   */
  async saveEarnings(earnings: number): Promise<void> {
    try {
      const earningsKey = getUserStorageKey(STORAGE_KEYS.DRIVER_EARNINGS);
      await AsyncStorage.setItem(earningsKey, earnings.toString());
    } catch (error) {
      console.error('Error saving driver earnings:', error);
      throw error;
    }
  },

  /**
   * Load transactions from storage
   */
  async loadTransactions(): Promise<DriverTransaction[]> {
    try {
      const transactionsKey = getUserStorageKey(STORAGE_KEYS.DRIVER_TRANSACTIONS);
      const savedTransactions = await AsyncStorage.getItem(transactionsKey);
      return savedTransactions !== null ? JSON.parse(savedTransactions) : [];
    } catch (error) {
      console.error('Error loading driver transactions:', error);
      return [];
    }
  },

  /**
   * Save transactions to storage
   */
  async saveTransactions(transactions: DriverTransaction[]): Promise<void> {
    try {
      const transactionsKey = getUserStorageKey(STORAGE_KEYS.DRIVER_TRANSACTIONS);
      await AsyncStorage.setItem(transactionsKey, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving driver transactions:', error);
      throw error;
    }
  },

  /**
   * Clear all balance data
   */
  async clearAllData(): Promise<void> {
    try {
      const balanceKey = getUserStorageKey(STORAGE_KEYS.DRIVER_BALANCE);
      const transactionsKey = getUserStorageKey(STORAGE_KEYS.DRIVER_TRANSACTIONS);
      const earningsKey = getUserStorageKey(STORAGE_KEYS.DRIVER_EARNINGS);
      
      await AsyncStorage.setItem(balanceKey, '0');
      await AsyncStorage.setItem(transactionsKey, JSON.stringify([]));
      await AsyncStorage.setItem(earningsKey, '0');
    } catch (error) {
      console.error('Error clearing driver balance data:', error);
      throw error;
    }
  }
};
