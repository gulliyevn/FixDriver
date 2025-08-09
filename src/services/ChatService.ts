import { Chat, Message, ChatPreview } from '../types/chat';
import { mockChats, mockMessages } from '../mocks';

// Отключено для production - только для разработки
const ENABLE_CHAT_LOGS = false;

const log = (message: string, data?: unknown) => {
  if (ENABLE_CHAT_LOGS) {

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
    this.chats = mockChats;
    this.messages = mockMessages;
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
    
    // Обновляем чат
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = newMessage;
      chat.updatedAt = newMessage.timestamp;
      chat.unreadCount = (chat.unreadCount || 0) + 1;
    }

    // Обновляем превью чата
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

  clearChat(chatId: string): void {
    // Удаляем только сообщения внутри чата, сам чат сохраняем
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

  // Статические методы для совместимости
  static async getChats(): Promise<Chat[]> {
    ChatService.getInstance();
    // Создаем мок данные для чатов
    const mockChats: Chat[] = [
      {
        id: 'chat_1',
        clientId: 'client_1',
        driverId: 'driver_1',
        lastMessage: {
          id: 'msg_1',
          chatId: 'chat_1',
          senderId: 'driver_1',
          senderType: 'driver',
          content: 'Привет! Готов к поездке.',
          type: 'text',
          timestamp: new Date().toISOString(),
          isRead: false,
        },
        unreadCount: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        participant: {
          id: 'driver_1',
          name: 'Дмитрий Петров',
          avatar: 'https://via.placeholder.com/150',
          isOnline: true,
        },
      },
      {
        id: 'chat_2',
        clientId: 'client_1',
        driverId: 'driver_2',
        lastMessage: {
          id: 'msg_2',
          chatId: 'chat_2',
          senderId: 'client_1',
          senderType: 'client',
          content: 'Спасибо за поездку!',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true,
        },
        unreadCount: 0,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        participant: {
          id: 'driver_2',
          name: 'Алексей Сидоров',
          avatar: 'https://via.placeholder.com/150',
          isOnline: false,
        },
      },
    ];
    return mockChats;
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

  static async clearChat(chatId: string): Promise<void> {
    const instance = ChatService.getInstance();
    instance.clearChat(chatId);
  }
}

export default ChatService.getInstance();
