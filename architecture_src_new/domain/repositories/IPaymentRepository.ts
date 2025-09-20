import { Payment, Balance, CreatePaymentData, PaginationParams, PaginatedResponse } from '../../shared/types';

export interface IPaymentRepository {
  // Payment CRUD operations
  getPayment(id: string): Promise<Payment>;
  createPayment(paymentData: CreatePaymentData): Promise<Payment>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment>;
  
  // Payment listing and history
  getPayments(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>>;
  getTransactionHistory(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>>;
  
  // Balance management
  getBalance(userId: string): Promise<Balance>;
  topUpBalance(userId: string, amount: number, method: string): Promise<Payment>;
  withdrawFromBalance(userId: string, amount: number, description: string): Promise<Payment>;
  
  // Payment processing
  processPayment(paymentId: string): Promise<Payment>;
  refundPayment(paymentId: string, amount: number, reason: string): Promise<Payment>;
  checkPaymentStatus(paymentId: string): Promise<Payment>;
  
  // Payment methods
  getPaymentMethods(): Promise<string[]>;
  validatePaymentMethod(method: string): Promise<boolean>;
  
  // Payment validation
  canProcessRefund(paymentId: string): Promise<boolean>;
  hasSufficientBalance(userId: string, amount: number): Promise<boolean>;
  
  // Helper methods
  getPaymentsByType(userId: string, type: string): Promise<Payment[]>;
  getPaymentsByDateRange(userId: string, startDate: string, endDate: string): Promise<Payment[]>;
}
