import { Chat, Message, ChatPreview } from '../types/chat';
import mockData from '../utils/mockData';

// Отключено для production - только для разработки
const ENABLE_CHAT_LOGS = false;

const log = (message: string, data?: unknown) => {
  if (ENABLE_CHAT_LOGS) {
    console.log(`📋 ChatService: ${message}`, data || '');
  }
};

export class ChatService {
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
    this.chats = mockData.chats;
    this.messages = mockData.messages;
    // Если есть chatPreviews, можно оставить или убрать, если не используется.
  }

  getChats(userId: string): ChatPreview[] {
    log(`получение списка чатов для пользователя ${userId}`);
    return this.chatPreviews;
  }

  getMessages(chatId: string): Message[] {
    log(`получение сообщений для чата ${chatId}`);
    return this.messages.filter(message => message.chatId === chatId);
  }

  sendMessage(chatId: string, senderId: string, text: string): Message {
    const message: Message = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId,
      senderType: senderId === 'me' ? 'client' : 'driver',
      content: text,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false,
    };

    this.messages.push(message);
    
    // Обновляем чат
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = message;
      chat.updatedAt = message.timestamp;
      if (senderId !== 'me') {
        chat.unreadCount = (chat.unreadCount || 0) + 1;
      }
    }

    // Обновляем превью чата
    const chatPreview = this.chatPreviews.find(c => c.id === chatId);
    if (chatPreview) {
      chatPreview.lastMessage = text;
      chatPreview.lastMessageTime = new Date();
      if (senderId !== 'me') {
        chatPreview.unreadCount = (chatPreview.unreadCount || 0) + 1;
      }
    }

    this.notifySubscribers();
    
    return message;
  }

  markAsRead(chatId: string, userId: string): void {
    this.messages.forEach(message => {
      if (message.chatId === chatId && message.senderId !== userId) {
        message.isRead = true;
      }
    });

    // Обновляем счетчик непрочитанных
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
    log(`удаление чата ${chatId}`);
    const initialLength = this.chats.length;
    this.chats = this.chats.filter(chat => chat.id !== chatId);
    this.messages = this.messages.filter(message => message.chatId !== chatId);
    this.chatPreviews = this.chatPreviews.filter(chat => chat.id !== chatId);
    
    const deleted = initialLength > this.chats.length;
    if (deleted) {
      log(`✅ Чат удален: ${chatId}`);
      this.notifySubscribers();
    }
    
    return deleted;
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

  // Статические методы для совместимости
  static async getChats(userId: string): Promise<Chat[]> {
    const instance = ChatService.getInstance();
    return instance.chats;
  }

  static async getMessages(chatId: string): Promise<Message[]> {
    const instance = ChatService.getInstance();
    return instance.getMessages(chatId);
  }

  static async sendMessage(chatId: string, text: string, senderId: string): Promise<Message> {
    const instance = ChatService.getInstance();
    return instance.sendMessage(chatId, senderId, text);
  }

  static async markMessagesAsRead(chatId: string): Promise<void> {
    const instance = ChatService.getInstance();
    instance.markAsRead(chatId, 'me');
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

    if (minutes < 1) return 'сейчас';
    if (minutes < 60) return `${minutes}м`;
    if (hours < 24) return `${hours}ч`;
    if (days < 7) return `${days}д`;
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
}

export default ChatService.getInstance();
