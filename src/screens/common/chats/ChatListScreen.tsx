import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, Alert, TextInput, Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { Swipeable as RNSwipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useI18n } from '../../../hooks/useI18n';
import { createChatListScreenStyles } from '../../../styles/screens/chats/ChatListScreen.styles';
import { ChatService } from '../../../services/ChatService';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../../types/navigation';

const ACTION_WIDTH = 100; // Keep in sync with styles.swipeAction.width

const ChatListScreen: React.FC = () => {
  const { isDark } = useTheme();
  const styles = useMemo(() => createChatListScreenStyles(isDark), [isDark]);
  const { t } = useI18n();
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<ClientStackParamList>>();
  const [chats, setChats] = useState<any[]>([]);
  const [filteredChats, setFilteredChats] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Keep refs to swipeable rows to close them programmatically
  const swipeRefs = useRef<Record<string, RNSwipeable | null>>({});
  const openSwipeRef = useRef<RNSwipeable | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 200);
    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    filterChats();
  }, [chats, debouncedQuery, favorites]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const list = await ChatService.getChats('current_user_id');
      setChats(list);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const filterChats = () => {
    const base = chats.map(c => ({ ...c, isFavorite: favorites.has(c.id) }));
    const list = !debouncedQuery
      ? base
      : base.filter(chat =>
          chat.participant?.name?.toLowerCase().includes(debouncedQuery) ||
          chat.lastMessage?.content?.toLowerCase().includes(debouncedQuery)
        );
    // Sort: favorites first, then by updatedAt desc
    const sorted = list.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    setFilteredChats(sorted);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openChat = (chat: any) => {
    if (selectionMode) {
      toggleSelect(chat.id);
      return;
    }

    navigation.navigate('ChatConversation', {
      driverId: chat.participant?.id || chat.id,
      driverName: chat.participant?.name || t('client.chat.unknownUser'),
      driverCar: chat.participant?.car || 'Toyota Camry',
      driverNumber: chat.participant?.phone || 'A123БВ777',
      driverRating: chat.participant?.rating || '4.8',
      driverStatus: chat.online ? 'online' : 'offline',
      driverPhoto: chat.participant?.avatar,
    });
  };

  const handleChatPress = (chat: any) => {
    if (selectionMode) {
      toggleSelect(chat.id);
    } else {
      openChat(chat);
    }
  };

  const closeOpenSwipe = useCallback(() => {
    if (openSwipeRef.current) {
      try { openSwipeRef.current.close(); } catch (error) {
      }
      openSwipeRef.current = null;
    }
  }, []);

  const renderChatItem = ({ item }: { item: any }) => {
    const renderLeftActions = (progress: any, dragX: any) => {
      const scale = dragX.interpolate({
        inputRange: [0, ACTION_WIDTH],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });
      const opacity = dragX.interpolate({
        inputRange: [0, ACTION_WIDTH * 0.6, ACTION_WIDTH],
        outputRange: [0, 0.6, 1],
        extrapolate: 'clamp',
      });

      return (
        <View style={[styles.swipeActionsLeft]}>
          <Animated.View style={{ transform: [{ scale }], opacity }}>
            <TouchableOpacity
              style={[styles.swipeAction, styles.favoriteAction, styles.swipeActionInnerLeft]}
              onPress={() => {
                toggleFavorite(item.id);
                swipeRefs.current[item.id]?.close();
              }}
              accessibilityRole="button"
              accessibilityLabel="bookmark"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.85}
            >
              <Ionicons name="bookmark" size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

    const renderRightActions = (progress: any, dragX: any) => {
      const scale = dragX.interpolate({
        inputRange: [-ACTION_WIDTH, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      const opacity = dragX.interpolate({
        inputRange: [-ACTION_WIDTH, -ACTION_WIDTH * 0.6, 0],
        outputRange: [1, 0.6, 0],
        extrapolate: 'clamp',
      });

      return (
        <View style={[styles.swipeActionsRight]}>
          <Animated.View style={{ transform: [{ scale }], opacity }}>
            <TouchableOpacity
              style={[styles.swipeAction, styles.deleteAction, styles.swipeActionInnerRight]}
              onPress={() => {
                deleteChat(item.id);
                swipeRefs.current[item.id]?.close();
              }}
              accessibilityRole="button"
              accessibilityLabel="delete"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.85}
            >
              <Ionicons name="trash" size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

    return (
      <Swipeable
        ref={(ref) => { swipeRefs.current[item.id] = ref as RNSwipeable | null; }}
        renderLeftActions={selectionMode ? undefined : renderLeftActions}
        renderRightActions={selectionMode ? undefined : renderRightActions}
        leftThreshold={60}
        rightThreshold={60}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableWillOpen={() => {
          if (openSwipeRef.current && openSwipeRef.current !== swipeRefs.current[item.id]) {
            try { openSwipeRef.current.close(); } catch (error) {
      }
          }
          openSwipeRef.current = swipeRefs.current[item.id] ?? null;
        }}
        onSwipeableClose={() => {
          if (openSwipeRef.current === swipeRefs.current[item.id]) {
            openSwipeRef.current = null;
          }
        }}
      >
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => handleChatPress(item)}
          onLongPress={() => !selectionMode && setSelectionMode(true)}
          activeOpacity={0.8}
        >
          {selectionMode && (
            <TouchableOpacity
              style={[styles.selectionCheckbox, selectedIds.has(item.id) && styles.selectionCheckboxActive]}
              onPress={() => toggleSelect(item.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selectedIds.has(item.id) }}
            >
              {selectedIds.has(item.id) && <Ionicons name="checkmark" size={14} color="#fff" />}
            </TouchableOpacity>
          )}

          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color="#fff" />
            </View>
            <View style={item.online ? styles.onlineIndicator : styles.offlineIndicator} />
          </View>

          <View style={styles.chatContent}>
            <View style={styles.chatInfo}>
              <View style={styles.chatNameRow}>
                <Text style={styles.chatName} numberOfLines={1}>
                  {item.participant?.name || t('client.chat.unknownUser')}
                </Text>
                {favorites.has(item.id) && (
                  <Ionicons
                    name="bookmark-outline"
                    size={16}
                    color={isDark ? '#9CA3AF' : '#6B7280'}
                    style={styles.favoriteInlineIcon}
                  />
                )}
              </View>
              <Text style={styles.carInfo}>
                A123БВ777
              </Text>
              <Text numberOfLines={1} style={styles.lastMessage}>
                {item.lastMessage?.content || t('client.chat.noMessages')}
              </Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.chatTime}>
              {new Date(item.updatedAt).toLocaleTimeString()}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const selectAll = () => {
    if (selectedIds.size === filteredChats.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredChats.map(c => c.id)));
    }
  };

  const markAsRead = () => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      t('client.chat.markAsRead'),
      t('client.chat.markAsReadConfirm', { count: selectedIds.size }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('client.chat.read'),
          onPress: () => {
            setSelectionMode(false);
            setSelectedIds(new Set());
          }
        }
      ]
    );
  };

  const deleteSelected = () => {
    if (selectedIds.size === 0) return;

    Alert.alert(
      t('client.chat.deleteSelected'),
      t('client.chat.deleteSelectedConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('components.modal.delete'),
          style: 'destructive',
          onPress: () => {
            setChats(prev => prev.filter(c => !selectedIds.has(c.id)));
            setSelectionMode(false);
            setSelectedIds(new Set());
          }
        }
      ]
    );
  };

  const toggleFavorite = (chatId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(chatId)) next.delete(chatId); else next.add(chatId);
      return next;
    });
  };

  const deleteChat = (chatId: string) => {
    Alert.alert(
      t('client.chat.deleteChat'),
      t('client.chat.deleteChatConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('components.modal.delete'),
          style: 'destructive',
          onPress: () => {
            setChats(prev => prev.filter(chat => chat.id !== chatId));
          }
        }
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="chatbubbles-outline"
        size={64}
        color={isDark ? '#6B7280' : '#9CA3AF'}
      />
      <Text style={styles.emptyStateTitle}>
        {loading ? t('client.chat.loadingChats') : t('client.chat.noChats')}
      </Text>
      {!loading && (
        <Text style={styles.emptyStateSubtitle}>
          {t('client.chat.startNewChat')}
        </Text>
      )}
    </View>
  );

  const onListScrollBegin = (_e: NativeSyntheticEvent<NativeScrollEvent>) => {
    closeOpenSwipe();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('client.chat.title')}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            accessibilityLabel={t('components.select.select')}
            onPress={() => setSelectionMode(!selectionMode)}
          >
            <Ionicons
              name={selectionMode ? 'close' : 'checkmark-circle-outline'}
              size={22}
              color={isDark ? '#F9FAFB' : '#111827'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('common.search')}
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

      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={loadChats}
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews
        onScrollBeginDrag={onListScrollBegin}
      />

      {selectionMode && (
        <View style={styles.actionButtonsContainer}>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.selectAllButton]}
              onPress={selectAll}
            >
              <Text style={styles.selectAllButtonText}>
                {selectedIds.size === filteredChats.length ? t('components.select.deselectAll') : t('components.select.selectAll')}
              </Text>
            </TouchableOpacity>
            {selectedIds.size > 0 && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={deleteSelected}
              >
                <Text style={styles.deleteButtonText}>
                  {t('components.modal.delete')} ({selectedIds.size})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

    </SafeAreaView>
  );
};

export default ChatListScreen;