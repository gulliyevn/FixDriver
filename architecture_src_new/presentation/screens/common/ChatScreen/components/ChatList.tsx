import React, { useMemo } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useLanguage } from '../../../../../core/context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Components
import ChatItem from './ChatItem';
import SearchBar from './SearchBar';
import ActionButtons from './ActionButtons';
import EmptyState from './EmptyState';

// Hooks
import { useChatList } from '../hooks/useChatList';
import { useChatSelection } from '../hooks/useChatSelection';
import { useChatActions } from '../hooks/useChatActions';

// Styles
import { createChatListScreenStyles } from '../styles/ChatListScreen.styles';

// Types
type ClientStackParamList = any;

interface ChatListProps {
  onChatPress?: (chat: any) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatPress }) => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createChatListScreenStyles(isDark), [isDark]);
  const { t } = useLanguage();
  const navigation = useNavigation<StackNavigationProp<ClientStackParamList>>();

  // Hooks
  const { filteredChats, loading, filters, updateFilters, refresh } = useChatList();
  const { 
    selectionState, 
    toggleSelectionMode, 
    toggleSelect, 
    selectAll, 
    exitSelectionMode,
    isSelected 
  } = useChatSelection();
  const { 
    toggleFavorite, 
    deleteChat, 
    deleteSelectedChats, 
    markAsRead 
  } = useChatActions();

  // Handlers
  const handleChatPress = (chat: any) => {
    if (selectionState.isSelectionMode) {
      toggleSelect(chat.id);
    } else {
      if (onChatPress) {
        onChatPress(chat);
      } else {
        navigation.navigate('ChatConversation', {
          driverId: chat.participant?.id || chat.id,
          driverName: chat.participant?.name || t('client.chat.unknownUser'),
          driverCar: chat.participant?.car || 'Toyota Camry',
          driverNumber: chat.participant?.phone || 'A123БВ777',
          driverRating: chat.participant?.rating || '4.8',
          driverStatus: chat.participant?.online ? 'online' : 'offline',
          driverPhoto: chat.participant?.avatar,
        });
      }
    }
  };

  const handleChatLongPress = (chat: any) => {
    if (!selectionState.isSelectionMode) {
      toggleSelectionMode();
      toggleSelect(chat.id);
    }
  };

  const handleToggleFavorite = (chatId: string) => {
    toggleFavorite(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      t('client.chat.deleteChat'),
      t('client.chat.deleteChatConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('components.modal.delete'),
          style: 'destructive',
          onPress: () => deleteChat(chatId)
        }
      ]
    );
  };

  const handleSelectAll = () => {
    const allChatIds = filteredChats.map(chat => chat.id);
    selectAll(allChatIds);
  };

  const handleDeleteSelected = () => {
    if (selectionState.totalSelected === 0) return;

    Alert.alert(
      t('client.chat.deleteSelected'),
      t('client.chat.deleteSelectedConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('components.modal.delete'),
          style: 'destructive',
          onPress: () => {
            deleteSelectedChats(Array.from(selectionState.selectedIds));
            exitSelectionMode();
          }
        }
      ]
    );
  };

  const handleMarkAsRead = () => {
    if (selectionState.totalSelected === 0) return;

    Alert.alert(
      t('client.chat.markAsRead'),
      t('client.chat.markAsReadConfirm', { count: selectionState.totalSelected }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('client.chat.read'),
          onPress: () => {
            markAsRead(Array.from(selectionState.selectedIds));
            exitSelectionMode();
          }
        }
      ]
    );
  };

  const handleSearchChange = (text: string) => {
    updateFilters({ searchQuery: text });
  };

  const handleSearchClear = () => {
    updateFilters({ searchQuery: '' });
  };

  // Render chat item
  const renderChatItem = ({ item }: { item: any }) => (
    <ChatItem
      chat={item}
      isSelected={isSelected(item.id)}
      onPress={() => handleChatPress(item)}
      onLongPress={() => handleChatLongPress(item)}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
      onDelete={() => handleDeleteChat(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('client.chat.title')}</Text>
        <ActionButtons
          selectionMode={selectionState.isSelectionMode}
          selectedCount={selectionState.totalSelected}
          totalCount={filteredChats.length}
          onToggleSelection={toggleSelectionMode}
          onSelectAll={handleSelectAll}
          onDeleteSelected={handleDeleteSelected}
          onMarkAsRead={handleMarkAsRead}
        />
      </View>

      <SearchBar
        value={filters.searchQuery}
        onChangeText={handleSearchChange}
        placeholder={t('common.search')}
        onClear={handleSearchClear}
      />

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={
          <EmptyState
            loading={loading}
            hasSearchQuery={filters.searchQuery.length > 0}
            onStartNewChat={() => {}}
          />
        }
        refreshing={loading}
        onRefresh={refresh}
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews
      />
    </View>
  );
};

export default ChatList;
