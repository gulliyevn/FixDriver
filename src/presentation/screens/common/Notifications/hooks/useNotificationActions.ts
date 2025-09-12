import { Alert } from 'react-native';
import { useI18n } from '../../../../../shared/hooks/useI18n';

/**
 * Notification Actions Hook
 * 
 * Manages notification-related actions and confirmations
 */

interface UseNotificationActionsParams {
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationActions = ({
  deleteNotification,
  markAllAsRead
}: UseNotificationActionsParams) => {
  const { t } = useI18n();

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      t('notifications.alerts.deleteTitle'),
      t('notifications.alerts.deleteMessage'),
      [
        { text: t('notifications.buttons.cancel'), style: 'cancel' },
        {
          text: t('notifications.delete'),
          style: 'destructive',
          onPress: () => deleteNotification(notificationId),
        },
      ]
    );
  };

  const handleDeleteNotifications = (notificationIds: string[]) => {
    Alert.alert(
      t('notifications.alerts.deleteTitle'),
      t('notifications.alerts.deleteMultipleMessage', { count: notificationIds.length }),
      [
        { text: t('notifications.buttons.cancel'), style: 'cancel' },
        {
          text: t('notifications.delete'),
          style: 'destructive',
          onPress: () => {
            notificationIds.forEach(id => deleteNotification(id));
          },
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  return {
    handleDeleteNotification,
    handleDeleteNotifications,
    handleMarkAllAsRead
  };
};
