import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { PaymentService } from '../datasources/grpc/PaymentService';
import { Payment, Balance, CreatePaymentData, PaginationParams, PaginatedResponse } from '../../shared/types';
import { validatePaymentId, validateUserId, validateAmount, validatePaymentMethod, validateDescription, validatePaymentData, validatePaginationParams, validateRefundData } from '../../shared/utils/paymentValidators';

export class PaymentRepository implements IPaymentRepository {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  async getPayment(id: string): Promise<Payment> {
    try {
      validatePaymentId(id);
      return await this.paymentService.getPayment(id);
    } catch (error) {
      throw new Error(`Failed to get payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createPayment(paymentData: CreatePaymentData): Promise<Payment> {
    try {
      validatePaymentData(paymentData);
      return await this.paymentService.createPayment(paymentData);
    } catch (error) {
      throw new Error(`Failed to create payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    try {
      validatePaymentId(id);
      return await this.paymentService.updatePayment(id, updates);
    } catch (error) {
      throw new Error(`Failed to update payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPayments(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    try {
      validateUserId(userId);
      if (params) validatePaginationParams(params);
      return await this.paymentService.getPayments(userId, params);
    } catch (error) {
      throw new Error(`Failed to get payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTransactionHistory(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    try {
      validateUserId(userId);
      if (params) validatePaginationParams(params);
      return await this.paymentService.getTransactionHistory(userId, params);
    } catch (error) {
      throw new Error(`Failed to get transaction history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getBalance(userId: string): Promise<Balance> {
    try {
      validateUserId(userId);
      return await this.paymentService.getBalance(userId);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async topUpBalance(userId: string, amount: number, method: string): Promise<Payment> {
    try {
      validateUserId(userId);
      validateAmount(amount);
      validatePaymentMethod(method);
      const isValidMethod = await this.validatePaymentMethod(method);
      if (!isValidMethod) {
        throw new Error('Invalid payment method');
      }
      return await this.paymentService.topUpBalance(userId, amount, method);
    } catch (error) {
      throw new Error(`Failed to top up balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async withdrawFromBalance(userId: string, amount: number, description: string): Promise<Payment> {
    try {
      validateUserId(userId);
      validateAmount(amount);
      validateDescription(description);
      const hasSufficient = await this.hasSufficientBalance(userId, amount);
      if (!hasSufficient) {
        throw new Error('Insufficient balance');
      }
      return await this.paymentService.withdrawFromBalance(userId, amount, description);
    } catch (error) {
      throw new Error(`Failed to withdraw from balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processPayment(paymentId: string): Promise<Payment> {
    try {
      validatePaymentId(paymentId);
      const payment = await this.getPayment(paymentId);
      if (payment.status !== 'pending') {
        throw new Error('Payment cannot be processed');
      }
      return await this.paymentService.processPayment(paymentId);
    } catch (error) {
      throw new Error(`Failed to process payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async refundPayment(paymentId: string, amount: number, reason: string): Promise<Payment> {
    try {
      validatePaymentId(paymentId);
      validateRefundData(amount, reason);
      const canRefund = await this.canProcessRefund(paymentId);
      if (!canRefund) {
        throw new Error('Payment cannot be refunded');
      }
      return await this.paymentService.refundPayment(paymentId, amount, reason);
    } catch (error) {
      throw new Error(`Failed to refund payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<Payment> {
    try {
      validatePaymentId(paymentId);
      return await this.paymentService.checkPaymentStatus(paymentId);
    } catch (error) {
      throw new Error(`Failed to check payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPaymentMethods(): Promise<string[]> {
    try {
      return await this.paymentService.getPaymentMethods();
    } catch (error) {
      throw new Error(`Failed to get payment methods: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validatePaymentMethod(method: string): Promise<boolean> {
    try {
      // Get available payment methods
      const availableMethods = await this.getPaymentMethods();
      return availableMethods.includes(method);
    } catch (error) {
      return false;
    }
  }


  async canProcessRefund(paymentId: string): Promise<boolean> {
    try {
      // Get payment
      const payment = await this.getPayment(paymentId);
      
      // Check if payment can be refunded
      return payment.status === 'completed' && payment.type !== 'refund';
    } catch (error) {
      return false;
    }
  }

  async hasSufficientBalance(userId: string, amount: number): Promise<boolean> {
    try {
      // Get user balance
      const balance = await this.getBalance(userId);
      
      // Check if balance is sufficient
      return balance.amount >= amount;
    } catch (error) {
      return false;
    }
  }

  // Helper methods
  async getPaymentsByType(userId: string, type: string): Promise<Payment[]> {
    try {
      const result = await this.getPayments(userId, { limit: 100 });
      return result.data.filter(payment => payment.type === type);
    } catch (error) {
      return [];
    }
  }

  async getPaymentsByDateRange(userId: string, startDate: string, endDate: string): Promise<Payment[]> {
    try {
      const result = await this.getPayments(userId, { limit: 100 });
      return result.data.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return paymentDate >= start && paymentDate <= end;
      });
    } catch (error) {
      return [];
    }
  }
}
