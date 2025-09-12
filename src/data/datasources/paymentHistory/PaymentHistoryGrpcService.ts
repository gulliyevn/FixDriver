/**
 * PaymentHistoryGrpcService
 * gRPC service for payment history operations
 */

import { PaymentHistoryServiceClient } from '../../../shared/types/grpc/PaymentHistoryService';
import { 
  Payment, 
  PaymentHistoryRequest, 
  PaymentHistoryResponse,
  ExportPaymentHistoryRequest
} from '../../../shared/types/paymentHistory/PaymentTypes';

export class PaymentHistoryGrpcService {
  private client: PaymentHistoryServiceClient;

  constructor(client: PaymentHistoryServiceClient) {
    this.client = client;
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(request: PaymentHistoryRequest): Promise<PaymentHistoryResponse> {
    try {
      const response = await this.client.getPaymentHistory(request);
      return response;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw new Error('Failed to fetch payment history');
    }
  }

  /**
   * Export payment history
   */
  async exportPaymentHistory(userId: string, format: 'csv' | 'pdf'): Promise<{ downloadUrl: string }> {
    try {
      const request: ExportPaymentHistoryRequest = {
        userId,
        format,
        dateRange: {
          start: '',
          end: ''
        }
      };
      
      const response = await this.client.exportPaymentHistory(request);
      return { downloadUrl: response.downloadUrl };
    } catch (error) {
      console.error('Error exporting payment history:', error);
      throw new Error('Failed to export payment history');
    }
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
    try {
      const request = {
        userId,
        period
      };
      
      const response = await this.client.getPaymentStatistics(request);
      return response.statistics;
    } catch (error) {
      console.error('Error fetching payment statistics:', error);
      throw new Error('Failed to fetch payment statistics');
    }
  }
}
