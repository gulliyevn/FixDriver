import { IPaymentService } from './types/IPaymentService';
import { PaymentServiceStub } from './stubs/PaymentServiceStub';
import { Payment, Balance, CreatePaymentData, PaginationParams, PaginatedResponse } from '../../../shared/types';

/**
 * gRPC PaymentService
 *
 * This service will eventually connect to real gRPC backend.
 * For now, it uses PaymentServiceStub for development/testing.
 */
export class PaymentService implements IPaymentService {
  private stub: PaymentServiceStub;
  private isGRPCReady: boolean = false;

  constructor() {
    this.stub = new PaymentServiceStub();
    this.checkGRPCConnection();
  }

  /**
   * Check if gRPC connection is available
   */
  private async checkGRPCConnection(): Promise<void> {
    try {
      // For now, always use stub
      this.isGRPCReady = false;
    } catch (error) {
      console.warn('gRPC connection not available, using stub:', error);
      this.isGRPCReady = false;
    }
  }

  async getPayment(id: string): Promise<Payment> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getPayment(id);
      }
    } catch (error) {
      console.error('PaymentService getPayment error:', error);
      throw error;
    }
  }

  async createPayment(paymentData: CreatePaymentData): Promise<Payment> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.createPayment(paymentData);
      }
    } catch (error) {
      console.error('PaymentService createPayment error:', error);
      throw error;
    }
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.updatePayment(id, updates);
      }
    } catch (error) {
      console.error('PaymentService updatePayment error:', error);
      throw error;
    }
  }

  async getPayments(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getPayments(userId, params);
      }
    } catch (error) {
      console.error('PaymentService getPayments error:', error);
      throw error;
    }
  }

  async getTransactionHistory(userId: string, params?: PaginationParams): Promise<PaginatedResponse<Payment>> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getTransactionHistory(userId, params);
      }
    } catch (error) {
      console.error('PaymentService getTransactionHistory error:', error);
      throw error;
    }
  }

  async getBalance(userId: string): Promise<Balance> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getBalance(userId);
      }
    } catch (error) {
      console.error('PaymentService getBalance error:', error);
      throw error;
    }
  }

  async topUpBalance(userId: string, amount: number, method: string): Promise<Payment> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.topUpBalance(userId, amount, method);
      }
    } catch (error) {
      console.error('PaymentService topUpBalance error:', error);
      throw error;
    }
  }

  async withdrawFromBalance(userId: string, amount: number, description: string): Promise<Payment> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.withdrawFromBalance(userId, amount, description);
      }
    } catch (error) {
      console.error('PaymentService withdrawFromBalance error:', error);
      throw error;
    }
  }

  async processPayment(paymentId: string): Promise<Payment> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.processPayment(paymentId);
      }
    } catch (error) {
      console.error('PaymentService processPayment error:', error);
      throw error;
    }
  }

  async refundPayment(paymentId: string, amount: number, reason: string): Promise<Payment> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.refundPayment(paymentId, amount, reason);
      }
    } catch (error) {
      console.error('PaymentService refundPayment error:', error);
      throw error;
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<Payment> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.checkPaymentStatus(paymentId);
      }
    } catch (error) {
      console.error('PaymentService checkPaymentStatus error:', error);
      throw error;
    }
  }

  async getPaymentMethods(): Promise<string[]> {
    try {
      if (this.isGRPCReady) {
        // TODO: Replace with actual gRPC call
        throw new Error('gRPC not implemented yet');
      } else {
        return await this.stub.getPaymentMethods();
      }
    } catch (error) {
      console.error('PaymentService getPaymentMethods error:', error);
      throw error;
    }
  }
}
