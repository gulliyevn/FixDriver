import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationsModalStyles, NotificationsModalDarkStyles } from '../../styles/screens/drivers/NotificationsModal.styles';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../hooks/useI18n';
import { useLanguage } from '../../context/LanguageContext';
import { formatDateWithLanguage } from '../../utils/formatters';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  notifications = [],
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { language } = useLanguage();
  const styles = isDark ? { ...NotificationsModalStyles, ...NotificationsModalDarkStyles } : NotificationsModalStyles;

  const handleMarkAsRead = () => {
    Alert.alert(t('notifications.title'), t('notifications.markAsRead'));
  };

  const handleDelete = (notificationId: string) => {
    Alert.alert(
      t('notifications.alerts.deleteTitle'),
      t('notifications.alerts.deleteMessage'),
      [
        { text: t('notifications.buttons.cancel'), style: 'cancel' },
        { text: t('notifications.delete'), style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'close-circle';
      default:
        return 'information-circle';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return t('notifications.now');
    if (minutes < 60) return `${minutes}${t('notifications.min')}`;
    if (hours < 24) return `${hours}${t('notifications.hour')}`;
    if (days < 7) return `${days}${t('notifications.day')}`;
    return formatDateWithLanguage(date, language, 'short');
  };

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: t('notifications.messages.newDriver'),
      message: t('notifications.messages.driverJoined'),
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'info',
    },
    {
      id: '2',
      title: t('notifications.messages.tripCompleted'),
      message: t('notifications.messages.tripCompletedDesc'),
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
      type: 'success',
    },
    {
      id: '3',
      title: t('notifications.messages.routeChanged'),
      message: t('notifications.messages.routeChangedDesc'),
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: false,
      type: 'warning',
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('notifications.title')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.notificationsList}>
            {displayNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off" size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
                <Text style={styles.emptyStateText}>
                  {t('notifications.noNotifications')}
                </Text>
              </View>
            ) : (
              displayNotifications.map((notification) => (
                <View
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.isRead && styles.unreadNotification
                  ]}
                >
                  <View style={styles.notificationIcon}>
                    <Ionicons
                      name={getNotificationIcon(notification.type) as keyof typeof Ionicons.glyphMap}
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.notificationTextContainer}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle} numberOfLines={1}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {formatTime(notification.timestamp)}
                      </Text>
                    </View>
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                  </View>

                  <View style={styles.notificationActions}>
                    {!notification.isRead && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.markReadButton]}
                        onPress={handleMarkAsRead}
                      >
                        <Text style={styles.actionButtonText}>{t('notifications.markAsRead')}</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(notification.id)}
                    >
                      <Text style={styles.actionButtonText}>{t('notifications.delete')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default NotificationsModal; 