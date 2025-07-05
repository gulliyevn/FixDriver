import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import mockData from '../../utils/mockData';
import { NotificationsScreenStyles } from '../../styles/screens/NotificationsScreen.styles';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(mockData.notifications);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // В реальном приложении здесь будет подписка на обновления
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    }
    // Здесь можно добавить навигацию в зависимости от типа уведомления
    console.log('Notification pressed:', notification);
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Удалить уведомление',
      'Вы уверены, что хотите удалить это уведомление?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => setNotifications(prev => prev.filter(n => n.id !== notificationId)),
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return 'car';
      case 'payment':
        return 'card';
      case 'driver':
        return 'person';
      case 'system':
        return 'settings';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'trip':
        return '#10B981';
      case 'payment':
        return '#F59E0B';
      case 'driver':
        return '#3B82F6';
      case 'system':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={[NotificationsScreenStyles.container, isDark && NotificationsScreenStyles.containerDark]}>
      {/* Header */}
      <View style={[NotificationsScreenStyles.header, isDark && NotificationsScreenStyles.headerDark]}>
        <Text style={[NotificationsScreenStyles.headerTitle, isDark && NotificationsScreenStyles.headerTitleDark]}>
          Уведомления
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={NotificationsScreenStyles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={NotificationsScreenStyles.markAllButtonText}>
              Прочитать все ({unreadCount})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView
        style={NotificationsScreenStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={NotificationsScreenStyles.emptyState}>
            <Ionicons 
              name="notifications-off" 
              size={64} 
              color={isDark ? '#6B7280' : '#9CA3AF'} 
            />
            <Text style={[NotificationsScreenStyles.emptyStateText, isDark && NotificationsScreenStyles.emptyStateTextDark]}>
              Нет уведомлений
            </Text>
            <Text style={[NotificationsScreenStyles.emptyStateSubtext, isDark && NotificationsScreenStyles.emptyStateSubtextDark]}>
              Все уведомления будут отображаться здесь
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                NotificationsScreenStyles.notificationItem,
                isDark && NotificationsScreenStyles.notificationItemDark,
                !notification.isRead && NotificationsScreenStyles.unreadNotification,
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={NotificationsScreenStyles.notificationContent}>
                {/* Icon */}
                <View
                  style={[
                    NotificationsScreenStyles.notificationIcon,
                    { backgroundColor: getNotificationColor(notification.type) + '20' },
                  ]}
                >
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type)}
                  />
                </View>

                {/* Content */}
                <View style={NotificationsScreenStyles.notificationTextContainer}>
                  <View style={NotificationsScreenStyles.notificationHeader}>
                    <Text
                      style={[
                        NotificationsScreenStyles.notificationTitle,
                        isDark && NotificationsScreenStyles.notificationTitleDark,
                        !notification.isRead && NotificationsScreenStyles.unreadTitle,
                      ]}
                    >
                      {notification.title}
                    </Text>
                  </View>
                  <Text style={NotificationsScreenStyles.notificationMessage}>{notification.message}</Text>
                  <Text style={NotificationsScreenStyles.notificationTime}>{notification.createdAt}</Text>
                </View>
                <TouchableOpacity
                  style={NotificationsScreenStyles.deleteButton}
                  onPress={() => handleDeleteNotification(notification.id)}
                >
                  <Ionicons name="trash" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
