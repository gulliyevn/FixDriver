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
      
      const result = await balanceOperations.addEarnings(userId, amount);
      
      setBalance(result.newBalance);
      setEarnings(result.newEarnings);
      setTransactions(result.transactions);
      
      console.log('Earnings added:', amount, 'New balance:', result.newBalance);
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
      
      const result = await balanceOperations.topUpBalance(userId, amount);
      
      setBalance(result.newBalance);
      setTransactions(result.transactions);
      
      console.log('Balance topped up:', amount, 'New balance:', result.newBalance);
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
      
      const result = await balanceOperations.withdrawBalance(userId, amount);
      
      if (result.success && result.newBalance !== undefined) {
        setBalance(result.newBalance);
        if (result.transactions) {
          setTransactions(result.transactions);
        }
      }
      
      console.log('Balance withdrawal:', amount, 'Success:', result.success);
      return result;
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
