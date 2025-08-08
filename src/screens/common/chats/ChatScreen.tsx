import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { createChatScreenStyles } from '../../../styles/screens/ChatScreen.styles';
import { ChatService } from '../../../services/ChatService';

const ChatScreen: React.FC<{ route?: any }> = ({ route }) => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createChatScreenStyles(isDark), [isDark]);
  const { t } = useLanguage();
  const chatId = route?.params?.driverId || 'chat_1';
  const chatName = route?.params?.driverName || t('client.chat.title');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAttachments, setShowAttachments] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const messagesList = await ChatService.getMessages(chatId);
      setMessages(messagesList);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    if (!text.trim()) return;
    
    try {
      const msg = await ChatService.sendMessage(chatId, text.trim());
      setMessages((prev) => [...prev, msg]);
      setText('');
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (error) {
      Alert.alert(t('chat.messageError'), t('chat.messageError'));
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMine = item.senderId === 'me';
    return (
      <View style={[styles.messageContainer, isMine ? styles.userMessage : styles.clientMessage]}>
        {!isMine && (
          <View style={styles.messageAvatar}>
            <Ionicons name="person" size={16} color="#fff" />
          </View>
        )}
        
        <View style={[styles.messageBubble, !isMine && styles.otherMessage]}>
          <Text style={[styles.messageText, !isMine && styles.otherMessageText]}>
            {item.content}
          </Text>
          
          <View style={styles.messageStatus}>
            <Text style={styles.messageTime}>
              {ChatService.formatMessageTime(item.timestamp)}
            </Text>
            {isMine && (
              <Ionicons 
                name={item.status === 'sent' ? 'checkmark' : item.status === 'delivered' ? 'checkmark-done' : 'time'} 
                size={12} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
                style={styles.statusIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name="chatbubbles-outline" 
        size={64} 
        color={isDark ? '#6B7280' : '#9CA3AF'} 
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>
        {loading ? t('chat.loadingMessages') : t('chat.noMessages')}
      </Text>
      {!loading && (
        <Text style={styles.emptyStateSubtitle}>
          {t('chat.startConversation')}
        </Text>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingIndicator}>
      <Text style={styles.typingText}>{t('chat.typing')}</Text>
    </View>
  );

  const renderAttachmentMenu = () => (
    <View style={styles.attachmentMenu}>
      <TouchableOpacity style={styles.attachmentOption}>
        <Ionicons name="camera" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
        <Text style={styles.attachmentOptionText}>{t('chat.camera')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.attachmentOption}>
        <Ionicons name="images" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
        <Text style={styles.attachmentOptionText}>{t('chat.gallery')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.attachmentOption}>
        <Ionicons name="document" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
        <Text style={styles.attachmentOptionText}>{t('chat.document')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.attachmentOption}>
        <Ionicons name="location" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
        <Text style={styles.attachmentOptionText}>{t('chat.location')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerAvatar}>
          <Ionicons name="person" size={20} color="#fff" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chatName || t('client.chat.title')}</Text>
          <Text style={styles.headerStatus}>
            {route?.params?.driverStatus === 'online' ? t('chat.online') : t('chat.offline')}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="videocam" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList 
        ref={listRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderTypingIndicator}
        refreshing={loading}
        onRefresh={loadMessages}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={styles.toolbarButton}
            onPress={() => setShowAttachments(!showAttachments)}
          >
            <Ionicons name="add" size={18} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder={t('components.input.message')}
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !text.trim() && { opacity: 0.5 }]} 
            onPress={send} 
            disabled={!text.trim()}
          >
            <Ionicons name="send" size={18} style={styles.sendIcon as any} />
          </TouchableOpacity>
        </View>
        
        {showAttachments && renderAttachmentMenu()}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;


