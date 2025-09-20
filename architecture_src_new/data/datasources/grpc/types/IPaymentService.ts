import { Payment, Balance, CreatePaymentData, PaginationParams, PaginatedResponse } from '../../../../shared/types';

export interface IPaymentService {
  /**
   * Get user payments
   */
  getPayments(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>>;

  /**
   * Get payment by ID
   */
  getPayment(id: string): Promise<Payment>;

  /**
   * Create payment
   */
  createPayment(paymentData: CreatePaymentData): Promise<Payment>;

  /**
   * Get user balance
   */
  getBalance(userId: string): Promise<Balance>;

  /**
   * Top up balance
   */
  topUpBalance(userId: string, amount: number, method: string): Promise<Payment>;

  /**
   * Withdraw from balance
   */
  withdrawFromBalance(userId: string, amount: number, description: string): Promise<Payment>;

  /**
   * Refund payment
   */
  refundPayment(paymentId: string, amount: number, reason: string): Promise<Payment>;

  /**
   * Get transaction history
   */
  getTransactionHistory(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>>;

  /**
   * Check payment status
   */
  checkPaymentStatus(paymentId: string): Promise<Payment>;

  /**
   * Get available payment methods
   */
  getPaymentMethods(): Promise<string[]>;
}
