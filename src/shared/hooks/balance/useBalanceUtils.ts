import { useCallback } from 'react';

/**
 * Hook for balance utility functions
 */
export const useBalanceUtils = () => {
  /**
   * Check if user has sufficient balance
   */
  const hasSufficientBalance = useCallback((balance: number, amount: number): boolean => {
    return balance >= amount;
  }, []);

  /**
   * Format balance amount
   */
  const formatBalance = useCallback((amount: number): string => {
    return `${amount.toFixed(2)} AFc`;
  }, []);

  /**
   * Format earnings amount
   */
  const formatEarnings = useCallback((amount: number): string => {
    return `${amount.toFixed(2)} AFc`;
  }, []);

  /**
   * Format currency amount with custom precision
   */
  const formatCurrency = useCallback((amount: number, precision: number = 2): string => {
    return `${amount.toFixed(precision)} AFc`;
  }, []);

  /**
   * Parse balance string to number
   */
  const parseBalance = useCallback((balanceString: string): number => {
    const cleaned = balanceString.replace(/[^\d.-]/g, '');
    return parseFloat(cleaned) || 0;
  }, []);

  /**
   * Validate balance amount
   */
  const validateBalanceAmount = useCallback((amount: number): { isValid: boolean; error?: string } => {
    if (amount < 0) {
      return { isValid: false, error: 'Amount cannot be negative' };
    }
    if (amount === 0) {
      return { isValid: false, error: 'Amount must be greater than zero' };
    }
    if (amount > 1000000) {
      return { isValid: false, error: 'Amount too large' };
    }
    return { isValid: true };
  }, []);

  return {
    hasSufficientBalance,
    formatBalance,
    formatEarnings,
    formatCurrency,
    parseBalance,
    validateBalanceAmount,
  };
};
