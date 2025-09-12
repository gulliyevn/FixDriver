import { useCallback } from 'react';
import { Transaction } from '../useBalance';
import { balanceOperations } from '../../../domain/usecases/balance/balanceOperations';

interface UseBalanceActionsProps {
  userId: string;
  setBalance: (balance: number) => void;
  setEarnings: (earnings: number) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Hook for balance operations (add, withdraw, reset)
 */
export const useBalanceActions = ({
  userId,
  setBalance,
  setEarnings,
  setTransactions,
  setIsLoading,
  setError,
}: UseBalanceActionsProps) => {
  /**
   * Add earnings to balance
   */
  const addEarnings = useCallback(async (amount: number): Promise<{ newBalance: number; newEarnings: number; transactions: Transaction[] }> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await balanceOperations.addEarnings(userId, amount);
      
      // Get updated data
      const newBalance = await balanceOperations.getBalance(userId);
      const newEarnings = await balanceOperations.getEarnings(userId);
      const transactions = await balanceOperations.getTransactions(userId);
      
      setBalance(newBalance);
      setEarnings(newEarnings);
      setTransactions(transactions);
      
      const result = { newBalance, newEarnings, transactions };
      console.log('Earnings added:', amount, 'New balance:', newBalance);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add earnings';
      setError(errorMessage);
      console.error('Error adding earnings:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, setBalance, setEarnings, setTransactions, setIsLoading, setError]);

  /**
   * Top up balance
   */
  const topUpBalance = useCallback(async (amount: number): Promise<{ newBalance: number; transactions: Transaction[] }> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await balanceOperations.topUpBalance(userId, amount);
      
      // Get updated data
      const newBalance = await balanceOperations.getBalance(userId);
      const transactions = await balanceOperations.getTransactions(userId);
      
      setBalance(newBalance);
      setTransactions(transactions);
      
      const result = { newBalance, transactions };
      console.log('Balance topped up:', amount, 'New balance:', newBalance);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to top up balance';
      setError(errorMessage);
      console.error('Error topping up balance:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, setBalance, setTransactions, setIsLoading, setError]);

  /**
   * Withdraw from balance
   */
  const withdrawBalance = useCallback(async (amount: number): Promise<{ success: boolean; newBalance?: number; transactions?: Transaction[] }> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const currentBalance = await balanceOperations.getBalance(userId);
      const success = currentBalance >= amount;
      
      if (success) {
        await balanceOperations.withdrawBalance(userId, amount);
        const newBalance = await balanceOperations.getBalance(userId);
        const transactions = await balanceOperations.getTransactions(userId);
        
        setBalance(newBalance);
        setTransactions(transactions);
        
        const result = { success: true, newBalance, transactions };
        console.log('Balance withdrawal:', amount, 'Success:', true);
        return result;
      } else {
        const result = { success: false };
        console.log('Balance withdrawal:', amount, 'Success:', false);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw balance';
      setError(errorMessage);
      console.error('Error withdrawing balance:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, setBalance, setTransactions, setIsLoading, setError]);

  /**
   * Reset balance to zero
   */
  const resetBalance = useCallback(async (): Promise<void> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await balanceOperations.resetBalance(userId);
      
      setBalance(0);
      setEarnings(0);
      setTransactions([]);
      
      console.log('Balance reset');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset balance';
      setError(errorMessage);
      console.error('Error resetting balance:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, setBalance, setEarnings, setTransactions, setIsLoading, setError]);

  /**
   * Reset earnings to zero
   */
  const resetEarnings = useCallback(async (): Promise<void> => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await balanceOperations.resetEarnings(userId);
      
      setEarnings(0);
      
      console.log('Earnings reset');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset earnings';
      setError(errorMessage);
      console.error('Error resetting earnings:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId, setEarnings, setIsLoading, setError]);

  return {
    addEarnings,
    topUpBalance,
    withdrawBalance,
    resetBalance,
    resetEarnings,
  };
};
