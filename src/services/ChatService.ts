import APIClient from './APIClient';

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
  messageType: 'text' | 'image' | 'file' | 'location';
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
  private static instance: ChatService;

  static getInstance(): ChatServiceInternal {
    if (!(ChatServiceInternal as any).instance) {
      (ChatServiceInternal as any).instance = new ChatServiceInternal();
    }
    return (ChatServiceInternal as any).instance;
  }

  async getChats(userId: string): Promise<ChatPreview[]> {
    try {
      const response = await APIClient.get<ChatPreview[]>(`/chats/user/${userId}`);
      return response.success && response.data ? response.data : [];
    } catch (error) {
      console.error('Get chats error:', error);
      return [];
    }
  }

  async getChat(chatId: string): Promise<Chat | null> {
    try {
      const response = await APIClient.get<Chat>(`/chats/${chatId}`);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Get chat error:', error);
      return null;
    }
  }

  async getMessages(chatId: string, page: number = 1, limit: number = 50): Promise<Message[]> {
    try {
      const response = await APIClient.get<Message[]>(`/chats/${chatId}/messages`, { page, limit });
      return response.success && response.data ? response.data : [];
    } catch (error) {
      console.error('Get messages error:', error);
      return [];
    }
  }

  async sendMessage(
    chatId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' | 'location' = 'text',
    metadata?: any
  ): Promise<Message | null> {
    try {
      const response = await APIClient.post<Message>('/messages', {
        chatId,
        content,
        messageType,
        metadata
      });
      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Send message error:', error);
      return null;
    }
  }

  async createChat(clientId: string, driverId: string): Promise<Chat | null> {
    try {
      const response = await APIClient.post<Chat>('/chats', { clientId, driverId });
      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Create chat error:', error);
      return null;
    }
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/chats/${chatId}/read`, { userId });
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Mark messages as read error:', error);
      return false;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await APIClient.get<{ count: number }>(`/chats/unread-count/${userId}`);
      return response.success && response.data?.count || 0;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  async deleteChat(chatId: string): Promise<boolean> {
    try {
      const response = await APIClient.delete<{ success: boolean }>(`/chats/${chatId}`);
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Delete chat error:', error);
      return false;
    }
  }

  async blockUser(chatId: string, userId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/chats/${chatId}/block`, { userId });
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Block user error:', error);
      return false;
    }
  }

  async unblockUser(chatId: string, userId: string): Promise<boolean> {
    try {
      const response = await APIClient.post<{ success: boolean }>(`/chats/${chatId}/unblock`, { userId });
      return response.success && response.data?.success || false;
    } catch (error) {
      console.error('Unblock user error:', error);
      return false;
    }
  }

  async uploadFile(file: any, chatId: string): Promise<{ url: string; fileName: string } | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', chatId);

      const response = await APIClient.post<{ url: string; fileName: string }>('/chats/upload', formData);
      return response.success && response.data ? response.data : null;
    } catch (error) {
      console.error('Upload file error:', error);
      return null;
    }
  }
}

// Export a ready-to-use instance to avoid "getChats is not a function" import mismatches
export const ChatService = ChatServiceInternal.getInstance();
export default ChatService;