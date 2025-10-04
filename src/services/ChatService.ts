import APIClient from "./APIClient";
import WebSocketService, { WebSocketMessage } from "./WebSocketService";

export interface Chat {
  id: string;
  clientId: string;
  driverId: string;
  clientName: string;
  driverName: string;
  clientAvatar?: string;
  driverAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: "text" | "image" | "file" | "location";
  timestamp: string;
  isRead: boolean;
  metadata?: {
    latitude?: number;
    longitude?: number;
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
  };
}

export interface ChatPreview {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

class ChatServiceInternal {
  private static instance: ChatServiceInternal;
  private ws: typeof WebSocketService;
  private messageHandlers: Array<(message: Message) => void> = [];
  private typingHandlers: Array<
    (chatId: string, userId: string, isTyping: boolean) => void
  > = [];
  private isRealtimeEnabled = false;

  constructor() {
    this.ws = WebSocketService;
  }

  static getInstance(): ChatServiceInternal {
    if (!(ChatServiceInternal as any).instance) {
      (ChatServiceInternal as any).instance = new ChatServiceInternal();
    }
    return (ChatServiceInternal as any).instance;
  }

  async getChats(userId: string): Promise<ChatPreview[]> {
    try {
      const response = await APIClient.get<ChatPreview[]>(
        `/chats/user/${userId}`,
      );
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  async getChat(chatId: string): Promise<Chat | null> {
    try {
      const response = await APIClient.get<Chat>(`/chats/${chatId}`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async getMessages(
    chatId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<Message[]> {
    try {
      const response = await APIClient.get<Message[]>(
        `/chats/${chatId}/messages`,
        { page, limit },
      );
      return response.success && response.data ? response.data : [];
    } catch (error) {
      return [];
    }
  }

  async sendMessage(
    chatId: string,
    content: string,
    messageType: "text" | "image" | "file" | "location" = "text",
    metadata?: any,
  ): Promise<Message | null> {
    try {
      const response = await APIClient.post<Message>("/messages", {
        chatId,
        content,
        messageType,
        metadata,
      });
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async createChat(clientId: string, driverId: string): Promise<Chat | null> {
    try {
      const response = await APIClient.post<Chat>("/chats", {
        clientId,
        driverId,
      });
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(
        `/chats/${chatId}/read`,
        { userId },
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await APIClient.get<{ count: number }>(
        `/chats/unread-count/${userId}`,
      );
      return (response.success && response.data?.count) || 0;
    } catch (error) {
      return 0;
    }
  }

  async deleteChat(chatId: string): Promise<boolean> {
    try {
      const response = await APIClient.delete<{ success: boolean }>(
        `/chats/${chatId}`,
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  }

  async blockUser(chatId: string, userId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(
        `/chats/${chatId}/block`,
        { userId },
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  }

  async unblockUser(chatId: string, userId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(
        `/chats/${chatId}/unblock`,
        { userId },
      );
      return (response.success && response.data?.success) || false;
    } catch (error) {
      return false;
    }
  }

  async uploadFile(
    file: any,
    chatId: string,
  ): Promise<{ url: string; fileName: string } | null> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("chatId", chatId);

      const response = await APIClient.post<{ url: string; fileName: string }>(
        "/chats/upload",
        formData as any,
      );
      return response.success && response.data ? response.data : null;
    } catch (error) {
      return null;
    }
  }

  // ===== REAL-TIME WEBSOCKET ФУНКЦИОНАЛЬНОСТЬ =====

  /**
   * Включение real-time режима для чата
   */
  async enableRealtime(): Promise<void> {
    if (this.isRealtimeEnabled) return;

    try {
      await this.ws.connect({
        onMessage: (message: WebSocketMessage) => {
          this.handleWebSocketMessage(message);
        },
        onError: (error) => {
          console.error("WebSocket ошибка в ChatService:", error);
        },
        onClose: () => {
          this.isRealtimeEnabled = false;
        },
        onOpen: () => {
          this.isRealtimeEnabled = true;
        },
      });

      this.isRealtimeEnabled = true;
    } catch (error) {
      console.error("Ошибка включения real-time режима:", error);
      throw error;
    }
  }

  /**
   * Обработка WebSocket сообщений
   */
  private handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case "chat_message":
        this.handleNewMessage(message.data as unknown as Message);
        break;
      case "typing_start":
        this.handleTypingStart(message.data as { chatId: string; userId: string; });
        break;
      case "typing_stop":
        this.handleTypingStop(message.data as { chatId: string; userId: string; });
        break;
      case "message_read":
        this.handleMessageRead(message.data as { messageId: string; readBy: string; });
        break;
      case "user_online":
        this.handleUserOnline(message.data as { userId: string; });
        break;
      case "user_offline":
        this.handleUserOffline(message.data as { userId: string; });
        break;
    }
  }

  /**
   * Обработка нового сообщения
   */
  private handleNewMessage(data: Message): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error("Ошибка в обработчике сообщений:", error);
      }
    });
  }

  /**
   * Обработка начала печати
   */
  private handleTypingStart(data: { chatId: string; userId: string }): void {
    this.typingHandlers.forEach((handler) => {
      try {
        handler(data.chatId, data.userId, true);
      } catch (error) {
        console.error("Ошибка в обработчике печати:", error);
      }
    });
  }

  /**
   * Обработка окончания печати
   */
  private handleTypingStop(data: { chatId: string; userId: string }): void {
    this.typingHandlers.forEach((handler) => {
      try {
        handler(data.chatId, data.userId, false);
      } catch (error) {
        console.error("Ошибка в обработчике печати:", error);
      }
    });
  }

  /**
   * Обработка прочтения сообщения
   */
  private handleMessageRead(data: { messageId: string; readBy: string }): void {
    // Можно добавить логику обновления статуса прочтения
    console.log("Сообщение прочитано:", data);
  }

  /**
   * Обработка статуса "онлайн"
   */
  private handleUserOnline(data: { userId: string }): void {
    console.log("Пользователь онлайн:", data.userId);
  }

  /**
   * Обработка статуса "оффлайн"
   */
  private handleUserOffline(data: { userId: string }): void {
    console.log("Пользователь оффлайн:", data.userId);
  }

  /**
   * Отправка сообщения через WebSocket (real-time)
   */
  async sendRealtimeMessage(
    chatId: string,
    content: string,
    messageType: "text" | "image" | "file" | "location" = "text",
    metadata?: any,
  ): Promise<boolean> {
    if (!this.isRealtimeEnabled || !this.ws.isReady()) {
      // Fallback на обычную отправку через API
      const result = await this.sendMessage(
        chatId,
        content,
        messageType,
        metadata,
      );
      return !!result;
    }

    try {
      this.ws.sendMessage("chat_message", {
        chatId,
        content,
        messageType,
        metadata,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Ошибка отправки real-time сообщения:", error);
      // Fallback на обычную отправку
      const result = await this.sendMessage(
        chatId,
        content,
        messageType,
        metadata,
      );
      return !!result;
    }
  }

  /**
   * Отправка сигнала "печатает"
   */
  sendTypingSignal(chatId: string, isTyping: boolean): void {
    if (!this.isRealtimeEnabled || !this.ws.isReady()) return;

    try {
      this.ws.sendMessage(isTyping ? "typing_start" : "typing_stop", {
        chatId,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Ошибка отправки сигнала печати:", error);
    }
  }

  /**
   * Подписка на новые сообщения
   */
  onNewMessage(handler: (message: Message) => void): () => void {
    this.messageHandlers.push(handler);

    // Возвращаем функцию для отписки
    return () => {
      const index = this.messageHandlers.indexOf(handler);
      if (index > -1) {
        this.messageHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Подписка на события печати
   */
  onTyping(
    handler: (chatId: string, userId: string, isTyping: boolean) => void,
  ): () => void {
    this.typingHandlers.push(handler);

    // Возвращаем функцию для отписки
    return () => {
      const index = this.typingHandlers.indexOf(handler);
      if (index > -1) {
        this.typingHandlers.splice(index, 1);
      }
    };
  }

  /**
   * Отметка сообщения как прочитанного (real-time)
   */
  markMessageAsReadRealtime(messageId: string): void {
    if (!this.isRealtimeEnabled || !this.ws.isReady()) return;

    try {
      this.ws.sendMessage("message_read", {
        messageId,
        readAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Ошибка отметки сообщения как прочитанного:", error);
    }
  }

  /**
   * Получение статуса real-time соединения
   */
  getRealtimeStatus(): {
    isEnabled: boolean;
    isConnected: boolean;
    isAuthenticated: boolean;
  } {
    const wsStatus = this.ws.getConnectionStatus();
    return {
      isEnabled: this.isRealtimeEnabled,
      isConnected: wsStatus.isConnected,
      isAuthenticated: wsStatus.isAuthenticated,
    };
  }

  /**
   * Отключение real-time режима
   */
  disableRealtime(): void {
    this.ws.disconnect();
    this.isRealtimeEnabled = false;
    this.messageHandlers = [];
    this.typingHandlers = [];
  }
}

// Export a ready-to-use instance to avoid "getChats is not a function" import mismatches
export const ChatService = ChatServiceInternal.getInstance();
export default ChatService;
