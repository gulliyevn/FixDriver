import { useState, useEffect, useMemo } from 'react';
import { ChatService } from '../../../../../data/datasources/chat/ChatService';

/**
 * Chat List Hook
 * 
 * Manages chat list state and operations
 * Handles search, filtering, and favorites
 */

export const useChatList = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const chatService = new ChatService();

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 200);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const filteredChats = useMemo(() => {
    const base = chats.map(c => ({ ...c, isFavorite: favorites.has(c.id) }));
    const list = !debouncedQuery
      ? base
      : base.filter(chat =>
          chat.participant?.name?.toLowerCase().includes(debouncedQuery) ||
          chat.lastMessage?.content?.toLowerCase().includes(debouncedQuery)
        );
    
    // Sort: favorites first, then by updatedAt desc
    return list.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [chats, debouncedQuery, favorites]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const list = await chatService.getChats();
      setChats(list);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshChats = async () => {
    await loadChats();
  };

  const toggleFavorite = (chatId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(chatId)) next.delete(chatId); else next.add(chatId);
      return next;
    });
  };

  const deleteChat = async (chatId: string) => {
    try {
      await chatService.deleteChat(chatId);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  return {
    chats,
    filteredChats,
    favorites,
    loading,
    searchQuery,
    setSearchQuery,
    refreshChats,
    toggleFavorite,
    deleteChat,
  };
};
