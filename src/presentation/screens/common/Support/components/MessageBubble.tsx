import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/SupportChatScreen.styles';

/**
 * Message Bubble Component
 * 
 * Renders individual support chat messages with attachments
 */

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    attachments?: Array<{
      id: string;
      name: string;
      type: 'image' | 'document';
    }>;
  };
  isDark: boolean;
  formatTime: (date: Date) => string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isDark,
  formatTime
}) => {
  const { t } = useI18n();

  return (
    <View style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.supportMessage
    ]}>
      <View style={[
        styles.messageBubble,
        message.isUser 
          ? [styles.userBubble, isDark && styles.userBubbleDark]
          : [styles.supportBubble, isDark && styles.supportBubbleDark]
      ]}>
        {!message.isUser && (
          <View style={styles.supportHeader}>
            <Ionicons name="person-circle" size={16} color="#003366" />
            <Text style={styles.supportName}>{t('support.supportName')}</Text>
          </View>
        )}
        
        <Text style={[
          styles.messageText,
          message.isUser 
            ? styles.userMessageText
            : [styles.supportMessageText, isDark && styles.supportMessageTextDark]
        ]}>
          {message.text}
        </Text>
        
        {message.attachments && message.attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            {message.attachments.map((file) => (
              <View key={file.id} style={styles.attachmentItem}>
                {file.type === 'image' ? (
                  <View style={styles.imageAttachment}>
                    <Ionicons name="image" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    <Text style={[
                      styles.attachmentName,
                      isDark && styles.attachmentNameDark
                    ]}>
                      {file.name}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.documentAttachment}>
                    <Ionicons name="document" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    <Text style={[
                      styles.attachmentName,
                      isDark && styles.attachmentNameDark
                    ]}>
                      {file.name}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        
        <Text style={[
          styles.messageTime,
          message.isUser 
            ? styles.userMessageTime
            : [styles.supportMessageTime, isDark && styles.supportMessageTimeDark]
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};
