export interface Chat {
  id: string;
  orderId: string;
  clientId: string;
  driverId: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'client' | 'driver';
  content: string;
  type: 'text' | 'image' | 'location';
  createdAt: string;
  isRead: boolean;
  metadata?: Record<string, any>;
}

export interface ChatResult {
  success: boolean;
  chat?: Chat;
  chats?: Chat[];
  messages?: Message[];
  error?: string;
}
