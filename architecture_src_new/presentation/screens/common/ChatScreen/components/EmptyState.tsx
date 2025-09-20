import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmptyStateProps } from '../types/Chat';
import { createChatListScreenStyles } from '../styles/ChatListScreen.styles';
import { useTheme } from '../../../../../core/context/ThemeContext';

const EmptyState: React.FC<EmptyStateProps> = ({
  loading,
  hasSearchQuery,
  onStartNewChat
}) => {
  const { isDark } = useTheme();
  const styles = createChatListScreenStyles(isDark);

  const getTitle = () => {
    if (loading) return 'Loading chats...';
    if (hasSearchQuery) return 'No chats found';
    return 'No chats';
  };

  const getSubtitle = () => {
    if (loading) return '';
    if (hasSearchQuery) return 'Try adjusting your search';
    return 'Start a new chat';
  };

  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="chatbubbles-outline"
        size={64}
        color={isDark ? '#6B7280' : '#9CA3AF'}
      />
      <Text style={styles.emptyStateTitle}>
        {getTitle()}
      </Text>
      {!loading && (
        <Text style={styles.emptyStateSubtitle}>
          {getSubtitle()}
        </Text>
      )}
    </View>
  );
};

export default EmptyState;
