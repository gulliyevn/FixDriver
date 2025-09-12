import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { Swipeable as RNSwipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ChatListScreen.styles';

/**
 * Chat Item Component
 * 
 * Individual chat item with swipe actions
 * Supports selection mode and favorite functionality
 */

const ACTION_WIDTH = 100;

interface ChatItemProps {
  item: any;
  isDark: boolean;
  selectionMode: boolean;
  selectedIds: Set<string>;
  onPress: () => void;
  onLongPress: () => void;
  onToggleSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  item,
  isDark,
  selectionMode,
  selectedIds,
  onPress,
  onLongPress,
  onToggleSelect,
  onToggleFavorite,
  onDelete,
}) => {
  const { t } = useI18n();
  const swipeRef = useRef<RNSwipeable | null>(null);

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
              onToggleFavorite(item.id);
              swipeRef.current?.close();
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
              onDelete(item.id);
              swipeRef.current?.close();
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
      ref={(ref) => { swipeRef.current = ref as RNSwipeable | null; }}
      renderLeftActions={selectionMode ? undefined : renderLeftActions}
      renderRightActions={selectionMode ? undefined : renderRightActions}
      leftThreshold={60}
      rightThreshold={60}
      friction={2}
      overshootLeft={false}
      overshootRight={false}
    >
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        {selectionMode && (
          <TouchableOpacity
            style={[
              styles.selectionCheckbox, 
              selectedIds.has(item.id) && styles.selectionCheckboxActive
            ]}
            onPress={() => onToggleSelect(item.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selectedIds.has(item.id) }}
          >
            {selectedIds.has(item.id) && <Ionicons name="checkmark" size={14} color="#fff" />}
          </TouchableOpacity>
        )}

        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: isDark ? '#333' : '#e0e0e0' }]}>
            <Ionicons name="person" size={22} color={isDark ? '#fff' : '#666'} />
          </View>
          <View style={item.online ? styles.onlineIndicator : styles.offlineIndicator} />
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatInfo}>
            <View style={styles.chatNameRow}>
              <Text style={[styles.chatName, { color: isDark ? '#fff' : '#000' }]} numberOfLines={1}>
                {item.participant?.name || t('chat.unknownUser')}
              </Text>
              {item.isFavorite && (
                <Ionicons
                  name="bookmark-outline"
                  size={16}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                  style={styles.favoriteInlineIcon}
                />
              )}
            </View>
            <Text style={[styles.carInfo, { color: isDark ? '#ccc' : '#666' }]}>
              A123БВ777
            </Text>
            <Text numberOfLines={1} style={[styles.lastMessage, { color: isDark ? '#ccc' : '#666' }]}>
              {item.lastMessage?.content || t('chat.noMessages')}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={[styles.chatTime, { color: isDark ? '#999' : '#888' }]}>
            {item.formattedTime}
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
