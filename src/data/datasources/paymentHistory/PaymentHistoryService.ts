/**
 * PaymentHistoryService
 * Main service for payment history operations with gRPC integration
 */

import { PaymentHistoryGrpcService } from './PaymentHistoryGrpcService';
import { PaymentHistoryMockService } from './PaymentHistoryMockService';
import { PaymentHistoryServiceClient } from '../../../shared/types/grpc/PaymentHistoryService';
import { 
  PaymentHistoryRequest, 
  PaymentHistoryResponse 
} from '../../../shared/types/paymentHistory/PaymentTypes';

export class PaymentHistoryService {
  private grpcService: PaymentHistoryGrpcService;
  private mockService: PaymentHistoryMockService;
  private useMock: boolean;

  constructor(grpcClient?: PaymentHistoryServiceClient, useMock: boolean = true) {
    this.useMock = useMock;
    this.mockService = new PaymentHistoryMockService();
    
    if (grpcClient && !useMock) {
      this.grpcService = new PaymentHistoryGrpcService(grpcClient);
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(request: PaymentHistoryRequest): Promise<PaymentHistoryResponse> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.getPaymentHistory(request);
    }
    
    return this.grpcService.getPaymentHistory(request);
  }

  /**
   * Export payment history
   */
  async exportPaymentHistory(userId: string, format: 'csv' | 'pdf'): Promise<{ downloadUrl: string }> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.exportPaymentHistory(userId, format);
    }
    
    return this.grpcService.exportPaymentHistory(userId, format);
  }

  /**
   * Get payment statistics
   */
  async getPaymentStatistics(userId: string, period: 'week' | 'month' | 'year'): Promise<{
    totalAmount: number;
    transactionCount: number;
    averageAmount: number;
    topCategories: Array<{ category: string; amount: number; count: number }>;
  }> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.getPaymentStatistics(userId, period);
    }
    
    return this.grpcService.getPaymentStatistics(userId, period);
  }

  /**
   * Switch to gRPC mode
   */
  enableGrpc(grpcClient: PaymentHistoryServiceClient): void {
    this.grpcService = new PaymentHistoryGrpcService(grpcClient);
    this.useMock = false;
  }

  /**
   * Switch to mock mode
   */
  enableMock(): void {
    this.useMock = true;
  }
}
