/**
 * HelpService
 * Main service for help-related operations with gRPC integration
 */

import { HelpGrpcService } from './HelpGrpcService';
import { HelpMockService } from './HelpMockService';
import { HelpServiceClient } from '../../../shared/types/grpc/HelpService';
import { HelpSection, HelpRequest, HelpResponse } from '../../../shared/types/help/HelpTypes';

export class HelpService {
  private grpcService: HelpGrpcService;
  private mockService: HelpMockService;
  private useMock: boolean;

  constructor(grpcClient?: HelpServiceClient, useMock: boolean = true) {
    this.useMock = useMock;
    this.mockService = new HelpMockService();
    
    if (grpcClient && !useMock) {
      this.grpcService = new HelpGrpcService(grpcClient);
    }
  }

  /**
   * Get help sections based on user role
   */
  async getHelpSections(request: HelpRequest): Promise<HelpResponse> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.getHelpSections(request);
    }
    
    return this.grpcService.getHelpSections(request);
  }

  /**
   * Get help content for specific section
   */
  async getHelpContent(sectionId: string, language: string): Promise<HelpSection> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.getHelpContent(sectionId, language);
    }
    
    return this.grpcService.getHelpContent(sectionId, language);
  }

  /**
   * Search help articles
   */
  async searchHelp(query: string, language: string): Promise<HelpSection[]> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.searchHelp(query, language);
    }
    
    return this.grpcService.searchHelp(query, language);
  }

  /**
   * Get FAQ items
   */
  async getFAQ(language: string): Promise<HelpSection[]> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.getFAQ(language);
    }
    
    return this.grpcService.getFAQ(language);
  }

  /**
   * Track help section usage
   */
  async trackHelpUsage(sectionId: string, userId: string): Promise<void> {
    if (this.useMock || !this.grpcService) {
      return this.mockService.trackHelpUsage(sectionId, userId);
    }
    
    return this.grpcService.trackHelpUsage(sectionId, userId);
  }

  /**
   * Switch to gRPC mode
   */
  enableGrpc(grpcClient: HelpServiceClient): void {
    this.grpcService = new HelpGrpcService(grpcClient);
    this.useMock = false;
  }

  /**
   * Switch to mock mode
   */
  enableMock(): void {
    this.useMock = true;
  }
}
