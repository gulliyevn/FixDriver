import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ChatListScreen.styles';

/**
 * Empty State Component
 * 
 * Displays when no chats or messages are available
 * Shows different content for chat list vs individual chat
 */

interface EmptyStateProps {
  loading: boolean;
  isDark: boolean;
  isChat?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  loading,
  isDark,
  isChat = false,
}) => {
  const { t } = useI18n();

  const getTitle = () => {
    if (loading) {
      return isChat ? t('chat.loadingMessages') : t('chat.loadingChats');
    }
    return isChat ? t('chat.noMessages') : t('chat.noChats');
  };

  const getSubtitle = () => {
    if (loading) return null;
    return isChat ? t('chat.startConversation') : t('chat.startNewChat');
  };

  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="chatbubbles-outline"
        size={64}
        color={isDark ? '#6B7280' : '#9CA3AF'}
      />
      <Text style={[styles.emptyStateTitle, { color: isDark ? '#fff' : '#000' }]}>
        {getTitle()}
      </Text>
      {getSubtitle() && (
        <Text style={[styles.emptyStateSubtitle, { color: isDark ? '#ccc' : '#666' }]}>
          {getSubtitle()}
        </Text>
      )}
    </View>
  );
};
