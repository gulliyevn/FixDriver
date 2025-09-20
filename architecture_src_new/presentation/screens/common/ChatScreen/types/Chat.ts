// Chat-related types for the ChatScreen module

export interface ChatParticipant {
  id: string;
  name: string;
  surname?: string;
  phone?: string;
  avatar?: string;
  car?: string;
  rating?: string;
  online?: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'location' | 'document';
  metadata?: {
    imageUrl?: string;
    fileSize?: number;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface Chat {
  id: string;
  participant: ChatParticipant;
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface ChatListFilters {
  searchQuery: string;
  showFavoritesOnly: boolean;
  sortBy: 'recent' | 'alphabetical' | 'unread';
}

export interface ChatSelectionState {
  isSelectionMode: boolean;
  selectedIds: Set<string>;
  totalSelected: number;
}

export interface ChatActions {
  onChatPress: (chat: Chat) => void;
  onChatLongPress: (chat: Chat) => void;
  onToggleFavorite: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onMarkAsRead: (chatIds: string[]) => void;
  onDeleteSelected: (chatIds: string[]) => void;
}

export interface ChatListState {
  chats: Chat[];
  filteredChats: Chat[];
  loading: boolean;
  error?: string;
  filters: ChatListFilters;
  selection: ChatSelectionState;
}

export interface ChatListProps {
  onChatPress: (chat: Chat) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export interface ActionButtonsProps {
  selectionMode: boolean;
  selectedCount: number;
  totalCount: number;
  onToggleSelection: () => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onMarkAsRead: () => void;
}

export interface EmptyStateProps {
  loading: boolean;
  hasSearchQuery: boolean;
  onStartNewChat?: () => void;
}
