import { useState, useEffect, useRef } from 'react';
import { ChatService } from '../../../../../data/datasources/chat/ChatService';

/**
 * Chat Messages Hook
 * 
 * Manages individual chat messages and sending
 * Handles message state and real-time updates
 */

export const useChatMessages = (chatId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<any>(null);

  const chatService = new ChatService();

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messagesList = await chatService.getMessages(chatId);
      setMessages(messagesList);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    
    try {
      const msg = await chatService.sendMessage(chatId, text.trim());
      setMessages((prev) => [...prev, msg]);
      setText('');
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const refreshMessages = async () => {
    await loadMessages();
  };

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  return {
    messages,
    text,
    setText,
    loading,
    sendMessage,
    refreshMessages,
    listRef,
  };
};
