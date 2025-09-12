import React from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useI18n } from '../../../../shared/hooks/useI18n';
import { useAuth } from '../../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../../../shared/types/navigation';
import { useChatList } from './hooks/useChatList';
import { useChatActions } from './hooks/useChatActions';
import { SearchBar } from './components/SearchBar';
import { ChatItem } from './components/ChatItem';
import { EmptyState } from './components/EmptyState';
import { SelectionBar } from './components/SelectionBar';
import { styles } from './styles/ChatListScreen.styles';

/**
 * Chat List Screen Component
 * 
 * Displays list of chats with search, filtering, and selection capabilities
 * Supports swipe actions for favorites and deletion
 * Integrates with gRPC services for real-time chat management
 */

const ChatListScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<ClientStackParamList>>();

  const {
    chats,
    filteredChats,
    loading,
    searchQuery,
    setSearchQuery,
    refreshChats,
  } = useChatList();

  const {
    selectionMode,
    selectedIds,
    setSelectionMode,
    setSelectedIds,
    toggleSelect,
    selectAll,
    markAsRead,
    deleteSelected,
    toggleFavorite,
    deleteChat,
    openChat,
  } = useChatActions(navigation);

  const renderChatItem = ({ item }: { item: any }) => (
    <ChatItem
      item={item}
      isDark={isDark}
      selectionMode={selectionMode}
      selectedIds={selectedIds}
      onPress={() => openChat(item)}
      onLongPress={() => !selectionMode && setSelectionMode(true)}
      onToggleSelect={toggleSelect}
      onToggleFavorite={toggleFavorite}
      onDelete={deleteChat}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      loading={loading}
      isDark={isDark}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          {t('chat.title')}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            accessibilityLabel={t('common.select')}
            onPress={() => setSelectionMode(!selectionMode)}
          >
            <Text style={[styles.headerActionText, { color: isDark ? '#fff' : '#000' }]}>
              {selectionMode ? t('common.cancel') : t('common.select')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        isDark={isDark}
      />

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={refreshChats}
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews
      />

      {selectionMode && (
        <SelectionBar
          selectedCount={selectedIds.size}
          totalCount={filteredChats.length}
          onSelectAll={selectAll}
          onMarkAsRead={markAsRead}
          onDelete={deleteSelected}
          isDark={isDark}
        />
      )}
    </SafeAreaView>
  );
};

export default ChatListScreen;
