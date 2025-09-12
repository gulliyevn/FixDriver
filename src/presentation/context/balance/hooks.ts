/**
 * Balance context hooks
 * Custom hooks for balance functionality
 */

import { useContext } from 'react';
import { BalanceContext } from './BalanceContext';
import { BalanceContextType } from './types';

export const useBalanceContext = (): BalanceContextType => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalanceContext must be used within a BalanceProvider');
  }
  return context;
};
