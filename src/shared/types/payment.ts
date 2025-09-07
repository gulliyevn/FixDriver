/**
 * Payment and balance domain types
 */

/**
 * Payment lifecycle status.
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

/**
 * Payment categories.
 */
export type PaymentType = 'top_up' | 'trip_payment' | 'refund' | 'bonus' | 'withdrawal';

export interface Payment {
  id: string;
  userId: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  failedAt?: string;
  refundedAt?: string;
  metadata?: Record<string, any>;
}

export interface Balance {
  userId: string;
  amount: number;
  currency: string;
  lastUpdated: string;
}

export interface CreatePaymentData {
  userId: string;
  type: PaymentType;
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  payment?: Payment;
  payments?: Payment[];
  balance?: Balance;
  error?: string;
}
