export interface Transaction {
  id: string;
  type: 'payment' | 'topup' | 'refund' | 'withdrawal';
  amount: string;
  description: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface BalanceData {
  currentBalance: string;
  totalSpent: string;
  totalEarned: string;
  transactions: Transaction[];
}

export interface TopUpMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface WithdrawalMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  minAmount: number;
  maxAmount: number;
} 