import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { mockNotifications } from '../../mocks';
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
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Анимация появления
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleNotificationPress = (notification: Notification) => {
    if (isSelectionMode) {
      // В режиме выбора - переключаем выбор
      const newSelected = new Set(selectedNotifications);
      if (newSelected.has(notification.id)) {
        newSelected.delete(notification.id);
      } else {
        newSelected.add(notification.id);
      }
      setSelectedNotifications(newSelected);
    } else {
      // Обычный режим - отмечаем как прочитанное
      if (!notification.isRead) {
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
      }
      // Здесь можно добавить навигацию в зависимости от типа уведомления
  
    }
  };

  const handleLongPress = (notification: Notification) => {
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
    setNotifications(prev => prev.map(n => 
      selectedNotifications.has(n.id) ? { ...n, isRead: true } : n
    ));
    setIsSelectionMode(false);
    setSelectedNotifications(new Set());
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      'Удалить уведомления',
      `Удалить ${selectedNotifications.size} выбранных уведомлений?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
            setIsSelectionMode(false);
            setSelectedNotifications(new Set());
          },
        },
      ]
    );
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
          onPress: () => {
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
          },
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

  const renderNotificationItem = (notification: Notification) => {
    const isSelected = selectedNotifications.has(notification.id);
    
    return (
      <Animated.View key={notification.id} style={{ opacity: fadeAnim }}>
        <TouchableOpacity
          style={[
            NotificationsScreenStyles.notificationItem,
            isDark && NotificationsScreenStyles.notificationItemDark,
            !notification.isRead && NotificationsScreenStyles.unreadNotification,
            isSelected && NotificationsScreenStyles.selectedNotification,
          ]}
          onPress={() => handleNotificationPress(notification)}
          onLongPress={() => handleLongPress(notification)}
          activeOpacity={0.7}
        >
          {/* Checkbox для режима выбора */}
          {isSelectionMode && (
            <TouchableOpacity
              style={[
                NotificationsScreenStyles.checkbox,
                isSelected && NotificationsScreenStyles.checkboxSelected
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              {isSelected && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          )}

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
            
            {!isSelectionMode && (
              <TouchableOpacity
                style={NotificationsScreenStyles.deleteButton}
                onPress={() => handleDeleteNotification(notification.id)}
              >
                <Ionicons name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[NotificationsScreenStyles.container, isDark && NotificationsScreenStyles.containerDark]}>
      {/* Header */}
      <View style={[NotificationsScreenStyles.header, isDark && NotificationsScreenStyles.headerDark]}>
        {isSelectionMode ? (
          // Режим выбора
          <View style={NotificationsScreenStyles.selectionHeader} testID="selection-header">
            <TouchableOpacity onPress={handleCancelSelection}>
              <Text style={NotificationsScreenStyles.cancelButton}>Отмена</Text>
            </TouchableOpacity>
            <Text style={NotificationsScreenStyles.selectionTitle}>
              Выбрано: {selectedNotifications.size}
            </Text>
            <TouchableOpacity onPress={handleSelectAll}>
              <Text style={NotificationsScreenStyles.selectAllButton}>
                {selectedNotifications.size === notifications.length ? 'Снять выбор' : 'Выбрать все'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Обычный режим
          <View style={NotificationsScreenStyles.headerContent}>
            <View style={NotificationsScreenStyles.headerLeft}>
              <Ionicons name="notifications" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
              <Text style={[NotificationsScreenStyles.headerTitle, isDark && NotificationsScreenStyles.headerTitleDark]}>
                Уведомления
              </Text>
            </View>
            <View style={NotificationsScreenStyles.headerRight}>
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
              <TouchableOpacity 
                style={NotificationsScreenStyles.selectButton}
                onPress={() => setIsSelectionMode(true)}
                testID="select-button"
              >
                <Ionicons name="checkmark-circle-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Actions для выбранных элементов */}
      {isSelectionMode && selectedNotifications.size > 0 && (
        <View style={NotificationsScreenStyles.selectionActions}>
          <TouchableOpacity 
            style={NotificationsScreenStyles.actionButton}
            onPress={handleMarkSelectedAsRead}
          >
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={NotificationsScreenStyles.actionButtonText}>Прочитано</Text>
          </TouchableOpacity>
          
                      <TouchableOpacity 
              style={[NotificationsScreenStyles.actionButton, NotificationsScreenStyles.deleteActionButton]}
              onPress={handleDeleteSelected}
            >
              <Ionicons name="trash" size={20} color="#EF4444" />
              <Text style={[NotificationsScreenStyles.actionButtonText, NotificationsScreenStyles.deleteButtonText]}>
                Удалить
              </Text>
            </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={NotificationsScreenStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        testID="notifications-scroll"
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
          notifications.map(renderNotificationItem)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
