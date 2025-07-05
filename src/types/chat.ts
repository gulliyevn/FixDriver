export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'client' | 'driver';
  content: string;
  type: 'text' | 'image' | 'file' | 'location';
  timestamp: string;
  isRead: boolean;
  metadata?: {
    imageUrl?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
  };
}

export interface Chat {
  id: string;
  clientId: string;
  driverId: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatPreview {
  id: string;
  participantName: string;
  participantAvatar: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'location';
  metadata?: Message['metadata'];
}

export interface CreateChatRequest {
  participantId: string;
  participantName: string;
  tripId?: string;
}

export interface ChatNotification {
  chatId: string;
  message: Message;
  senderName: string;
  senderAvatar: string | null;
}
