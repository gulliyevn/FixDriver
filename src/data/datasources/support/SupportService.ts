import { SupportGrpcService } from './SupportGrpcService';
import { SupportMockService } from './SupportMockService';

/**
 * Support Service
 * 
 * Main service for managing support tickets and messages
 * Integrates gRPC with mock fallback for development
 */

export class SupportService {
  private grpcService: SupportGrpcService;
  private mockService: SupportMockService;

  constructor() {
    this.grpcService = new SupportGrpcService();
    this.mockService = new SupportMockService();
  }

  /**
   * Create a new support ticket
   */
  async createSupportTicket(title: string, initialMessage: string): Promise<any> {
    try {
      return await this.grpcService.createSupportTicket(title, initialMessage);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.createSupportTicket(title, initialMessage);
    }
  }

  /**
   * Add user message to ticket
   */
  async addUserMessage(ticketId: string, message: string): Promise<void> {
    try {
      await this.grpcService.addUserMessage(ticketId, message);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.addUserMessage(ticketId, message);
    }
  }

  /**
   * Simulate support response
   */
  async simulateSupportResponse(ticketId: string, userMessage: string): Promise<void> {
    try {
      await this.grpcService.simulateSupportResponse(ticketId, userMessage);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.simulateSupportResponse(ticketId, userMessage);
    }
  }

  /**
   * Get current ticket
   */
  async getCurrentTicket(): Promise<any> {
    try {
      return await this.grpcService.getCurrentTicket();
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.getCurrentTicket();
    }
  }

  /**
   * Get all support tickets
   */
  async getSupportTickets(): Promise<any[]> {
    try {
      return await this.grpcService.getSupportTickets();
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.getSupportTickets();
    }
  }

  /**
   * Close support ticket
   */
  async closeSupportTicket(ticketId: string): Promise<void> {
    try {
      await this.grpcService.closeSupportTicket(ticketId);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.closeSupportTicket(ticketId);
    }
  }
}