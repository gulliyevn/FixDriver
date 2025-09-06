import { SUPPORT_CONSTANTS } from '../../shared/constants';

export interface SupportMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  isRead: boolean;
}

export interface SupportTicket {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  messages: SupportMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISupportService {
  createSupportTicket(title: string, initialMessage: string): SupportTicket;
  addSupportMessage(ticketId: string, message: string): void;
  addUserMessage(ticketId: string, message: string): void;
  getCurrentTicket(): SupportTicket | null;
  getAllTickets(): SupportTicket[];
  markMessagesAsRead(ticketId: string): void;
  closeTicket(ticketId: string): void;
  getQuickQuestions(): string[];
  simulateSupportResponse(ticketId: string, userMessage: string): void;
  syncWithBackend(): Promise<boolean>;
}

class SupportService implements ISupportService {
  private tickets: SupportTicket[] = [];
  private currentTicket: SupportTicket | null = null;

  // Create new support ticket
  createSupportTicket(title: string, initialMessage: string): SupportTicket {
    const ticket: SupportTicket = {
      id: Date.now().toString(),
      title,
      status: SUPPORT_CONSTANTS.DEFAULT_STATUS,
      priority: SUPPORT_CONSTANTS.DEFAULT_PRIORITY,
      messages: [
        {
          id: Date.now().toString(),
          text: initialMessage,
          sender: 'user',
          timestamp: new Date(),
          isRead: true,
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tickets.push(ticket);
    this.currentTicket = ticket;

    // Automatic support response
    setTimeout(() => {
      this.addSupportMessage(ticket.id, SUPPORT_CONSTANTS.AUTO_RESPONSE);
    }, SUPPORT_CONSTANTS.AUTO_RESPONSE_DELAY);

    return ticket;
  }

  // Add support message
  addSupportMessage(ticketId: string, message: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      const supportMessage: SupportMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'support',
        timestamp: new Date(),
        isRead: false,
      };

      ticket.messages.push(supportMessage);
      ticket.updatedAt = new Date();
      ticket.status = SUPPORT_CONSTANTS.IN_PROGRESS_STATUS;
    }
  }

  // Add user message
  addUserMessage(ticketId: string, message: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      const userMessage: SupportMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        isRead: true,
      };

      ticket.messages.push(userMessage);
      ticket.updatedAt = new Date();
    }
  }

  // Get current ticket
  getCurrentTicket(): SupportTicket | null {
    return this.currentTicket;
  }

  // Get all tickets
  getAllTickets(): SupportTicket[] {
    return this.tickets;
  }

  // Mark messages as read
  markMessagesAsRead(ticketId: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.messages.forEach(message => {
        if (message.sender === 'support') {
          message.isRead = true;
        }
      });
    }
  }

  // Close ticket
  closeTicket(ticketId: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = SUPPORT_CONSTANTS.RESOLVED_STATUS;
      ticket.updatedAt = new Date();
    }
  }

  // Quick questions for support
  getQuickQuestions(): string[] {
    return [...SUPPORT_CONSTANTS.QUICK_QUESTIONS];
  }

  // Simulate support responses
  simulateSupportResponse(ticketId: string, userMessage: string): void {
    setTimeout(() => {
      let response = '';
      
      if (userMessage.toLowerCase().includes('login') || userMessage.toLowerCase().includes('signin') || userMessage.toLowerCase().includes('вход') || userMessage.toLowerCase().includes('логин')) {
        response = SUPPORT_CONSTANTS.RESPONSES.LOGIN_ISSUES;
      } else if (userMessage.toLowerCase().includes('payment') || userMessage.toLowerCase().includes('оплата') || userMessage.toLowerCase().includes('платеж')) {
        response = SUPPORT_CONSTANTS.RESPONSES.PAYMENT_ISSUES;
      } else if (userMessage.toLowerCase().includes('order') || userMessage.toLowerCase().includes('ride') || userMessage.toLowerCase().includes('заказ') || userMessage.toLowerCase().includes('поездка')) {
        response = SUPPORT_CONSTANTS.RESPONSES.ORDER_ISSUES;
      } else if (userMessage.toLowerCase().includes('registration') || userMessage.toLowerCase().includes('driver') || userMessage.toLowerCase().includes('регистрация') || userMessage.toLowerCase().includes('водитель')) {
        response = SUPPORT_CONSTANTS.RESPONSES.DRIVER_REGISTRATION;
      } else {
        response = SUPPORT_CONSTANTS.RESPONSES.DEFAULT;
      }

      this.addSupportMessage(ticketId, response);
    }, Math.random() * SUPPORT_CONSTANTS.RESPONSE_DELAY_MAX + SUPPORT_CONSTANTS.RESPONSE_DELAY_MIN);
  }

  // Sync with backend via gRPC
  async syncWithBackend(): Promise<boolean> {
    // TODO: Implement gRPC call to sync support data with backend
    try {
      console.log('Syncing support data with backend...');
      // Mock implementation - replace with actual gRPC call
      return true;
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      return false;
    }
  }
}

export const supportService = new SupportService(); 