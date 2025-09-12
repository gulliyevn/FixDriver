import { mockChats, mockMessages } from '../../../shared/mocks/data/chatMock';

/**
 * Chat Mock Service
 * 
 * Mock implementation for chat operations
 * Provides fallback data for development and testing
 */

export class ChatMockService {
  private chats: any[] = [...mockChats];
  private messages: Record<string, any[]> = { ...mockMessages };

  /**
   * Get all user chats from mock data
   */
  async getChats(): Promise<any[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.chats.map(chat => ({
      ...chat,
      formattedTime: this.formatMessageTime(chat.updatedAt),
    }));
  }

  /**
   * Get messages for a specific chat from mock data
   */
  async getMessages(chatId: string): Promise<any[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const chatMessages = this.messages[chatId] || [];
    return chatMessages.map(message => ({
      ...message,
      formattedTime: this.formatMessageTime(message.timestamp),
    }));
  }

  /**
   * Send a message to mock data
   */
  async sendMessage(chatId: string, content: string, type: string = 'text', metadata?: any): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      senderId: 'me',
      type,
      metadata: metadata || {},
      status: 'sent',
      timestamp: new Date(),
    };

    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
    }
    this.messages[chatId].push(newMessage);

    // Update chat's last message
    const chatIndex = this.chats.findIndex(chat => chat.id === chatId);
    if (chatIndex !== -1) {
      this.chats[chatIndex].lastMessage = {
        content,
        timestamp: newMessage.timestamp,
      };
      this.chats[chatIndex].updatedAt = newMessage.timestamp;
    }

    return {
      ...newMessage,
      formattedTime: this.formatMessageTime(newMessage.timestamp),
    };
  }

  /**
   * Delete a chat from mock data
   */
  async deleteChat(chatId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.chats = this.chats.filter(chat => chat.id !== chatId);
    delete this.messages[chatId];
  }

  /**
   * Clear chat messages from mock data
   */
  async clearChat(chatId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (this.messages[chatId]) {
      this.messages[chatId] = [];
    }
  }

  /**
   * Format message time
   */
  private formatMessageTime(timestamp: string | Date): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return date.toLocaleDateString();
  }
}
