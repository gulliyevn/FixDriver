/**
 * Balance and transactions domain types
 */

/**
 * Supported transaction types.
 */
export type TransactionType = 'payment' | 'topup' | 'refund' | 'withdrawal';

/**
 * Transaction processing status.
 */
export type TransactionStatus = 'completed' | 'pending' | 'failed';

/**
 * Single transaction record.
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: string;
  description: string;
  date: string;
  time: string;
  status: TransactionStatus;
}

/**
 * Aggregated balance data with transaction history.
 */
export interface BalanceData {
  currentBalance: string;
  totalSpent: string;
  totalEarned: string;
  transactions: Transaction[];
}

/**
 * Top up method option.
 */
export interface TopUpMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

/**
 * Withdrawal method option.
 */
export interface WithdrawalMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  minAmount: number;
  maxAmount: number;
} 