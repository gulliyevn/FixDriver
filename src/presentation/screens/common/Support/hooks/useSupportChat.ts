import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { SupportService } from '../../../../../data/datasources/support/SupportService';

/**
 * Support Chat Hook
 * 
 * Manages support chat state and operations
 */

interface UseSupportChatParams {
  initialMessage?: string;
  quickQuestion?: string;
}

export const useSupportChat = (params?: UseSupportChatParams) => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<any[]>([]);
  const [currentTicket, setCurrentTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);

  useEffect(() => {
    initializeChat();
  }, [params]);

  const initializeChat = async () => {
    setIsLoading(true);
    
    try {
      const initialMessage = params?.initialMessage || t('support.initialMessage');
      const ticket = SupportService.createSupportTicket(t('support.chatTitle'), initialMessage);
      setCurrentTicket(ticket);
      
      const displayMessages = ticket.messages.map((msg: any) => ({
        id: msg.id,
        text: msg.text,
        isUser: msg.sender === 'user',
        timestamp: msg.timestamp,
      }));
      
      setMessages(displayMessages);
      
      if (params?.quickQuestion) {
        selectQuickQuestion(params.quickQuestion);
      }
      
    } catch (error) {
      console.error('Error initializing support chat:', error);
      Alert.alert(t('errors.error'), t('support.initError'));
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText: string, files: any[] = []) => {
    if ((!messageText.trim() && files.length === 0) || !currentTicket) return;

    try {
      SupportService.addUserMessage(currentTicket.id, messageText);
      
      const userMessage = {
        id: Date.now().toString(),
        text: messageText,
        isUser: true,
        timestamp: new Date(),
        attachments: files.length > 0 ? files : undefined,
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      SupportService.simulateSupportResponse(currentTicket.id, messageText);
      
      const updatedTicket = SupportService.getCurrentTicket();
      if (updatedTicket) {
        setCurrentTicket(updatedTicket);
        
        setTimeout(() => {
          const lastSupportMessage = updatedTicket.messages[updatedTicket.messages.length - 1];
          if (lastSupportMessage && lastSupportMessage.sender === 'support') {
            const supportMessage = {
              id: lastSupportMessage.id,
              text: lastSupportMessage.text,
              isUser: false,
              timestamp: lastSupportMessage.timestamp,
            };
            setMessages(prev => [...prev, supportMessage]);
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(t('errors.error'), t('support.sendError'));
    }
  };

  const selectQuickQuestion = async (question: string) => {
    if (!currentTicket) return;
    
    try {
      SupportService.addUserMessage(currentTicket.id, question);
      
      const userMessage = {
        id: Date.now().toString(),
        text: question,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      SupportService.simulateSupportResponse(currentTicket.id, question);
      
      const updatedTicket = SupportService.getCurrentTicket();
      if (updatedTicket) {
        setCurrentTicket(updatedTicket);
        
        setTimeout(() => {
          const lastSupportMessage = updatedTicket.messages[updatedTicket.messages.length - 1];
          if (lastSupportMessage && lastSupportMessage.sender === 'support') {
            const supportMessage = {
              id: lastSupportMessage.id,
              text: lastSupportMessage.text,
              isUser: false,
              timestamp: lastSupportMessage.timestamp,
            };
            setMessages(prev => [...prev, supportMessage]);
          }
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error selecting quick question:', error);
      Alert.alert(t('errors.error'), t('support.quickQuestionError'));
    }
  };

  const removeAttachedFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleClose = () => {
    Alert.alert(
      t('support.closeChat'),
      t('support.closeChatConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('support.close'), style: 'destructive' }
      ]
    );
  };

  return {
    messages,
    isLoading,
    currentTicket,
    attachedFiles,
    setAttachedFiles,
    initializeChat,
    sendMessage,
    selectQuickQuestion,
    removeAttachedFile,
    handleClose
  };
};
