import { useCallback } from 'react';
import { useDriverBalanceStorage } from './useDriverBalanceStorage';
import { useDriverBalanceTransactions } from './useDriverBalanceTransactions';

/**
 * Hook for driver balance operations (topUp, addEarnings, withdraw)
 */
export const useDriverBalanceOperations = () => {
  const { saveBalance, saveEarnings } = useDriverBalanceStorage();
  const { 
    addTransaction, 
    createTopUpTransaction, 
    createEarningsTransaction, 
    createWithdrawalTransaction 
  } = useDriverBalanceTransactions();

  const topUpBalance = useCallback(async (
    amount: number,
    currentBalance: number,
    currentTransactions: any[]
  ): Promise<{ newBalance: number; newTransactions: any[] }> => {
    const newBalance = currentBalance + amount;
    
    // Save balance
    await saveBalance(newBalance);
    
    // Add transaction
    const topUpTransaction = createTopUpTransaction(amount);
    const newTransactions = await addTransaction(topUpTransaction, currentTransactions);
    
    return { newBalance, newTransactions };
  }, [saveBalance, addTransaction, createTopUpTransaction]);

  const addEarnings = useCallback(async (
    amount: number,
    currentBalance: number,
    currentEarnings: number,
    currentTransactions: any[]
  ): Promise<{ newBalance: number; newEarnings: number; newTransactions: any[] }> => {
    const newBalance = currentBalance + amount;
    const newEarnings = currentEarnings + amount;
    
    // Save balance and earnings
    await saveBalance(newBalance);
    await saveEarnings(newEarnings);
    
    // Add transaction
    const earningsTransaction = createEarningsTransaction(amount);
    const newTransactions = await addTransaction(earningsTransaction, currentTransactions);
    
    return { newBalance, newEarnings, newTransactions };
  }, [saveBalance, saveEarnings, addTransaction, createEarningsTransaction]);

  const withdrawBalance = useCallback(async (
    amount: number,
    currentBalance: number,
    currentTransactions: any[]
  ): Promise<{ success: boolean; newBalance?: number; newTransactions?: any[] }> => {
    if (currentBalance < amount) {
      return { success: false };
    }

    const newBalance = currentBalance - amount;
    
    // Save balance
    await saveBalance(newBalance);
    
    // Add transaction
    const withdrawalTransaction = createWithdrawalTransaction(amount);
    const newTransactions = await addTransaction(withdrawalTransaction, currentTransactions);
    
    return { success: true, newBalance, newTransactions };
  }, [saveBalance, addTransaction, createWithdrawalTransaction]);

  return {
    topUpBalance,
    addEarnings,
    withdrawBalance,
  };
};
