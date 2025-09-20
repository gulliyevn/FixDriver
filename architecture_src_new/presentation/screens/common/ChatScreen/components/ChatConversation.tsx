import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { createChatScreenStyles } from '../styles/ChatScreen.styles';

interface ChatConversationProps {
  chat: any;
  onBack: () => void;
}

const ChatConversation: React.FC<ChatConversationProps> = ({ chat, onBack }) => {
  const { isDark } = useTheme();
  const styles = createChatScreenStyles(isDark);

  return (
    <View style={styles.container}>
      <View style={styles.messagesContent}>
        <Text style={styles.emptyStateTitle}>
          Chat with {chat.participant?.name || 'Unknown User'}
        </Text>
        <Text style={styles.emptyStateSubtitle}>
          This is a placeholder for the chat conversation
        </Text>
      </View>
    </View>
  );
};

export default ChatConversation;
