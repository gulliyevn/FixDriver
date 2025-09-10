import { useCallback } from 'react';
import { DriverTransaction } from './useDriverBalance';
import { driverBalanceOperations } from '../../../domain/usecases/driver/driverBalanceOperations';
import { DRIVER_BALANCE_CONSTANTS } from '../../constants/driverBalanceConstants';

/**
 * Hook for driver balance transactions management
 */
export const useDriverBalanceTransactions = () => {
  const loadTransactions = useCallback(async (): Promise<DriverTransaction[]> => {
    return driverBalanceOperations.loadTransactions();
  }, []);

  const saveTransactions = useCallback(async (transactions: DriverTransaction[]): Promise<void> => {
    return driverBalanceOperations.saveTransactions(transactions);
  }, []);

  const addTransaction = useCallback(async (
    transaction: Omit<DriverTransaction, 'id' | 'date'>,
    existingTransactions: DriverTransaction[]
  ): Promise<DriverTransaction[]> => {
    const newTransaction: DriverTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const updatedTransactions = [newTransaction, ...existingTransactions];
    await saveTransactions(updatedTransactions);
    return updatedTransactions;
  }, [saveTransactions]);

  const createTopUpTransaction = useCallback((amount: number): Omit<DriverTransaction, 'id' | 'date'> => {
    return {
      type: 'topup',
      amount: amount,
      description: DRIVER_BALANCE_CONSTANTS.TRANSACTION_DESCRIPTIONS.TOPUP(amount),
      translationKey: DRIVER_BALANCE_CONSTANTS.TRANSLATION_KEYS.TOPUP,
      translationParams: { amount: amount.toString() },
    };
  }, []);

  const createEarningsTransaction = useCallback((amount: number): Omit<DriverTransaction, 'id' | 'date'> => {
    return {
      type: 'payment',
      amount: amount,
      description: DRIVER_BALANCE_CONSTANTS.TRANSACTION_DESCRIPTIONS.EARNINGS(amount),
      translationKey: DRIVER_BALANCE_CONSTANTS.TRANSLATION_KEYS.EARNINGS,
      translationParams: { amount: amount.toString() },
    };
  }, []);

  const createWithdrawalTransaction = useCallback((amount: number): Omit<DriverTransaction, 'id' | 'date'> => {
    return {
      type: 'withdrawal',
      amount: -amount,
      description: DRIVER_BALANCE_CONSTANTS.TRANSACTION_DESCRIPTIONS.WITHDRAWAL(amount),
      translationKey: DRIVER_BALANCE_CONSTANTS.TRANSLATION_KEYS.WITHDRAWAL,
      translationParams: { amount: amount.toString() },
    };
  }, []);

  return {
    loadTransactions,
    saveTransactions,
    addTransaction,
    createTopUpTransaction,
    createEarningsTransaction,
    createWithdrawalTransaction,
  };
};
