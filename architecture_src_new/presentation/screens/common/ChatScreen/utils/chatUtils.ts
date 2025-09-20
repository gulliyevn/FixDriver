// Chat utility functions

export const formatMessageTime = (timestamp: string): string => {
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
};

export const validateMessage = (content: string): boolean => {
  return content.trim().length > 0 && content.length <= 1000;
};

export const generateChatId = (): string => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const parseChatData = (rawData: any) => {
  return {
    id: rawData.id || generateChatId(),
    participant: rawData.participant || null,
    lastMessage: rawData.lastMessage || null,
    unreadCount: rawData.unreadCount || 0,
    updatedAt: rawData.updatedAt || new Date().toISOString(),
    createdAt: rawData.createdAt || new Date().toISOString(),
    isFavorite: rawData.isFavorite || false
  };
};

export const sortChatsByRecent = (chats: any[]) => {
  return chats.sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

export const sortChatsByUnread = (chats: any[]) => {
  return chats.sort((a, b) => b.unreadCount - a.unreadCount);
};

export const sortChatsAlphabetically = (chats: any[]) => {
  return chats.sort((a, b) => 
    (a.participant?.name || '').localeCompare(b.participant?.name || '')
  );
};
