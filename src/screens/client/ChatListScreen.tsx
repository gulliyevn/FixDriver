import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { ClientStackParamList } from '../../navigation/ClientNavigator';
import ChatService from '../../services/ChatService';
import { Chat } from '../../types/chat';
import { formatTime } from '../../utils/formatters';
import { ChatListScreenStyles } from '../../styles/screens/ChatListScreen.styles';

type ChatListScreenNavigationProp = StackNavigationProp<ClientStackParamList, 'ChatList'>;

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<ChatListScreenNavigationProp>();

  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const filterChats = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }

    const filtered = chats.filter(chat => 
      chat.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);
  }, [chats, searchQuery]);

  useEffect(() => {
    filterChats();
  }, [filterChats]);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const chatList = await ChatService.getChatList();
      setChats(chatList);
    } catch (err) {
      console.error('Failed to load chats:', err);
      Alert.alert('Error', 'Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChats();
    setRefreshing(false);
  };

  const handleChatPress = (chat: Chat) => {
    navigation.navigate('Chat', { chatId: chat.id, participant: chat.participant });
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const lastMessage = item.lastMessage;
    const unreadCount = item.unreadCount || 0;

    return (
      <TouchableOpacity
        style={ChatListScreenStyles.chatItem}
        onPress={() => handleChatPress(item)}
        activeOpacity={0.7}
      >
        <View style={ChatListScreenStyles.avatarContainer}>
          <View style={ChatListScreenStyles.avatar}>
            <Text style={ChatListScreenStyles.avatarText}>
              {item.participant.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          {unreadCount > 0 && (
            <View style={ChatListScreenStyles.badge}>
              <Text style={ChatListScreenStyles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        <View style={ChatListScreenStyles.chatInfo}>
          <View style={ChatListScreenStyles.chatHeader}>
            <Text style={ChatListScreenStyles.participantName} numberOfLines={1}>
              {item.participant.name}
            </Text>
            {lastMessage && (
              <Text style={ChatListScreenStyles.messageTime}>
                {formatTime(lastMessage.timestamp)}
              </Text>
            )}
          </View>

          <View style={ChatListScreenStyles.messagePreview}>
            {lastMessage ? (
              <>
                <Text style={ChatListScreenStyles.lastMessage} numberOfLines={1}>
                  {lastMessage.content}
                </Text>
                {unreadCount > 0 && (
                  <View style={ChatListScreenStyles.unreadIndicator} />
                )}
              </>
            ) : (
              <Text style={ChatListScreenStyles.noMessages}>No messages yet</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={ChatListScreenStyles.emptyState}>
      <Text style={ChatListScreenStyles.emptyStateTitle}>No Chats Yet</Text>
      <Text style={ChatListScreenStyles.emptyStateSubtitle}>
        Start a conversation with a driver to see your chats here
      </Text>
    </View>
  );

  return (
    <View style={ChatListScreenStyles.container}>
      {/* Search Bar */}
      <View style={ChatListScreenStyles.searchContainer}>
        <View style={ChatListScreenStyles.searchInput}>
          <Text style={ChatListScreenStyles.searchIcon}>🔍</Text>
          <Text style={ChatListScreenStyles.searchPlaceholder}>
            {searchQuery || 'Search chats...'}
          </Text>
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={ChatListScreenStyles.chatList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

export default ChatListScreen; 