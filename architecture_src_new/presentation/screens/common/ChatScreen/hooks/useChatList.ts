import { useState, useEffect, useMemo } from 'react';
import { Chat, ChatListFilters } from '../types/Chat';

export const useChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ChatListFilters>({
    searchQuery: '',
    showFavoritesOnly: false,
    sortBy: 'recent'
  });

  // Load chats from service
  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual ChatService call
      // const list = await ChatService.getChats();
      // setChats(list);
      
      // Mock data for now
      setChats([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort chats
  const filteredChats = useMemo(() => {
    let result = [...chats];

    // Apply search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(chat =>
        chat.participant?.name?.toLowerCase().includes(query) ||
        chat.lastMessage?.content?.toLowerCase().includes(query)
      );
    }

    // Apply favorites filter
    if (filters.showFavoritesOnly) {
      result = result.filter(chat => chat.isFavorite);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'alphabetical':
        result.sort((a, b) => 
          (a.participant?.name || '').localeCompare(b.participant?.name || '')
        );
        break;
      case 'unread':
        result.sort((a, b) => b.unreadCount - a.unreadCount);
        break;
      case 'recent':
      default:
        result.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        break;
    }

    return result;
  }, [chats, filters]);

  // Update filters
  const updateFilters = (newFilters: Partial<ChatListFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Refresh chats
  const refresh = () => {
    loadChats();
  };

  useEffect(() => {
    loadChats();
  }, []);

  return {
    chats,
    filteredChats,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
    loadChats
  };
};
