/**
 * HelpGrpcService
 * gRPC service for help-related operations
 */

import { HelpServiceClient } from '../../../shared/types/grpc/HelpService';
import { HelpSection, HelpRequest, HelpResponse } from '../../../shared/types/help/HelpTypes';

export class HelpGrpcService {
  private client: HelpServiceClient;

  constructor(client: HelpServiceClient) {
    this.client = client;
  }

  /**
   * Get help sections based on user role
   */
  async getHelpSections(request: HelpRequest): Promise<HelpResponse> {
    try {
      const response = await this.client.getHelpSections(request);
      return response;
    } catch (error) {
      console.error('Error fetching help sections:', error);
      throw new Error('Failed to fetch help sections');
    }
  }

  /**
   * Get help content for specific section
   */
  async getHelpContent(sectionId: string, language: string): Promise<HelpSection> {
    try {
      const request = {
        sectionId,
        language
      };
      
      const response = await this.client.getHelpContent(request);
      return response.section;
    } catch (error) {
      console.error('Error fetching help content:', error);
      throw new Error('Failed to fetch help content');
    }
  }

  /**
   * Search help articles
   */
  async searchHelp(query: string, language: string): Promise<HelpSection[]> {
    try {
      const request = {
        query,
        language,
        limit: 10
      };
      
      const response = await this.client.searchHelp(request);
      return response.sections;
    } catch (error) {
      console.error('Error searching help:', error);
      throw new Error('Failed to search help articles');
    }
  }

  /**
   * Get FAQ items
   */
  async getFAQ(language: string): Promise<HelpSection[]> {
    try {
      const request = {
        language,
        category: 'faq'
      };
      
      const response = await this.client.getFAQ(request);
      return response.sections;
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      throw new Error('Failed to fetch FAQ');
    }
  }

  /**
   * Track help section usage
   */
  async trackHelpUsage(sectionId: string, userId: string): Promise<void> {
    try {
      const request = {
        sectionId,
        userId,
        timestamp: Date.now()
      };
      
      await this.client.trackHelpUsage(request);
    } catch (error) {
      console.error('Error tracking help usage:', error);
      // Don't throw error for tracking failures
    }
  }
}
