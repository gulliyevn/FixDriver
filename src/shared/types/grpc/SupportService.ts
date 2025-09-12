/**
 * SupportService gRPC client types
 * TypeScript interfaces for gRPC SupportService client
 */

export interface SupportServiceClient {
  createTicket(request: any): Promise<any>;
  getUserTickets(request: any): Promise<any>;
  getTicket(request: any): Promise<any>;
  addMessage(request: any): Promise<void>;
  closeTicket(request: any): Promise<void>;
  rateSupport(request: any): Promise<void>;
}
