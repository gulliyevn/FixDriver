/**
 * HelpMockService
 * Mock implementation for help-related operations
 */

import { HelpSection, HelpRequest, HelpResponse } from '../../../shared/types/help/HelpTypes';

export class HelpMockService {
  /**
   * Mock help sections data
   */
  private mockHelpSections: HelpSection[] = [
    {
      id: '1',
      title: 'How to Order',
      icon: 'car',
      description: 'Learn how to book rides and use the app',
      content: '1. Open the app and set your destination\n2. Choose your preferred driver\n3. Confirm your booking\n4. Wait for your driver to arrive',
      category: 'booking',
      language: 'en'
    },
    {
      id: '2',
      title: 'Payment & Rates',
      icon: 'card',
      description: 'Information about pricing and payment methods',
      content: 'Our rates are competitive and transparent. You can pay via:\n• Cash\n• Card\n• Digital wallet\n• Bank transfer',
      category: 'payment',
      language: 'en'
    },
    {
      id: '3',
      title: 'Safety',
      icon: 'shield-checkmark',
      description: 'Safety guidelines and emergency contacts',
      content: 'Your safety is our priority:\n• All drivers are verified\n• Share your trip with friends\n• Emergency contacts are available\n• Report any issues immediately',
      category: 'safety',
      language: 'en'
    },
    {
      id: '4',
      title: 'Rules & Terms',
      icon: 'document-text',
      description: 'Terms of service and community guidelines',
      content: 'Please follow our community guidelines:\n• Be respectful to drivers and passengers\n• No smoking in vehicles\n• Follow traffic laws\n• Report violations',
      category: 'rules',
      language: 'en'
    },
    {
      id: '5',
      title: 'Support',
      icon: 'chatbubbles',
      description: 'Contact our support team',
      content: 'Get in touch with our support team via WhatsApp or in-app chat.',
      category: 'support',
      language: 'en'
    }
  ];

  /**
   * Get help sections based on user role
   */
  async getHelpSections(request: HelpRequest): Promise<HelpResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter sections based on role if needed
    let sections = [...this.mockHelpSections];
    
    if (request.role === 'driver') {
      // Driver-specific sections (for now, same as client)
      sections = sections.map(section => ({
        ...section,
        title: section.title, // Could be customized for drivers
      }));
    }

    return {
      sections,
      totalCount: sections.length,
      language: request.language || 'en'
    };
  }

  /**
   * Get help content for specific section
   */
  async getHelpContent(sectionId: string, language: string): Promise<HelpSection> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const section = this.mockHelpSections.find(s => s.id === sectionId);
    if (!section) {
      throw new Error('Help section not found');
    }

    return section;
  }

  /**
   * Search help articles
   */
  async searchHelp(query: string, language: string): Promise<HelpSection[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const lowercaseQuery = query.toLowerCase();
    const results = this.mockHelpSections.filter(section =>
      section.title.toLowerCase().includes(lowercaseQuery) ||
      section.description.toLowerCase().includes(lowercaseQuery) ||
      section.content.toLowerCase().includes(lowercaseQuery)
    );

    return results.slice(0, 10);
  }

  /**
   * Get FAQ items
   */
  async getFAQ(language: string): Promise<HelpSection[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // For now, return all sections as FAQ
    return this.mockHelpSections;
  }

  /**
   * Track help section usage
   */
  async trackHelpUsage(sectionId: string, userId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log(`Tracking help usage: sectionId=${sectionId}, userId=${userId}`);
    // In real implementation, this would send analytics data
  }
}
