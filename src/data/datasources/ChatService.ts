import { Chat, Message, ChatPreview } from '../../shared/types/chat';
// Mock data will be created locally for now
import { CHAT_CONSTANTS } from '../../shared/constants/adaptiveConstants';

export interface IChatService {
  getChats(userId: string): ChatPreview[];
  getMessages(chatId: string): Message[];
  sendMessage(chatId: string, content: string, messageType?: 'text' | 'image' | 'file' | 'location', metadata?: Message['metadata']): Promise<Message>;
  markAsRead(chatId: string): void;
  deleteChat(chatId: string): boolean;
  clearChat(chatId: string): void;
  subscribe(callback: (chats: ChatPreview[]) => void): () => void;
  syncWithBackend(): Promise<boolean>;
}

// Disabled for production - only for development
const ENABLE_CHAT_LOGS = false;

const log = (message: string, data?: unknown) => {
  if (ENABLE_CHAT_LOGS) {

  }
};

export class ChatService implements IChatService {
  private static instance: ChatService;
  private chats: Chat[] = [];
  private messages: Message[] = [];
  private chatPreviews: ChatPreview[] = [];
  private subscribers: ((chats: ChatPreview[]) => void)[] = [];

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.chats = [];
    this.messages = [];
    // If there are chatPreviews, you can leave or remove if not used.
  }

  getChats(userId: string): ChatPreview[] {
    log(`getting chat list for user ${userId}`);
    return this.chatPreviews;
  }

  getMessages(chatId: string): Message[] {
    log(`getting messages for chat ${chatId}`);
    return this.messages.filter(message => message.chatId === chatId);
  }

  async sendMessage(
    chatId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' | 'location' = 'text',
    metadata?: Message['metadata']
  ): Promise<Message> {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId: 'me',
      senderType: 'client',
      content,
      timestamp: new Date().toISOString(),
      type: messageType,
      isRead: false,
      metadata,
    };

    this.messages.push(newMessage);
    
    // Update chat
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = newMessage;
      chat.updatedAt = newMessage.timestamp;
      chat.unreadCount = (chat.unreadCount || 0) + 1;
    }

    // Update chat preview
    const chatPreview = this.chatPreviews.find(c => c.id === chatId);
    if (chatPreview) {
      chatPreview.lastMessage = newMessage.content;
      chatPreview.lastMessageTime = new Date();
      chatPreview.unreadCount = (chatPreview.unreadCount || 0) + 1;
    }

    this.notifySubscribers();
    
    return newMessage;
  }

  markAsRead(chatId: string): void {
    this.messages.forEach(message => {
      if (message.chatId === chatId && message.senderId !== 'me') {
        message.isRead = true;
      }
    });

    // Update unread counter
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount = 0;
    }

    const chatPreview = this.chatPreviews.find(c => c.id === chatId);
    if (chatPreview) {
      chatPreview.unreadCount = 0;
    }

    this.notifySubscribers();
  }

  deleteChat(chatId: string): boolean {
    log(`deleting chat ${chatId}`);
    const initialLength = this.chats.length;
    this.chats = this.chats.filter(chat => chat.id !== chatId);
    this.messages = this.messages.filter(message => message.chatId !== chatId);
    this.chatPreviews = this.chatPreviews.filter(chat => chat.id !== chatId);
    
    const deleted = initialLength > this.chats.length;
    if (deleted) {
      log(`✅ Chat deleted: ${chatId}`);
      this.notifySubscribers();
    }
    
    return deleted;
  }

  clearChat(chatId: string): void {
    // Remove only messages inside chat, keep the chat itself
    this.messages = this.messages.filter(message => message.chatId !== chatId);
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = undefined;
      chat.unreadCount = 0;
      chat.updatedAt = new Date().toISOString();
    }
    const chatPreview = this.chatPreviews.find(c => c.id === chatId);
    if (chatPreview) {
      chatPreview.lastMessage = '';
      chatPreview.unreadCount = 0;
      chatPreview.lastMessageTime = new Date();
    }
    this.notifySubscribers();
  }

  subscribe(callback: (chats: ChatPreview[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.chatPreviews));
  }

  // Static methods for compatibility
  static async getChats(): Promise<Chat[]> {
    const instance = ChatService.getInstance();
    return instance.chats;
  }

  static async getMessages(chatId: string): Promise<Message[]> {
    const instance = ChatService.getInstance();
    return instance.getMessages(chatId);
  }

  static async sendMessage(chatId: string, text: string, metadata?: Message['metadata']): Promise<Message> {
    const instance = ChatService.getInstance();
    return instance.sendMessage(chatId, text, 'text', metadata);
  }

  static async markMessagesAsRead(chatId: string): Promise<void> {
    const instance = ChatService.getInstance();
    instance.markAsRead(chatId);
  }

  static async createChat(clientId: string, driverId: string): Promise<Chat> {
    const instance = ChatService.getInstance();
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      clientId,
      driverId,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    instance.chats.push(newChat);
    return newChat;
  }

  static formatMessageTime(timestamp: string | Date): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('ru-RU');
  }

  static resetToMockData(): void {
    const instance = ChatService.getInstance();
    instance.initializeMockData();
  }

  static async deleteChat(chatId: string): Promise<boolean> {
    const instance = ChatService.getInstance();
    return instance.deleteChat(chatId);
  }

  static async clearChat(chatId: string): Promise<void> {
    const instance = ChatService.getInstance();
    instance.clearChat(chatId);
  }

  /**
   * Sync chat data with backend via gRPC
   * TODO: Implement real gRPC call
   */
  async syncWithBackend(): Promise<boolean> {
    try {
      // Mock implementation for now
      // TODO: Replace with real gRPC call
      const chats = this.chats;
      const messages = this.messages;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Chat data synced with backend:', { 
        chatsCount: chats.length, 
        messagesCount: messages.length 
      });
      return true;
    } catch (error) {
      console.error('Failed to sync chat data:', error);
      return false;
    }
  }
}

export default ChatService.getInstance();
