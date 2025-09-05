import { IPaymentService } from '../types/IPaymentService';
import { Payment, Balance, CreatePaymentData, PaginationParams, PaginatedResponse } from '../../../../shared/types';

// Simulate network delay
const simulateNetworkDelay = (min: number = 200, max: number = 600): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export class PaymentServiceStub implements IPaymentService {
  private payments = new Map<string, Payment>();
  private balances = new Map<string, Balance>();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with empty data - will be populated dynamically
    // This removes hardcoded data and makes the service more flexible
    console.log('PaymentServiceStub initialized with empty data');
  }

  async getPayments(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    await simulateNetworkDelay();

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = params?.offset || (page - 1) * limit;

    const userPayments = Array.from(this.payments.values()).filter(payment => payment.userId === userId);

    const total = userPayments.length;
    const data = userPayments.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async getPayment(id: string): Promise<Payment> {
    await simulateNetworkDelay();

    const payment = this.payments.get(id);
    if (!payment) {
      throw new Error(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async createPayment(paymentData: CreatePaymentData): Promise<Payment> {
    await simulateNetworkDelay();

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      userId: paymentData.userId,
      type: paymentData.type,
      amount: paymentData.amount,
      status: 'pending',
      description: paymentData.description,
      metadata: paymentData.metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.payments.set(newPayment.id, newPayment);

    // Update balance if it's a top-up
    if (paymentData.type === 'top_up') {
      await this.updateBalance(paymentData.userId, paymentData.amount);
    }

    return newPayment;
  }

  async getBalance(userId: string): Promise<Balance> {
    await simulateNetworkDelay();

    const balance = this.balances.get(userId);
    if (!balance) {
      // Create default balance if not exists
      const defaultBalance: Balance = {
        userId,
        amount: 0,
        currency: 'AFc',
        lastUpdated: new Date().toISOString(),
      };
      this.balances.set(userId, defaultBalance);
      return defaultBalance;
    }

    return balance;
  }

  async topUpBalance(userId: string, amount: number, method: string): Promise<Payment> {
    await simulateNetworkDelay();

    const paymentData: CreatePaymentData = {
      userId,
      type: 'top_up',
      amount,
      description: `Top up balance via ${method}`,
      metadata: {
        method,
        timestamp: new Date().toISOString(),
      },
    };

    const payment = await this.createPayment(paymentData);
    
    // Update payment status to completed
    const completedPayment: Payment = {
      ...payment,
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.payments.set(payment.id, completedPayment);
    return completedPayment;
  }

  async withdrawFromBalance(userId: string, amount: number, description: string): Promise<Payment> {
    await simulateNetworkDelay();

    const balance = await this.getBalance(userId);
    if (balance.amount < amount) {
      throw new Error('Insufficient balance');
    }

    const paymentData: CreatePaymentData = {
      userId,
      type: 'trip_payment',
      amount: -amount, // Negative amount for withdrawal
      description,
      metadata: {
        type: 'withdrawal',
        timestamp: new Date().toISOString(),
      },
    };

    const payment = await this.createPayment(paymentData);
    
    // Update balance
    await this.updateBalance(userId, -amount);

    // Update payment status to completed
    const completedPayment: Payment = {
      ...payment,
      status: 'completed',
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.payments.set(payment.id, completedPayment);
    return completedPayment;
  }

  async refundPayment(paymentId: string, amount: number, reason: string): Promise<Payment> {
    await simulateNetworkDelay();

    const originalPayment = this.payments.get(paymentId);
    if (!originalPayment) {
      throw new Error(`Payment with ID ${paymentId} not found`);
    }

    if (originalPayment.status !== 'completed') {
      throw new Error('Can only refund completed payments');
    }

    const refundPayment: Payment = {
      id: `refund-${Date.now()}`,
      userId: originalPayment.userId,
      type: 'refund',
      amount: amount,
      status: 'completed',
      description: `Refund: ${reason}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      refundedAt: new Date().toISOString(),
      metadata: {
        originalPaymentId: paymentId,
        reason,
        originalAmount: originalPayment.amount,
      },
    };

    this.payments.set(refundPayment.id, refundPayment);

    // Update balance
    await this.updateBalance(originalPayment.userId, amount);

    return refundPayment;
  }

  async getTransactionHistory(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    await simulateNetworkDelay();

    return this.getPayments(userId, params);
  }

  async checkPaymentStatus(paymentId: string): Promise<Payment> {
    await simulateNetworkDelay();

    return this.getPayment(paymentId);
  }

  async getPaymentMethods(): Promise<string[]> {
    await simulateNetworkDelay();

    return ['card', 'bank_transfer', 'mobile_money', 'crypto'];
  }

  private async updateBalance(userId: string, amountChange: number): Promise<void> {
    const currentBalance = await this.getBalance(userId);
    const updatedBalance: Balance = {
      ...currentBalance,
      amount: currentBalance.amount + amountChange,
      lastUpdated: new Date().toISOString(),
    };

    this.balances.set(userId, updatedBalance);
  }
}
