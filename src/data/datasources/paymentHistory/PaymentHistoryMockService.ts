/**
 * PaymentHistoryMockService
 * Mock implementation for payment history operations
 */

import { 
  Payment, 
  PaymentHistoryRequest, 
  PaymentHistoryResponse 
} from '../../../shared/types/paymentHistory/PaymentTypes';
import { getMockPaymentHistory } from '../../../shared/mocks/payment/paymentHistoryMock';
import { t } from '../../../shared/i18n';

export class PaymentHistoryMockService {
  /**
   * Mock payment data
   */
  private mockPayments: Payment[] = [];

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data
   */
  private initializeMockData() {
    // Use centralized, i18n-ready mocks
    this.mockPayments = getMockPaymentHistory(t) as unknown as Payment[];
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(request: PaymentHistoryRequest): Promise<PaymentHistoryResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filteredPayments = [...this.mockPayments];

    // Filter by user (simplified - in real app would filter by userId)
    // For now, return all mock payments

    // Apply sorting
    if (request.sortBy === 'createdAt' && request.sortOrder === 'desc') {
      filteredPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Apply pagination
    const offset = request.offset || 0;
    const limit = request.limit || 100;
    const paginatedPayments = filteredPayments.slice(offset, offset + limit);

    return {
      payments: paginatedPayments,
      totalCount: filteredPayments.length,
      hasMore: offset + limit < filteredPayments.length
    };
  }

  /**
   * Export payment history
   */
  async exportPaymentHistory(userId: string, format: 'csv' | 'pdf'): Promise<{ downloadUrl: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock export functionality
    const mockDownloadUrl = `https://mock-download.com/payment-history-${userId}-${Date.now()}.${format}`;
    
    console.log(`Exporting payment history for user ${userId} in ${format} format`);
    
    return { downloadUrl: mockDownloadUrl };
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock statistics based on mock data
    const tripPayments = this.mockPayments.filter(p => p.type === 'trip');
    const totalAmount = tripPayments.reduce((sum, p) => {
      const amount = parseFloat(p.amount.replace(/[^\d.,]/g, '') || '0');
      return sum + Math.abs(amount);
    }, 0);

    return {
      totalAmount,
      transactionCount: this.mockPayments.length,
      averageAmount: totalAmount / this.mockPayments.length,
      topCategories: [
        { category: 'trip', amount: 33.75, count: 2 },
        { category: 'fee', amount: 17.50, count: 2 },
        { category: 'refund', amount: 12.75, count: 1 }
      ]
    };
  }
}
