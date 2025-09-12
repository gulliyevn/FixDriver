import { useState } from 'react';
import { Alert } from 'react-native';
import { useI18n } from '../../../../../shared/hooks/useI18n';

/**
 * Notification Selection Hook
 * 
 * Manages selection mode and bulk operations
 */

interface UseNotificationSelectionParams {
  notifications: any[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export const useNotificationSelection = ({
  notifications,
  markAsRead,
  deleteNotification
}: UseNotificationSelectionParams) => {
  const { t } = useI18n();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

  const handleNotificationPress = (notification: any) => {
    if (isSelectionMode) {
      // Selection mode - toggle selection
      const newSelected = new Set(selectedNotifications);
      if (newSelected.has(notification.id)) {
        newSelected.delete(notification.id);
      } else {
        newSelected.add(notification.id);
      }
      setSelectedNotifications(newSelected);
    } else {
      // Normal mode - mark as read
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
      // Here you can add navigation based on notification type
    }
  };

  const handleLongPress = (notification: any) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedNotifications(new Set([notification.id]));
    }
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedNotifications(new Set());
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === notifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(notifications.map(n => n.id)));
    }
  };

  const handleMarkSelectedAsRead = () => {
    selectedNotifications.forEach(id => {
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.isRead) {
        markAsRead(id);
      }
    });
    setIsSelectionMode(false);
    setSelectedNotifications(new Set());
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      t('notifications.alerts.deleteTitle'),
      t('notifications.alerts.deleteMessage'),
      [
        { text: t('notifications.buttons.cancel'), style: 'cancel' },
        {
          text: t('notifications.delete'),
          style: 'destructive',
          onPress: () => {
            selectedNotifications.forEach(id => deleteNotification(id));
            setIsSelectionMode(false);
            setSelectedNotifications(new Set());
          },
        },
      ]
    );
  };

  return {
    isSelectionMode,
    selectedNotifications,
    handleNotificationPress,
    handleLongPress,
    handleCancelSelection,
    handleSelectAll,
    handleMarkSelectedAsRead,
    handleDeleteSelected
  };
};
