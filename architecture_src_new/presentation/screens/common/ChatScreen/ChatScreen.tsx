import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../core/context/ThemeContext';
import { useLanguage } from '../../../../core/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

// Components
import ChatList from './components/ChatList';
import ChatConversation from './components/ChatConversation';

// Styles
import { createChatScreenStyles } from './styles/ChatScreen.styles';

// Types
interface ChatScreenProps {
  route?: any;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createChatScreenStyles(isDark), [isDark]);
  const { t } = useLanguage();
  
  // State for navigation between chat list and conversation
  const [currentView, setCurrentView] = useState<'list' | 'conversation'>('list');
  const [selectedChat, setSelectedChat] = useState<any>(null);

  // Handle chat selection
  const handleChatPress = (chat: any) => {
    setSelectedChat(chat);
    setCurrentView('conversation');
  };

  // Handle back to chat list
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedChat(null);
  };

  // Render header
  const renderHeader = () => {
    if (currentView === 'conversation' && selectedChat) {
    return (
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleBackToList}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>
              {selectedChat.participant?.name || t('client.chat.title')}
          </Text>
            <Text style={styles.headerStatus}>
              {selectedChat.participant?.online ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
      );
    }

    return null; // ChatList has its own header
  };

  // Render content
  const renderContent = () => {
    if (currentView === 'conversation' && selectedChat) {
      return (
        <ChatConversation
          chat={selectedChat}
          onBack={handleBackToList}
        />
      );
    }

    return (
      <ChatList
        onChatPress={handleChatPress}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default ChatScreen;