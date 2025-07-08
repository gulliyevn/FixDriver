import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import ChatService from '../../services/ChatService';
import { Chat } from '../../types/chat';
import { ChatListScreenStyles } from '../../styles/screens/ChatListScreen.styles';
import { useTheme } from '../../context/ThemeContext';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'ChatList'>;

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const chatList = await ChatService.getChats('me');
      setChats(chatList);
    } catch (error) {
      console.error('Error loading chats:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить чаты');
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.participant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat: Chat) => {
    if (chat.participant) {
      navigation.navigate('Chat', { 
        chatId: chat.id, 
        participant: chat.participant 
      });
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={ChatListScreenStyles.chatItem}
      onPress={() => handleChatPress(item)}
    >
      <View style={ChatListScreenStyles.avatarContainer}>
        <View style={ChatListScreenStyles.avatar}>
          <Text style={ChatListScreenStyles.avatarText}>
            {item.participant?.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={ChatListScreenStyles.badge}>
            <Text style={ChatListScreenStyles.badgeText}>
              {item.unreadCount > 99 ? '99+' : item.unreadCount}
            </Text>
          </View>
        )}
      </View>

      <View style={ChatListScreenStyles.chatInfo}>
        <Text style={ChatListScreenStyles.participantName} numberOfLines={1}>
          {item.participant?.name}
        </Text>
        <Text style={ChatListScreenStyles.messageTime}>
          {ChatService.formatMessageTime(item.updatedAt)}
        </Text>
      </View>

      <View style={ChatListScreenStyles.messagePreview}>
        <Text style={ChatListScreenStyles.messageText} numberOfLines={2}>
          {item.lastMessage?.content || 'Нет сообщений'}
        </Text>
        {item.unreadCount > 0 && (
          <View style={ChatListScreenStyles.unreadIndicator} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={ChatListScreenStyles.emptyState}>
      <Text style={ChatListScreenStyles.emptyStateTitle}>No Chats Yet</Text>
      <Text style={ChatListScreenStyles.emptyStateSubtitle}>
        Start a conversation with a driver to see your chats here
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={ChatListScreenStyles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={ChatListScreenStyles.loadingContainer}>
          <Text style={ChatListScreenStyles.loadingText}>Loading chats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={ChatListScreenStyles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={ChatListScreenStyles.header}>
        <Text style={ChatListScreenStyles.headerTitle}>Чаты</Text>
        <View style={ChatListScreenStyles.searchContainer}>
          <Text style={ChatListScreenStyles.searchIcon}>🔍</Text>
          <TextInput
            style={ChatListScreenStyles.searchInput}
            placeholder="Поиск чатов..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={ChatListScreenStyles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

export default ChatListScreen; 