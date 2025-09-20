import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../core/context/ThemeContext';
import { useAuth } from '../../../core/context/AuthContext';
import { useI18n } from '../../../shared/i18n';
import { createNotificationsModalStyles } from './styles/NotificationsModal.styles';
import NotificationService from '../../../data/datasources/grpc/NotificationService';
import { Notification } from '../../../shared/types';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
}) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { t } = useI18n();
  const styles = createNotificationsModalStyles(isDark);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const notificationService = NotificationService.getInstance();

  // Загрузка уведомлений при открытии модала
  useEffect(() => {
    if (visible && user?.id) {
      loadNotifications();
    }
  }, [visible, user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [notificationsData, unreadCountData] = await Promise.all([
        notificationService.getNotificationsSorted(user.id),
        notificationService.getUnreadCount(user.id)
      ]);
      
      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      await loadNotifications(); // Перезагружаем данные
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      await loadNotifications(); // Перезагружаем данные
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      await loadNotifications(); // Перезагружаем данные
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={styles.closeButtonIcon.color} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {t('notifications.title') || 'Уведомления'}
          </Text>
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <Ionicons 
              name="checkmark-circle-outline" 
              size={24} 
              color={unreadCount > 0 ? styles.markAllButtonIcon.color : styles.markAllButtonIcon.color + '50'} 
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={styles.loadingIndicator.color} />
            <Text style={styles.loadingText}>
              {t('notifications.loading') || 'Загрузка уведомлений...'}
            </Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="notifications-outline" 
              size={64} 
              color={styles.emptyStateIcon.color}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateTitle}>
              {t('notifications.empty.title') || 'Нет новых уведомлений'}
            </Text>
            <Text style={styles.emptyStateMessage}>
              {t('notifications.empty.message') || 'Здесь будут отображаться ваши уведомления'}
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.notificationsList}>
            {notifications.map((notification) => (
              <View 
                key={notification.id} 
                style={[
                  styles.notificationItem,
                  !notification.isRead && styles.unreadNotification
                ]}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons 
                    name={getNotificationIcon(notification.type) as any} 
                    size={20} 
                    color="#FFFFFF" 
                  />
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatTime(notification.createdAt)}
                    </Text>
                  </View>
                  
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  
                  <View style={styles.notificationActions}>
                    {!notification.isRead && (
                      <TouchableOpacity 
                        style={styles.markReadButton}
                        onPress={() => handleMarkAsRead(notification.id)}
                      >
                        <Text style={styles.actionButtonText}>
                          {t('notifications.markRead') || 'Отметить как прочитанное'}
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteNotification(notification.id)}
                    >
                      <Text style={styles.actionButtonText}>
                        {t('notifications.delete') || 'Удалить'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

// Вспомогательные функции
const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'trip':
      return 'car-outline';
    case 'payment':
      return 'card-outline';
    case 'driver':
      return 'person-outline';
    case 'system':
      return 'settings-outline';
    case 'order':
      return 'list-outline';
    default:
      return 'notifications-outline';
  }
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return 'Только что';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} мин назад`;
  } else if (diffHours < 24) {
    return `${diffHours} ч назад`;
  } else if (diffDays === 1) {
    return 'Вчера';
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

export default NotificationsModal;
