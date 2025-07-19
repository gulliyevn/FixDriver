import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { ChatService } from '../../services/ChatService';
import { Chat } from '../../types/chat';
import { ChatListScreenStyles, getChatListColors } from '../../styles/screens/ChatListScreen.styles';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../constants/colors';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'ChatList'>;

const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  const colorStyles = getChatListColors(isDark);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState<Set<string>>(new Set());
  const [fadeAnim] = useState(new Animated.Value(0));

  const loadChats = async () => {
    try {
      setLoading(true);
      const chatList: Chat[] = await ChatService.getChats();
      setChats(chatList);
    } catch (error) {
      
      Alert.alert('Ошибка', 'Не удалось загрузить чаты');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
    // Анимация появления
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const filteredChats = chats.filter(chat =>
    chat.participant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat: Chat) => {
    if (isSelectionMode) {
      // В режиме выбора - переключаем выбор
      const newSelected = new Set(selectedChats);
      if (newSelected.has(chat.id)) {
        newSelected.delete(chat.id);
      } else {
        newSelected.add(chat.id);
      }
      setSelectedChats(newSelected);
    } else {
      // Обычный режим - переходим в чат
      if (chat.participant) {
        navigation.navigate('Chat', { 
          chatId: chat.id, 
          participant: chat.participant 
        });
      }
    }
  };

  const handleLongPress = (chat: Chat) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedChats(new Set([chat.id]));
    }
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedChats(new Set());
  };

  const handleSelectAll = () => {
    if (selectedChats.size === filteredChats.length) {
      setSelectedChats(new Set());
    } else {
      setSelectedChats(new Set(filteredChats.map(chat => chat.id)));
    }
  };

  const handleMarkAsRead = () => {
    // Логика отметки как прочитанное
    Alert.alert('Успешно', 'Выбранные чаты отмечены как прочитанные');
    setIsSelectionMode(false);
    setSelectedChats(new Set());
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Удалить чаты',
      `Удалить ${selectedChats.size} выбранных чатов?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            setChats(prev => prev.filter(chat => !selectedChats.has(chat.id)));
            setIsSelectionMode(false);
            setSelectedChats(new Set());
          },
        },
      ]
    );
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const isSelected = selectedChats.has(item.id);
    
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={[
            ChatListScreenStyles.chatItem,
            isSelected && ChatListScreenStyles.selectedChatItem
          ]}
          onPress={() => handleChatPress(item)}
          onLongPress={() => handleLongPress(item)}
          activeOpacity={0.7}
        >
          {/* Checkbox для режима выбора */}
          {isSelectionMode && (
            <TouchableOpacity
              style={[
                ChatListScreenStyles.checkbox,
                isSelected && ChatListScreenStyles.checkboxSelected
              ]}
              onPress={() => handleChatPress(item)}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          )}

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
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={ChatListScreenStyles.emptyState}>
      <Text style={ChatListScreenStyles.emptyStateTitle}>Нет чатов</Text>
      <Text style={ChatListScreenStyles.emptyStateSubtitle}>
        Начните разговор с водителем, чтобы увидеть чаты здесь
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[ChatListScreenStyles.container, colorStyles.container]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={ChatListScreenStyles.loadingContainer}>
          <Text style={[ChatListScreenStyles.loadingText, colorStyles.loadingText]}>Загрузка чатов...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[ChatListScreenStyles.container, colorStyles.container]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[ChatListScreenStyles.header, colorStyles.header]}>
        {isSelectionMode ? (
          // Режим выбора
          <View style={ChatListScreenStyles.selectionHeader} testID="selection-header">
            <TouchableOpacity onPress={handleCancelSelection}>
              <Text style={[ChatListScreenStyles.cancelButton, colorStyles.cancelButton]}>Отмена</Text>
            </TouchableOpacity>
            <Text style={[ChatListScreenStyles.selectionTitle, colorStyles.selectionTitle]}>
              Выбрано: {selectedChats.size}
            </Text>
            <TouchableOpacity onPress={handleSelectAll}>
              <Text style={[ChatListScreenStyles.selectAllButton, colorStyles.selectAllButton]}>
                {selectedChats.size === filteredChats.length ? 'Снять выбор' : 'Выбрать все'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Обычный режим
          <View style={ChatListScreenStyles.headerContent}>
            <Text style={[ChatListScreenStyles.title, colorStyles.title]}>Чаты</Text>
            <TouchableOpacity 
              style={ChatListScreenStyles.selectButton}
              onPress={() => setIsSelectionMode(true)}
              testID="select-button"
            >
              <Ionicons name="checkmark-circle-outline" size={24} color={currentColors.primary} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={[ChatListScreenStyles.searchContainer, colorStyles.searchContainer]}>
          <Ionicons name="search" size={20} color={currentColors.textSecondary} />
          <TextInput
            style={[ChatListScreenStyles.searchInput, colorStyles.searchInput]}
            placeholder="Поиск чатов..."
            placeholderTextColor={currentColors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Actions для выбранных элементов */}
      {isSelectionMode && selectedChats.size > 0 && (
        <View style={[ChatListScreenStyles.selectionActions, colorStyles.selectionActions]}>
          <TouchableOpacity 
            style={[ChatListScreenStyles.actionButton, colorStyles.actionButton]}
            onPress={handleMarkAsRead}
          >
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={[ChatListScreenStyles.actionButtonText, colorStyles.actionButtonText]}>Прочитано</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[ChatListScreenStyles.actionButton, ChatListScreenStyles.deleteButton]}
            onPress={handleDeleteSelected}
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
            <Text style={[ChatListScreenStyles.actionButtonText, ChatListScreenStyles.deleteButtonText]}>
              Удалить
            </Text>
          </TouchableOpacity>
        </View>
      )}

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