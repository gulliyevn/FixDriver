import React from 'react';
import { SafeAreaView, View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useI18n } from '../../../../shared/hooks/useI18n';
import { useChatMessages } from './hooks/useChatMessages';
import { useChatActions } from './hooks/useChatActions';
import { MessageBubble } from './components/MessageBubble';
import { EmptyState } from './components/EmptyState';
import { AttachmentMenu } from './components/AttachmentMenu';
import { CallSheet } from './components/CallSheet';
import { ProfileSheet } from './components/ProfileSheet';
import { ActionsSheet } from './components/ActionsSheet';
import { styles } from './styles/ChatScreen.styles';

/**
 * Chat Screen Component
 * 
 * Individual chat conversation screen with messaging capabilities
 * Supports text messages, attachments, calls, and profile management
 * Integrates with gRPC services for real-time messaging
 */

interface ChatScreenProps {
  route?: {
    params?: {
      driverId?: string;
      driverName?: string;
      driverCar?: string;
      driverNumber?: string;
      driverRating?: string;
      driverStatus?: 'online' | 'offline';
      driverPhoto?: string;
    };
  };
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  
  const chatId = route?.params?.driverId || 'chat_1';
  const chatName = route?.params?.driverName || t('chat.title');
  const driverCar = route?.params?.driverCar;
  const driverNumber = route?.params?.driverNumber;
  const driverRating = route?.params?.driverRating || '4.8';
  const driverStatus = route?.params?.driverStatus || 'offline';
  const driverPhoto = route?.params?.driverPhoto;

  const {
    messages,
    loading,
    text,
    setText,
    sendMessage,
    refreshMessages,
  } = useChatMessages(chatId);

  const {
    showAttachments,
    setShowAttachments,
    showCallSheet,
    setShowCallSheet,
    showProfileSheet,
    setShowProfileSheet,
    showActionsSheet,
    setShowActionsSheet,
    attachFromCamera,
    attachFromGallery,
    attachDocument,
    attachLocation,
    handleClearChat,
    handleExportChat,
    handleDeleteChat,
    handleReport,
    handleBlock,
    handleInternetCall,
    handleNetworkCall,
  } = useChatActions(chatId);

  const headerDetails = [driverCar, driverNumber].filter(Boolean).join(' · ');

  const renderMessage = ({ item }: { item: any }) => (
    <MessageBubble
      item={item}
      isDark={isDark}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      loading={loading}
      isDark={isDark}
      isChat={true}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <TouchableOpacity 
          style={styles.headerAvatar} 
          onPress={() => setShowProfileSheet(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={20} color="#fff" />
          <View style={driverStatus === 'online' ? styles.headerOnlineIndicator : styles.headerOfflineIndicator} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerInfo} 
          onPress={() => setShowProfileSheet(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.headerName, { color: isDark ? '#fff' : '#000' }]}>
            {chatName}
          </Text>
          {headerDetails && (
            <Text style={[styles.headerStatus, { color: isDark ? '#ccc' : '#666' }]}>
              {headerDetails}
            </Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setShowCallSheet(true)}
          >
            <Ionicons name="call" size={20} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setShowActionsSheet(true)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList 
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={refreshMessages}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.inputAvoider}
      >
        <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <View style={styles.inputRow}>
            <TouchableOpacity 
              style={styles.toolbarButton}
              onPress={() => setShowAttachments(!showAttachments)}
            >
              <Ionicons name="add" size={18} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                color: isDark ? '#fff' : '#000'
              }]}
              value={text}
              onChangeText={setText}
              placeholder={t('chat.messagePlaceholder')}
              placeholderTextColor={isDark ? '#666' : '#999'}
              multiline
              maxLength={1000}
            />
            
            <TouchableOpacity 
              style={[styles.sendButton, !text.trim() && { opacity: 0.5 }]} 
              onPress={sendMessage} 
              disabled={!text.trim()}
            >
              <Ionicons name="send" size={18} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
          
          {showAttachments && (
            <AttachmentMenu
              onCamera={attachFromCamera}
              onGallery={attachFromGallery}
              onDocument={attachDocument}
              onLocation={attachLocation}
              isDark={isDark}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      <CallSheet
        visible={showCallSheet}
        onClose={() => setShowCallSheet(false)}
        onInternetCall={handleInternetCall}
        onNetworkCall={handleNetworkCall}
        isDark={isDark}
      />

      <ProfileSheet
        visible={showProfileSheet}
        onClose={() => setShowProfileSheet(false)}
        chatName={chatName}
        driverCar={driverCar}
        driverNumber={driverNumber}
        driverRating={driverRating}
        driverStatus={driverStatus}
        isDark={isDark}
      />

      <ActionsSheet
        visible={showActionsSheet}
        onClose={() => setShowActionsSheet(false)}
        onClearChat={handleClearChat}
        onExportChat={handleExportChat}
        onDeleteChat={handleDeleteChat}
        onReport={handleReport}
        onBlock={handleBlock}
        isDark={isDark}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
