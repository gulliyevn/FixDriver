/**
 * Payment types
 * TypeScript interfaces for payment history operations
 */

export interface Payment {
  id: string;
  title: string;
  description?: string;
  amount: string;
  type: 'trip' | 'topup' | 'refund' | 'fee';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  transactionId?: string;
  currency?: string;
  category?: string;
}

export interface PaymentHistoryRequest {
  userId: string;
  role?: 'client' | 'driver';
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'amount' | 'date';
  sortOrder?: 'asc' | 'desc';
  dateRange?: {
    start: string;
    end: string;
  };
  types?: ('trip' | 'topup' | 'refund' | 'fee')[];
  status?: ('completed' | 'pending' | 'failed')[];
}

export interface PaymentHistoryResponse {
  payments: Payment[];
  totalCount: number;
  hasMore: boolean;
  totalAmount?: number;
  period?: {
    start: string;
    end: string;
  };
}

export interface ExportPaymentHistoryRequest {
  userId: string;
  format: 'csv' | 'pdf';
  dateRange: {
    start: string;
    end: string;
  };
  includeDetails?: boolean;
}

export interface PaymentStatistics {
  totalAmount: number;
  transactionCount: number;
  averageAmount: number;
  topCategories: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
  periodComparison?: {
    previousPeriod: number;
    changePercentage: number;
  };
}
