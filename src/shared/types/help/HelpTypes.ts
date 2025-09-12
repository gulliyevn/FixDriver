/**
 * Help types
 * TypeScript interfaces for help-related operations
 */

export interface HelpSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
  category: 'booking' | 'payment' | 'safety' | 'rules' | 'support' | 'faq';
  language: string;
  order?: number;
  isActive?: boolean;
}

export interface HelpRequest {
  role?: 'client' | 'driver';
  language?: string;
  category?: string;
}

export interface HelpResponse {
  sections: HelpSection[];
  totalCount: number;
  language: string;
}

export interface HelpSearchRequest {
  query: string;
  language: string;
  limit?: number;
}

export interface HelpUsageTracking {
  sectionId: string;
  userId: string;
  timestamp: number;
  duration?: number;
}
