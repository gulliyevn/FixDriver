/**
 * Chat domain types
 */

/**
 * Allowed message authors.
 */
export type MessageSender = 'client' | 'driver';

/**
 * Allowed message content types.
 */
export type MessageType = 'text' | 'image' | 'file' | 'location';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderType: MessageSender;
  content: string;
  type: MessageType;
  timestamp: string;
  isRead: boolean;
  metadata?: {
    tripId?: string;
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
  participant?: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
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
  type: MessageType;
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
