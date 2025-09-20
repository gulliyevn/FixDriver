import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { Swipeable as RNSwipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';
import { ChatItemProps } from '../types/Chat';
import { createChatListScreenStyles } from '../styles/ChatListScreen.styles';
import { useTheme } from '../../../../../core/context/ThemeContext';
import ChatService from '../../../../../data/services/ChatService';

const ACTION_WIDTH = 100;

const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isSelected,
  onPress,
  onLongPress,
  onToggleFavorite,
  onDelete
}) => {
  const { isDark } = useTheme();
  const styles = createChatListScreenStyles(isDark);

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
              onToggleFavorite();
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
              onDelete();
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
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      leftThreshold={60}
      rightThreshold={60}
      friction={2}
      overshootLeft={false}
      overshootRight={false}
    >
      <TouchableOpacity
        style={styles.chatItem}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.8}
      >
        {isSelected && (
          <TouchableOpacity
            style={[styles.selectionCheckbox, styles.selectionCheckboxActive]}
            onPress={onPress}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
          >
            <Ionicons name="checkmark" size={14} color="#fff" />
          </TouchableOpacity>
        )}

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color="#fff" />
          </View>
          <View style={chat.participant.online ? styles.onlineIndicator : styles.offlineIndicator} />
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatInfo}>
            <View style={styles.chatNameRow}>
              <Text style={styles.chatName} numberOfLines={1}>
                {chat.participant?.name || 'Unknown User'}
              </Text>
              {chat.isFavorite && (
                <Ionicons
                  name="bookmark-outline"
                  size={16}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                  style={styles.favoriteInlineIcon}
                />
              )}
            </View>
            <Text style={styles.carInfo}>
              {chat.participant?.car || 'A123БВ777'}
            </Text>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {chat.lastMessage?.content || 'No messages'}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.chatTime}>
            {ChatService.formatMessageTime(chat.updatedAt)}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ChatItem;
