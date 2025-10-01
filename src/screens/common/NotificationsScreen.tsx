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
import { useI18n } from '../../hooks/useI18n';
import NotificationService, { Notification as ApiNotification } from '../../services/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { NotificationsScreenStyles } from '../../styles/screens/NotificationsScreen.styles';

type Notification = ApiNotification;

const NotificationsScreen: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [fadeAnim] = useState(new Animated.Value(0));
  const storageKey = user?.id ? `@notifications_${user.id}` : '@notifications_anonymous';

  useEffect(() => {
    // Анимация появления
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const loadNotifications = async () => {
    try {
      setRefreshing(true);
      if (__DEV__) {
        const saved = await AsyncStorage.getItem(storageKey);
        setNotifications(saved ? JSON.parse(saved) : []);
      } else {
        if (!user?.id) {
          setNotifications([]);
        } else {
          const list = await NotificationService.getInstance().getNotifications(user.id, 1, 50);
          setNotifications(list);
        }
      }
    } catch (e) {
      setNotifications([]);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadNotifications();
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
        if (__DEV__) {
          AsyncStorage.setItem(storageKey, JSON.stringify(
            notifications.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
          ));
        } else {
          NotificationService.getInstance().markAsRead(notification.id).catch(() => {});
        }
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
      t('notifications.alerts.deleteTitle'),
      t('notifications.alerts.deleteMessage'),
      [
        { text: t('notifications.buttons.cancel'), style: 'cancel' },
        {
          text: t('notifications.delete'),
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
            if (__DEV__) {
              const updated = notifications.filter(n => !selectedNotifications.has(n.id));
              AsyncStorage.setItem(storageKey, JSON.stringify(updated));
            } else {
              // удаляем по одному, без ожидания
              [...selectedNotifications].forEach(id => {
                NotificationService.getInstance().deleteNotification(id).catch(() => {});
              });
            }
            setIsSelectionMode(false);
            setSelectedNotifications(new Set());
          },
        },
      ]
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      t('notifications.alerts.deleteTitle'),
      t('notifications.alerts.deleteMessage'),
      [
        { text: t('notifications.buttons.cancel'), style: 'cancel' },
        {
          text: t('notifications.delete'),
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            if (__DEV__) {
              const updated = notifications.filter(n => n.id !== notificationId);
              AsyncStorage.setItem(storageKey, JSON.stringify(updated));
            } else {
              NotificationService.getInstance().deleteNotification(notificationId).catch(() => {});
            }
          },
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    if (__DEV__) {
      AsyncStorage.setItem(storageKey, JSON.stringify(
        notifications.map(n => ({ ...n, isRead: true }))
      ));
    } else if (user?.id) {
      NotificationService.getInstance().markAllAsRead(user.id).catch(() => {});
    }
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
              <Text style={NotificationsScreenStyles.cancelButton}>{t('notifications.cancel')}</Text>
            </TouchableOpacity>
            <Text style={NotificationsScreenStyles.selectionTitle}>
              {t('notifications.selectedCount')}: {selectedNotifications.size}
            </Text>
            <TouchableOpacity onPress={handleSelectAll}>
              <Text style={NotificationsScreenStyles.selectAllButton}>
                {selectedNotifications.size === notifications.length ? t('notifications.unselectAll') : t('notifications.selectAll')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Обычный режим
          <View style={NotificationsScreenStyles.headerContent}>
            <View style={NotificationsScreenStyles.headerLeft}>
              <Ionicons name="notifications" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
              <Text style={[NotificationsScreenStyles.headerTitle, isDark && NotificationsScreenStyles.headerTitleDark]}>
                {t('notifications.title')}
              </Text>
            </View>
            <View style={NotificationsScreenStyles.headerRight}>
              {unreadCount > 0 && (
                <TouchableOpacity
                  style={NotificationsScreenStyles.markAllButton}
                  onPress={handleMarkAllAsRead}
                >
                  <Text style={NotificationsScreenStyles.markAllButtonText}>
                    {t('notifications.readAll')} ({unreadCount})
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
            <Text style={NotificationsScreenStyles.actionButtonText}>{t('notifications.markRead')}</Text>
          </TouchableOpacity>
          
                      <TouchableOpacity 
              style={[NotificationsScreenStyles.actionButton, NotificationsScreenStyles.deleteActionButton]}
              onPress={handleDeleteSelected}
            >
              <Ionicons name="trash" size={20} color="#EF4444" />
              <Text style={[NotificationsScreenStyles.actionButtonText, NotificationsScreenStyles.deleteButtonText]}>
                {t('notifications.delete')}
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
              {t('notifications.noNotifications')}
            </Text>
            <Text style={[NotificationsScreenStyles.emptyStateSubtext, isDark && NotificationsScreenStyles.emptyStateSubtextDark]}>
              {t('notifications.allNotificationsHere')}
            </Text>
          </View>
        ) : (
          notifications.map(renderNotificationItem)
        )}
      </ScrollView>
      {/* Первичная загрузка */}
      {notifications.length === 0 && !refreshing && (
        <></>
      )}
      {useEffect(() => { loadNotifications(); }, [user?.id]) as any}
    </SafeAreaView>
  );
};

export default NotificationsScreen;
