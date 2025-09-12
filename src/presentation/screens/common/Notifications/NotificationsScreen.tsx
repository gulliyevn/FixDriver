import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, RefreshControl, Animated } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useI18n } from '../../../../shared/hooks/useI18n';
import { useNotifications } from './hooks/useNotifications';
import { useNotificationActions } from './hooks/useNotificationActions';
import { useNotificationSelection } from './hooks/useNotificationSelection';
import { NotificationsHeader } from './components/NotificationsHeader';
import { SelectionBar } from './components/SelectionBar';
import { NotificationItem } from './components/NotificationItem';
import { EmptyState } from './components/EmptyState';
import { styles } from './styles/NotificationsScreen.styles';

/**
 * Notifications Screen
 * 
 * Main screen for managing user notifications
 * Modular structure with separated components and hooks
 */

const NotificationsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const [fadeAnim] = useState(new Animated.Value(0));

  const {
    notifications,
    refreshing,
    unreadCount,
    onRefresh,
    markAsRead,
    deleteNotification,
    markAllAsRead
  } = useNotifications();

  const {
    isSelectionMode,
    selectedNotifications,
    handleNotificationPress,
    handleLongPress,
    handleCancelSelection,
    handleSelectAll,
    handleMarkSelectedAsRead,
    handleDeleteSelected
  } = useNotificationSelection({
    notifications,
    markAsRead,
    deleteNotification
  });

  const {
    handleDeleteNotification,
    handleMarkAllAsRead
  } = useNotificationActions({
    deleteNotification,
    markAllAsRead
  });

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderNotificationItem = (notification: any) => {
    const isSelected = selectedNotifications.has(notification.id);
    
    return (
      <Animated.View key={notification.id} style={{ opacity: fadeAnim }}>
        <NotificationItem
          notification={notification}
          isSelected={isSelected}
          isSelectionMode={isSelectionMode}
          isDark={isDark}
          onPress={() => handleNotificationPress(notification)}
          onLongPress={() => handleLongPress(notification)}
          onDelete={() => handleDeleteNotification(notification.id)}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <NotificationsHeader
        isSelectionMode={isSelectionMode}
        selectedCount={selectedNotifications.size}
        totalCount={notifications.length}
        unreadCount={unreadCount}
        isDark={isDark}
        onCancelSelection={handleCancelSelection}
        onSelectAll={handleSelectAll}
        onMarkAllAsRead={handleMarkAllAsRead}
        onEnterSelectionMode={() => setIsSelectionMode(true)}
      />

      {isSelectionMode && selectedNotifications.size > 0 && (
        <SelectionBar
          selectedCount={selectedNotifications.size}
          isDark={isDark}
          onMarkAsRead={handleMarkSelectedAsRead}
          onDelete={handleDeleteSelected}
        />
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        testID="notifications-scroll"
      >
        {notifications.length === 0 ? (
          <EmptyState isDark={isDark} />
        ) : (
          notifications.map(renderNotificationItem)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
