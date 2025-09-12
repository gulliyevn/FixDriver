/**
 * Support types
 * TypeScript interfaces for support-related operations
 */

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'closed' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'technical' | 'billing' | 'safety' | 'complaint';
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
  rating?: number;
  feedback?: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isFromUser: boolean;
  timestamp: string;
  attachments?: string[];
}

export interface CreateTicketRequest {
  userId: string;
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: 'general' | 'technical' | 'billing' | 'safety' | 'complaint';
  attachments?: string[];
}

export interface CreateTicketResponse {
  ticketId: string;
  ticket: SupportTicket;
  success: boolean;
}

export interface AddMessageRequest {
  ticketId: string;
  message: string;
  userId: string;
  timestamp: number;
  attachments?: string[];
}

export interface RateSupportRequest {
  ticketId: string;
  rating: number;
  feedback?: string;
  timestamp: number;
}
