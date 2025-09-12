/**
 * PaymentHistoryService gRPC client types
 * TypeScript interfaces for gRPC PaymentHistoryService client
 */

export interface PaymentHistoryServiceClient {
  getPaymentHistory(request: any): Promise<any>;
  exportPaymentHistory(request: any): Promise<any>;
  getPaymentStatistics(request: any): Promise<any>;
}
