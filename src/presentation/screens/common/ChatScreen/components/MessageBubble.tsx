import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/ChatScreen.styles';

/**
 * Message Bubble Component
 * 
 * Individual message bubble with sender info and status
 * Supports different message types and status indicators
 */

interface MessageBubbleProps {
  item: any;
  isDark: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  item,
  isDark,
}) => {
  const isMine = item.senderId === 'me';

  return (
    <View style={[styles.messageContainer, isMine ? styles.userMessage : styles.clientMessage]}>
      {!isMine && (
        <View style={[styles.messageAvatar, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]}>
          <Ionicons name="person" size={16} color={isDark ? '#fff' : '#666'} />
        </View>
      )}
      
      <View style={[
        styles.messageBubble, 
        !isMine && styles.otherMessage,
        { backgroundColor: isMine ? (isDark ? '#2a2a2a' : '#e3f2fd') : (isDark ? '#333' : '#f5f5f5') }
      ]}>
        <Text style={[
          styles.messageText, 
          !isMine && styles.otherMessageText,
          { color: isMine ? (isDark ? '#fff' : '#000') : (isDark ? '#fff' : '#000') }
        ]}>
          {item.content}
        </Text>
        
        <View style={styles.messageStatus}>
          <Text style={[styles.messageTime, { color: isDark ? '#999' : '#666' }]}>
            {item.formattedTime}
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
