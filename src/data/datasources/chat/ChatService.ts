import { ChatGrpcService } from './ChatGrpcService';
import { ChatMockService } from './ChatMockService';

/**
 * Chat Service
 * 
 * Main service for managing chats and messages
 * Integrates gRPC with mock fallback for development
 */

export class ChatService {
  private grpcService: ChatGrpcService;
  private mockService: ChatMockService;

  constructor() {
    this.grpcService = new ChatGrpcService();
    this.mockService = new ChatMockService();
  }

  /**
   * Get all user chats
   */
  async getChats(): Promise<any[]> {
    try {
      return await this.grpcService.getChats();
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.getChats();
    }
  }

  /**
   * Get messages for a specific chat
   */
  async getMessages(chatId: string): Promise<any[]> {
    try {
      return await this.grpcService.getMessages(chatId);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.getMessages(chatId);
    }
  }

  /**
   * Send a message
   */
  async sendMessage(chatId: string, content: string, type: string = 'text', metadata?: any): Promise<any> {
    try {
      return await this.grpcService.sendMessage(chatId, content, type, metadata);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      return await this.mockService.sendMessage(chatId, content, type, metadata);
    }
  }

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string): Promise<void> {
    try {
      await this.grpcService.deleteChat(chatId);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.deleteChat(chatId);
    }
  }

  /**
   * Clear chat messages
   */
  async clearChat(chatId: string): Promise<void> {
    try {
      await this.grpcService.clearChat(chatId);
    } catch (error) {
      console.warn('gRPC service failed, falling back to mock:', error);
      await this.mockService.clearChat(chatId);
    }
  }

  /**
   * Format message time
   */
  static formatMessageTime(timestamp: string | Date): string {
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
