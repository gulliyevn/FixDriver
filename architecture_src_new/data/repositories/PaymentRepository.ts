import { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
import { PaymentServiceStub } from '../datasources/grpc/stubs/PaymentServiceStub';
import { Payment, Balance, CreatePaymentData, PaginationParams, PaginatedResponse } from '../../shared/types';

export class PaymentRepository implements IPaymentRepository {
  private paymentService: PaymentServiceStub;

  constructor() {
    this.paymentService = new PaymentServiceStub();
  }

  async getPayment(id: string): Promise<Payment> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('Payment ID is required');
      }

      // Call service
      return await this.paymentService.getPayment(id);
    } catch (error) {
      throw new Error(`Failed to get payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createPayment(paymentData: CreatePaymentData): Promise<Payment> {
    try {
      // Validate payment data
      const isValid = await this.validatePaymentData(paymentData);
      if (!isValid) {
        throw new Error('Invalid payment data');
      }

      // Call service
      return await this.paymentService.createPayment(paymentData);
    } catch (error) {
      throw new Error(`Failed to create payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('Payment ID is required');
      }

      // Call service
      return await this.paymentService.getPayment(id); // Assuming update is not implemented in stub
    } catch (error) {
      throw new Error(`Failed to update payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPayments(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    try {
      // Validate input
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      // Validate pagination params
      if (params) {
        if (params.page && params.page < 1) {
          throw new Error('Page number must be greater than 0');
        }
        if (params.limit && (params.limit < 1 || params.limit > 100)) {
          throw new Error('Limit must be between 1 and 100');
        }
      }

      // Call service
      return await this.paymentService.getPayments(userId, params);
    } catch (error) {
      throw new Error(`Failed to get payments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTransactionHistory(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    try {
      // Validate input
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      // Call service
      return await this.paymentService.getTransactionHistory(userId, params);
    } catch (error) {
      throw new Error(`Failed to get transaction history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getBalance(userId: string): Promise<Balance> {
    try {
      // Validate input
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      // Call service
      return await this.paymentService.getBalance(userId);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async topUpBalance(userId: string, amount: number, method: string): Promise<Payment> {
    try {
      // Validate input
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      if (!amount || amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (!method || method.trim() === '') {
        throw new Error('Payment method is required');
      }

      // Validate payment method
      const isValidMethod = await this.validatePaymentMethod(method);
      if (!isValidMethod) {
        throw new Error('Invalid payment method');
      }

      // Call service
      return await this.paymentService.topUpBalance(userId, amount, method);
    } catch (error) {
      throw new Error(`Failed to top up balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async withdrawFromBalance(userId: string, amount: number, description: string): Promise<Payment> {
    try {
      // Validate input
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      if (!amount || amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      if (!description || description.trim() === '') {
        throw new Error('Description is required');
      }

      // Check if user has sufficient balance
      const hasSufficient = await this.hasSufficientBalance(userId, amount);
      if (!hasSufficient) {
        throw new Error('Insufficient balance');
      }

      // Call service
      return await this.paymentService.withdrawFromBalance(userId, amount, description);
    } catch (error) {
      throw new Error(`Failed to withdraw from balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processPayment(paymentId: string): Promise<Payment> {
    try {
      // Validate input
      if (!paymentId || paymentId.trim() === '') {
        throw new Error('Payment ID is required');
      }

      // Get payment
      const payment = await this.getPayment(paymentId);
      
      // Check if payment can be processed
      if (payment.status !== 'pending') {
        throw new Error('Payment cannot be processed');
      }

      // For now, we'll just return the payment as completed
      // In real implementation, this would call payment processor
      return payment;
    } catch (error) {
      throw new Error(`Failed to process payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async refundPayment(paymentId: string, amount: number, reason: string): Promise<Payment> {
    try {
      // Validate input
      if (!paymentId || paymentId.trim() === '') {
        throw new Error('Payment ID is required');
      }

      if (!amount || amount <= 0) {
        throw new Error('Refund amount must be greater than 0');
      }

      if (!reason || reason.trim() === '') {
        throw new Error('Refund reason is required');
      }

      // Check if refund can be processed
      const canRefund = await this.canProcessRefund(paymentId);
      if (!canRefund) {
        throw new Error('Payment cannot be refunded');
      }

      // Call service
      return await this.paymentService.refundPayment(paymentId, amount, reason);
    } catch (error) {
      throw new Error(`Failed to refund payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<Payment> {
    try {
      // Validate input
      if (!paymentId || paymentId.trim() === '') {
        throw new Error('Payment ID is required');
      }

      // Call service
      return await this.paymentService.checkPaymentStatus(paymentId);
    } catch (error) {
      throw new Error(`Failed to check payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPaymentMethods(): Promise<string[]> {
    try {
      // Call service
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

  async validatePaymentData(paymentData: CreatePaymentData): Promise<boolean> {
    try {
      // Validate required fields
      if (!paymentData.userId || paymentData.userId.trim() === '') {
        return false;
      }

      if (!paymentData.type) {
        return false;
      }

      if (!paymentData.amount || paymentData.amount <= 0) {
        return false;
      }

      if (!paymentData.description || paymentData.description.trim() === '') {
        return false;
      }

      // Validate payment type
      const validTypes = ['top_up', 'trip_payment', 'refund', 'bonus'];
      if (!validTypes.includes(paymentData.type)) {
        return false;
      }

      return true;
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
