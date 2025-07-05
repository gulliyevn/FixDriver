import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { notificationService, Notification } from '../services/NotificationService';
import { NotificationDropdownStyles } from '../styles/components/NotificationDropdown.styles';

interface NotificationDropdownProps {
  visible: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  visible,
  onClose,
  position,
}) => {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    if (visible) {
      setNotifications(notificationService.getNotifications());
      
      // Анимация появления
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Анимация исчезновения
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Подписываемся на обновления уведомлений
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    return unsubscribe;
  }, [visible, fadeAnim, slideAnim]);

  if (!visible) {
    return null;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trip':
        return 'car-outline';
      case 'payment':
        return 'card-outline';
      case 'driver':
        return 'person-outline';
      case 'system':
        return 'settings-outline';
      default:
        return 'notifications-outline';
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

  // Адаптивные размеры
  const dropdownWidth = isTablet ? 400 : screenWidth - 32;
  const maxHeight = screenHeight * 0.7;
  const dropdownLeft = isTablet ? position.left : 16;

  return (
    <>
      {/* Overlay с анимацией */}
      <Animated.View
        style={[
          NotificationDropdownStyles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={NotificationDropdownStyles.overlayTouch}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Notification Center */}
      <Animated.View
        style={[
          NotificationDropdownStyles.dropdown,
          {
            width: dropdownWidth,
            maxHeight: maxHeight,
            top: Platform.OS === 'ios' 
              ? position.top + 60 + (StatusBar.currentHeight || 0)
              : position.top + 80,
            left: dropdownLeft,
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={[NotificationDropdownStyles.header, isDark && NotificationDropdownStyles.headerDark]}>
          <View style={NotificationDropdownStyles.headerLeft}>
            <Ionicons 
              name="notifications" 
              size={24} 
              color={isDark ? '#F9FAFB' : '#1F2937'} 
            />
            <Text style={[NotificationDropdownStyles.headerTitle, isDark && NotificationDropdownStyles.headerTitleDark]}>
              Центр уведомлений
            </Text>
          </View>
          <View style={NotificationDropdownStyles.headerRight}>
            {unreadCount > 0 && (
              <View style={NotificationDropdownStyles.unreadBadge}>
                <Text style={NotificationDropdownStyles.unreadBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={NotificationDropdownStyles.closeButton} 
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name="close" 
                size={24} 
                color={isDark ? '#9CA3AF' : '#6B7280'} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[NotificationDropdownStyles.quickActions, isDark && NotificationDropdownStyles.quickActionsDark]}>
          <TouchableOpacity 
            style={[NotificationDropdownStyles.quickActionButton, isDark && NotificationDropdownStyles.quickActionButtonDark]}
            onPress={() => notificationService.markAllAsRead()}
          >
            <Ionicons name="checkmark-done" size={16} color="#3B82F6" />
            <Text style={NotificationDropdownStyles.quickActionText}>Прочитать все</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[NotificationDropdownStyles.quickActionButton, isDark && NotificationDropdownStyles.quickActionButtonDark]}
                            onPress={() => {
                  // TODO: Implement filter functionality
                }}
          >
            <Ionicons name="filter" size={16} color="#3B82F6" />
            <Text style={NotificationDropdownStyles.quickActionText}>Фильтр</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <View style={NotificationDropdownStyles.emptyState}>
            <Ionicons 
              name="notifications-off-outline" 
              size={48} 
              color={isDark ? '#6B7280' : '#9CA3AF'} 
            />
            <Text style={[NotificationDropdownStyles.emptyStateText, isDark && NotificationDropdownStyles.emptyStateTextDark]}>
              Нет уведомлений
            </Text>
            <Text style={[NotificationDropdownStyles.emptyStateSubtext, isDark && NotificationDropdownStyles.emptyStateSubtextDark]}>
              Все новые уведомления появятся здесь
            </Text>
          </View>
        ) : (
          <ScrollView 
            style={NotificationDropdownStyles.notificationsList} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={NotificationDropdownStyles.notificationsContent}
          >
            {notifications.map((notification, index) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  NotificationDropdownStyles.notificationItem,
                  isDark && NotificationDropdownStyles.notificationItemDark,
                  !notification.isRead && NotificationDropdownStyles.unreadNotification,
                  index === notifications.length - 1 && NotificationDropdownStyles.lastNotificationItem,
                ]}
                onPress={() => {
                  notificationService.markAsRead(notification.id);
                }}
                activeOpacity={0.7}
              >
                <View style={NotificationDropdownStyles.notificationContent}>
                  {/* Icon with priority indicator */}
                  <View style={NotificationDropdownStyles.iconContainer}>
                    <View
                      style={[
                        NotificationDropdownStyles.notificationIcon,
                        { backgroundColor: getNotificationColor(notification.type) + '15' },
                      ]}
                    >
                      <Ionicons
                        name={getNotificationIcon(notification.type) as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={getNotificationColor(notification.type)}
                      />
                    </View>
                  </View>

                  {/* Content */}
                  <View style={NotificationDropdownStyles.notificationText}>
                    <View style={NotificationDropdownStyles.notificationHeader}>
                      <Text
                        style={[
                          NotificationDropdownStyles.notificationTitle,
                          isDark && NotificationDropdownStyles.notificationTitleDark,
                          !notification.isRead && NotificationDropdownStyles.unreadTitle,
                        ]}
                        numberOfLines={1}
                      >
                        {notification.title}
                      </Text>
                      <Text style={[NotificationDropdownStyles.notificationTime, isDark && NotificationDropdownStyles.notificationTimeDark]}>
                        {notificationService.formatTime(notification.createdAt || new Date().toISOString())}
                      </Text>
                    </View>

                    <Text
                      style={[
                        NotificationDropdownStyles.notificationMessage,
                        isDark && NotificationDropdownStyles.notificationMessageDark,
                      ]}
                      numberOfLines={isSmallScreen ? 2 : 3}
                    >
                      {notification.message}
                    </Text>

                    {/* Action buttons for unread notifications */}
                    {!notification.isRead && (
                      <View style={NotificationDropdownStyles.notificationActions}>
                        <TouchableOpacity
                          style={NotificationDropdownStyles.actionButton}
                          onPress={() => notificationService.markAsRead(notification.id)}
                        >
                          <Ionicons name="checkmark" size={14} color="#10B981" />
                          <Text style={NotificationDropdownStyles.actionButtonText}>Прочитано</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {/* Unread indicator */}
                  {!notification.isRead && <View style={NotificationDropdownStyles.unreadIndicator} />}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Footer */}
        <View style={[NotificationDropdownStyles.footer, isDark && NotificationDropdownStyles.footerDark]}>
          <TouchableOpacity 
            style={NotificationDropdownStyles.footerButton} 
            onPress={() => {
              // TODO: Navigate to all notifications screen
            }}
          >
            <Text style={NotificationDropdownStyles.footerText}>Показать все уведомления</Text>
            <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

export default NotificationDropdown; 