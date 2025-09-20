import { Chat, ChatMessage, ChatParticipant } from '../../presentation/screens/common/ChatScreen/types/Chat';
import { MessageType } from '../../presentation/screens/common/ChatScreen/types/Message';
import { mockChats, mockMessages } from '../../shared/mocks/chatMocks';

class ChatService {
  private static instance: ChatService;
  private chats: Chat[] = [...mockChats];
  private messages: Map<string, ChatMessage[]> = new Map();

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Get all chats
  async getChats(): Promise<Chat[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.chats];
  }

  // Get messages for a specific chat
  async getMessages(chatId: string): Promise<ChatMessage[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (chatId === 'chat_1') {
      return [...mockMessages];
    }
    
    return this.messages.get(chatId) || [];
  }

  // Send a message
  async sendMessage(chatId: string, content: string, type: 'text' | 'image' | 'location' | 'document' = 'text', metadata?: any): Promise<ChatMessage> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      content,
      senderId: 'me',
      timestamp: new Date().toISOString(),
      status: 'sent',
      type,
      metadata
    };

    // Add message to chat
    const chatMessages = this.messages.get(chatId) || [];
    chatMessages.push(newMessage);
    this.messages.set(chatId, chatMessages);

    // Update chat's last message
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = newMessage;
      chat.updatedAt = newMessage.timestamp;
    }

    return newMessage;
  }

  // Delete a chat
  async deleteChat(chatId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.chats = this.chats.filter(chat => chat.id !== chatId);
    this.messages.delete(chatId);
  }

  // Clear chat messages
  async clearChat(chatId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.messages.set(chatId, []);
  }

  // Mark messages as read
  async markAsRead(chatId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount = 0;
    }
  }

  // Format message time
  static formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 1000 * 60) {
      return 'now';
    } else if (diff < 1000 * 60 * 60) {
      return `${Math.floor(diff / (1000 * 60))}m`;
    } else if (diff < 1000 * 60 * 60 * 24) {
      return `${Math.floor(diff / (1000 * 60 * 60))}h`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Toggle favorite
  async toggleFavorite(chatId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.isFavorite = !chat.isFavorite;
    }
  }
}

export default ChatService;
