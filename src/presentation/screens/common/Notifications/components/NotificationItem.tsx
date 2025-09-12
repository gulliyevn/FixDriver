import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/NotificationsScreen.styles';

/**
 * Notification Item Component
 * 
 * Individual notification item with selection and actions
 */

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  };
  isSelected: boolean;
  isSelectionMode: boolean;
  isDark: boolean;
  onPress: () => void;
  onLongPress: () => void;
  onDelete: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  isSelected,
  isSelectionMode,
  isDark,
  onPress,
  onLongPress,
  onDelete
}) => {
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

  const iconName = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        isDark && styles.notificationItemDark,
        !notification.isRead && styles.unreadNotification,
        isSelected && styles.selectedNotification,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Selection checkbox */}
      {isSelectionMode && (
        <TouchableOpacity
          style={[
            styles.checkbox,
            isSelected && styles.checkboxSelected
          ]}
          onPress={onPress}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      )}

      <View style={styles.notificationContent}>
        {/* Icon */}
        <View
          style={[
            styles.notificationIcon,
            { backgroundColor: iconColor + '20' },
          ]}
        >
          <Ionicons
            name={iconName}
            size={20}
            color={iconColor}
          />
        </View>

        {/* Content */}
        <View style={styles.notificationTextContainer}>
          <View style={styles.notificationHeader}>
            <Text
              style={[
                styles.notificationTitle,
                isDark && styles.notificationTitleDark,
                !notification.isRead && styles.unreadTitle,
              ]}
            >
              {notification.title}
            </Text>
          </View>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <Text style={styles.notificationTime}>{notification.createdAt}</Text>
        </View>
        
        {!isSelectionMode && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Ionicons name="trash" size={20} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};
