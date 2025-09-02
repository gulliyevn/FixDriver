import { IPaymentRepository } from '../../repositories/IPaymentRepository';
import { Payment, Balance, CreatePaymentData, PaginationParams, PaginatedResponse } from '../../../shared/types';

export class PaymentUseCase {
  private paymentRepository: IPaymentRepository;

  constructor(paymentRepository: IPaymentRepository) {
    this.paymentRepository = paymentRepository;
  }

  async getBalance(userId: string): Promise<Balance> {
    try {
      // Validate input
      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      return await this.paymentRepository.getBalance(userId);
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
      const isValidMethod = await this.paymentRepository.validatePaymentMethod(method);
      if (!isValidMethod) {
        throw new Error('Invalid payment method');
      }

      return await this.paymentRepository.topUpBalance(userId, amount, method);
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
      const hasSufficient = await this.paymentRepository.hasSufficientBalance(userId, amount);
      if (!hasSufficient) {
        throw new Error('Insufficient balance');
      }

      return await this.paymentRepository.withdrawFromBalance(userId, amount, description);
    } catch (error) {
      throw new Error(`Failed to withdraw from balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createPayment(paymentData: CreatePaymentData): Promise<Payment> {
    try {
      // Validate payment data
      const isValid = await this.paymentRepository.validatePaymentData(paymentData);
      if (!isValid) {
        throw new Error('Invalid payment data');
      }

      // Check balance for certain payment types
      if (paymentData.type === 'trip_payment') {
        const hasSufficient = await this.paymentRepository.hasSufficientBalance(paymentData.userId, paymentData.amount);
        if (!hasSufficient) {
          throw new Error('Insufficient balance for trip payment');
        }
      }

      return await this.paymentRepository.createPayment(paymentData);
    } catch (error) {
      throw new Error(`Failed to create payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async processPayment(paymentId: string): Promise<Payment> {
    try {
      // Validate input
      if (!paymentId || paymentId.trim() === '') {
        throw new Error('Payment ID is required');
      }

      return await this.paymentRepository.processPayment(paymentId);
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
      const canRefund = await this.paymentRepository.canProcessRefund(paymentId);
      if (!canRefund) {
        throw new Error('Payment cannot be refunded');
      }

      return await this.paymentRepository.refundPayment(paymentId, amount, reason);
    } catch (error) {
      throw new Error(`Failed to refund payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPayment(id: string): Promise<Payment> {
    try {
      // Validate input
      if (!id || id.trim() === '') {
        throw new Error('Payment ID is required');
      }

      return await this.paymentRepository.getPayment(id);
    } catch (error) {
      throw new Error(`Failed to get payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

      return await this.paymentRepository.getPayments(userId, params);
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

      return await this.paymentRepository.getTransactionHistory(userId, params);
    } catch (error) {
      throw new Error(`Failed to get transaction history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<Payment> {
    try {
      // Validate input
      if (!paymentId || paymentId.trim() === '') {
        throw new Error('Payment ID is required');
      }

      return await this.paymentRepository.checkPaymentStatus(paymentId);
    } catch (error) {
      throw new Error(`Failed to check payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPaymentMethods(): Promise<string[]> {
    try {
      return await this.paymentRepository.getPaymentMethods();
    } catch (error) {
      throw new Error(`Failed to get payment methods: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper methods
  async getPaymentsByType(userId: string, type: string): Promise<Payment[]> {
    try {
      return await this.paymentRepository.getPaymentsByType(userId, type);
    } catch (error) {
      return [];
    }
  }

  async getPaymentsByDateRange(userId: string, startDate: string, endDate: string): Promise<Payment[]> {
    try {
      return await this.paymentRepository.getPaymentsByDateRange(userId, startDate, endDate);
    } catch (error) {
      return [];
    }
  }

  async hasSufficientBalance(userId: string, amount: number): Promise<boolean> {
    try {
      return await this.paymentRepository.hasSufficientBalance(userId, amount);
    } catch (error) {
      return false;
    }
  }

  async validatePaymentMethod(method: string): Promise<boolean> {
    try {
      return await this.paymentRepository.validatePaymentMethod(method);
    } catch (error) {
      return false;
    }
  }

  async canProcessRefund(paymentId: string): Promise<boolean> {
    try {
      return await this.paymentRepository.canProcessRefund(paymentId);
    } catch (error) {
      return false;
    }
  }

  // Business logic methods
  async processTripPayment(userId: string, orderId: string, amount: number): Promise<Payment> {
    try {
      // Check if user has sufficient balance
      const hasSufficient = await this.hasSufficientBalance(userId, amount);
      if (!hasSufficient) {
        throw new Error('Insufficient balance for trip payment');
      }

      // Create payment data
      const paymentData: CreatePaymentData = {
        userId,
        type: 'trip_payment',
        amount,
        description: `Payment for order ${orderId}`,
        metadata: {
          orderId,
          paymentMethod: 'balance'
        }
      };

      return await this.createPayment(paymentData);
    } catch (error) {
      throw new Error(`Failed to process trip payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getBalanceSummary(userId: string): Promise<{
    currentBalance: number;
    totalSpent: number;
    totalEarned: number;
    recentTransactions: Payment[];
  }> {
    try {
      const balance = await this.getBalance(userId);
      const recentPayments = await this.getPayments(userId, { limit: 10 });

      const totalSpent = recentPayments.data
        .filter(p => p.type === 'trip_payment' || p.type === 'withdrawal')
        .reduce((sum, p) => sum + p.amount, 0);

      const totalEarned = recentPayments.data
        .filter(p => p.type === 'top_up' || p.type === 'bonus')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        currentBalance: balance.amount,
        totalSpent,
        totalEarned,
        recentTransactions: recentPayments.data
      };
    } catch (error) {
      throw new Error(`Failed to get balance summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
