/**
 * Balance context types
 * Type definitions for balance and earnings management
 */

export interface Transaction {
  id: string;
  type: 'payment' | 'topup' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
}

export interface BalanceContextType {
  balance: number;
  earnings: number;
  transactions: Transaction[];
  addEarnings: (amount: number) => Promise<{ newBalance: number; newEarnings: number }>;
  topUpBalance: (amount: number) => Promise<void>;
  withdrawBalance: (amount: number) => Promise<boolean>;
  resetBalance: () => Promise<void>;
  resetEarnings: () => Promise<number>; // Reset only earnings, return old value
  loadBalance: () => Promise<void>;
  loadEarnings: () => Promise<void>;
}

export interface BalanceProviderProps {
  children: React.ReactNode;
}

export interface EarningsResult {
  newBalance: number;
  newEarnings: number;
}
