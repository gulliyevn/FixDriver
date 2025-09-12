/**
 * Support Mock Service
 * 
 * Mock implementation for support operations
 * Provides fallback data for development and testing
 */

export class SupportMockService {
  private currentTicket: any = null;
  private tickets: any[] = [];

  /**
   * Create a new support ticket in mock data
   */
  async createSupportTicket(title: string, initialMessage: string): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const ticket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      status: 'open',
      priority: 'medium',
      messages: [
        {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: initialMessage,
          sender: 'user',
          timestamp: new Date(),
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.currentTicket = ticket;
    this.tickets.push(ticket);
    
    return ticket;
  }

  /**
   * Add user message to mock ticket
   */
  async addUserMessage(ticketId: string, message: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };
      
      ticket.messages.push(newMessage);
      ticket.updatedAt = new Date();
      
      if (this.currentTicket && this.currentTicket.id === ticketId) {
        this.currentTicket = ticket;
      }
    }
  }

  /**
   * Simulate support response in mock data
   */
  async simulateSupportResponse(ticketId: string, userMessage: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      // Generate appropriate response based on user message
      const response = this.generateSupportResponse(userMessage);
      
      const supportMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        text: response,
        sender: 'support',
        timestamp: new Date(),
      };
      
      ticket.messages.push(supportMessage);
      ticket.updatedAt = new Date();
      
      if (this.currentTicket && this.currentTicket.id === ticketId) {
        this.currentTicket = ticket;
      }
    }
  }

  /**
   * Get current ticket from mock data
   */
  async getCurrentTicket(): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.currentTicket;
  }

  /**
   * Get all support tickets from mock data
   */
  async getSupportTickets(): Promise<any[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.tickets];
  }

  /**
   * Close support ticket in mock data
   */
  async closeSupportTicket(ticketId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'closed';
      ticket.updatedAt = new Date();
    }
  }

  /**
   * Generate appropriate support response based on user message
   */
  private generateSupportResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('payment') || message.includes('billing')) {
      return 'I understand you have a question about payment. Let me help you with that. Can you provide more details about the specific issue you\'re experiencing?';
    }
    
    if (message.includes('driver') || message.includes('ride')) {
      return 'I\'m here to help with your driver or ride-related question. Please tell me more about what you need assistance with.';
    }
    
    if (message.includes('account') || message.includes('profile')) {
      return 'I can help you with account and profile issues. What specific problem are you facing with your account?';
    }
    
    if (message.includes('technical') || message.includes('bug') || message.includes('error')) {
      return 'I understand you\'re experiencing a technical issue. Let me gather some information to help resolve this. Can you describe the error or problem in more detail?';
    }
    
    if (message.includes('refund') || message.includes('cancel')) {
      return 'I can assist you with refund and cancellation requests. Please provide details about your specific situation so I can help you properly.';
    }
    
    // Default response
    return 'Thank you for contacting support. I\'m here to help you. Can you please provide more details about your question or issue?';
  }
}