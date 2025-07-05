import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
  FlatList,
  RefreshControl
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { notificationService, Notification } from '../../services/NotificationService';
import { ChatService } from '../../services/ChatService';
import { Chat } from '../../types/chat';
import { ChatListScreenStyles } from '../../styles/screens/ChatListScreen.styles';
import AppAvatar from '../../components/AppAvatar';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'ChatList'>;

interface ChatListScreenProps {
  navigation: NavigationProp;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const route = useRoute();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadChats();
    loadNotifications();
  }, []);

  useEffect(() => {
    filterChats();
  }, [chats, searchQuery]);

  useFocusEffect(
    React.useCallback(() => {
      loadChats();
      loadNotifications();
    }, [])
  );

  const loadChats = async () => {
    setLoading(true);
    try {
      const chatsData = await ChatService.getChats();
      setChats(chatsData);
    } catch {
      Alert.alert('Ошибка', 'Не удалось загрузить чаты');
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData);
    } catch {
      console.log('Не удалось загрузить уведомления');
    }
  };

  const filterChats = () => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }

    const filtered = chats.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChats(filtered);
  };

  const handleChatPress = (chat: Chat) => {
    if (isSelectionMode) {
      toggleChatSelection(chat.id);
    } else {
      navigation.navigate('Chat', { chatId: chat.id, chatName: chat.name });
    }
  };

  const toggleChatSelection = (chatId: string) => {
    const newSelected = new Set(selectedChats);
    if (newSelected.has(chatId)) {
      newSelected.delete(chatId);
    } else {
      newSelected.add(chatId);
    }
    setSelectedChats(newSelected);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadChats(), loadNotifications()]);
    setRefreshing(false);
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Удаление чатов',
      `Удалить ${selectedChats.size} чат(ов)?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                Array.from(selectedChats).map(chatId => ChatService.deleteChat(chatId))
              );
              setChats(prev => prev.filter(chat => !selectedChats.has(chat.id)));
              setSelectedChats(new Set());
              setIsSelectionMode(false);
            } catch {
              Alert.alert('Ошибка', 'Не удалось удалить чаты');
            }
          },
        },
      ]
    );
  };

  const handleMarkAsRead = async () => {
    try {
      await Promise.all(
        Array.from(selectedChats).map(chatId => ChatService.markAsRead(chatId))
      );
      setChats(prev => prev.map(chat => 
        selectedChats.has(chat.id) ? { ...chat, unreadCount: 0 } : chat
      ));
      setSelectedChats(new Set());
      setIsSelectionMode(false);
    } catch {
      Alert.alert('Ошибка', 'Не удалось отметить как прочитанные');
    }
  };

  const formatLastMessageTime = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}м`;
    } else if (hours < 24) {
      return `${hours}ч`;
    } else if (days < 7) {
      return `${days}д`;
    } else {
      return timestamp.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }
  };

  const renderChatItem = ({ item: chat }: { item: Chat }) => (
    <TouchableOpacity
      style={[
        ChatListScreenStyles.chatItem,
        { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
        selectedChats.has(chat.id) && ChatListScreenStyles.selectedChatItem,
        chat.unreadCount > 0 && ChatListScreenStyles.unreadChatItem,
      ]}
      onPress={() => handleChatPress(chat)}
      onLongPress={() => {
        if (!isSelectionMode) {
          setIsSelectionMode(true);
          setSelectedChats(new Set([chat.id]));
        }
      }}
    >
      <View style={ChatListScreenStyles.avatarContainer}>
        <AppAvatar
          size="medium"
          name={chat.name}
          source={undefined}
        />
        {chat.unreadCount > 0 && (
          <View style={ChatListScreenStyles.onlineIndicator} />
        )}
      </View>

      <View style={ChatListScreenStyles.chatContent}>
        <View style={ChatListScreenStyles.chatHeader}>
          <Text style={[ChatListScreenStyles.chatName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            {chat.name}
          </Text>
          <Text style={[ChatListScreenStyles.chatTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {formatLastMessageTime(chat.lastMessageTime)}
          </Text>
        </View>

        <View style={ChatListScreenStyles.chatFooter}>
          <Text 
            style={[
              ChatListScreenStyles.lastMessage,
              { color: isDark ? '#9CA3AF' : '#6B7280' },
              chat.unreadCount > 0 && ChatListScreenStyles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {chat.lastMessage || 'Нет сообщений'}
          </Text>

          {chat.unreadCount > 0 && (
            <View style={ChatListScreenStyles.unreadBadge}>
              <Text style={ChatListScreenStyles.unreadCount}>
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      {isSelectionMode && (
        <View style={ChatListScreenStyles.selectionIndicator}>
          <Ionicons
            name={selectedChats.has(chat.id) ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={selectedChats.has(chat.id) ? '#3B82F6' : '#9CA3AF'}
          />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={ChatListScreenStyles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={isDark ? '#9CA3AF' : '#6B7280'} />
      <Text style={[ChatListScreenStyles.emptyText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        Нет чатов
      </Text>
      <Text style={[ChatListScreenStyles.emptySubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        Начните общение с водителем
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[ChatListScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[ChatListScreenStyles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <View style={ChatListScreenStyles.headerLeft}>
          <TouchableOpacity
            style={ChatListScreenStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
          </TouchableOpacity>
          
          <Text style={[ChatListScreenStyles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Чаты
          </Text>
        </View>

        <View style={ChatListScreenStyles.headerRight}>
          {isSelectionMode ? (
            <>
              <TouchableOpacity
                style={ChatListScreenStyles.headerButton}
                onPress={handleMarkAsRead}
                disabled={selectedChats.size === 0}
              >
                <Ionicons name="checkmark" size={20} color={isDark ? '#F9FAFB' : '#1F2937'} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={ChatListScreenStyles.headerButton}
                onPress={handleDeleteSelected}
                disabled={selectedChats.size === 0}
              >
                <Ionicons name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={ChatListScreenStyles.headerButton}
                onPress={() => {
                  setIsSelectionMode(false);
                  setSelectedChats(new Set());
                }}
              >
                <Ionicons name="close" size={20} color={isDark ? '#F9FAFB' : '#1F2937'} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={ChatListScreenStyles.headerButton}
                onPress={() => setIsSelectionMode(true)}
              >
                <Ionicons name="checkmark-circle-outline" size={20} color={isDark ? '#F9FAFB' : '#1F2937'} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={ChatListScreenStyles.headerButton}
                onPress={() => navigation.navigate('NewChat')}
              >
                <Ionicons name="add" size={20} color={isDark ? '#F9FAFB' : '#1F2937'} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={[ChatListScreenStyles.searchContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <View style={ChatListScreenStyles.searchInputContainer}>
          <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            style={[ChatListScreenStyles.searchInput, { color: isDark ? '#F9FAFB' : '#1F2937' }]}
            placeholder="Поиск чатов..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={ChatListScreenStyles.chatList}
        contentContainerStyle={ChatListScreenStyles.chatListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#F9FAFB' : '#1F2937'}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Selection Mode Info */}
      {isSelectionMode && (
        <View style={[ChatListScreenStyles.selectionInfo, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[ChatListScreenStyles.selectionText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Выбрано: {selectedChats.size}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChatListScreen; 