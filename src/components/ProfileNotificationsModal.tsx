import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notification } from '../services/NotificationService';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ProfileNotificationsModalStyles } from '../styles/components/ProfileNotificationsModal.styles';
import { formatDateWithLanguage } from '../utils/formatters';

interface ProfileNotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
  onDeleteNotification: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const ProfileNotificationsModal: React.FC<ProfileNotificationsModalProps> = ({
  visible,
  onClose,
  notifications,
  onDeleteNotification,
  onMarkAllAsRead,
}) => {
  const { isDark } = useTheme();
  const { language } = useLanguage();

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

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={{
      ...ProfileNotificationsModalStyles.notificationItem,
      ...(isDark ? ProfileNotificationsModalStyles.notificationItemDark : ProfileNotificationsModalStyles.notificationItemLight),
    }}>
      <View style={{
        ...ProfileNotificationsModalStyles.iconContainer,
        backgroundColor: getNotificationColor(item.type),
      }}>
        <Ionicons name={getNotificationIcon(item.type) as keyof typeof Ionicons.glyphMap} size={20} color="#FFFFFF" />
      </View>
      
      <View style={ProfileNotificationsModalStyles.notificationContent}>
        <Text style={{
          ...ProfileNotificationsModalStyles.notificationTitle,
          ...(isDark ? ProfileNotificationsModalStyles.notificationTitleDark : ProfileNotificationsModalStyles.notificationTitleLight),
        }}>
          {item.title}
        </Text>
        <Text style={{
          ...ProfileNotificationsModalStyles.notificationMessage,
          ...(isDark ? ProfileNotificationsModalStyles.notificationMessageDark : ProfileNotificationsModalStyles.notificationMessageLight),
        }}>
          {item.message}
        </Text>
        <Text style={{
          ...ProfileNotificationsModalStyles.notificationTime,
          ...(isDark ? ProfileNotificationsModalStyles.notificationTimeDark : ProfileNotificationsModalStyles.notificationTimeLight),
        }}>
          {formatDateWithLanguage(new Date(item.createdAt), language, 'long')}
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={() => onDeleteNotification(item.id)}
        style={ProfileNotificationsModalStyles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{
        ...ProfileNotificationsModalStyles.container,
        ...(isDark ? ProfileNotificationsModalStyles.containerDark : ProfileNotificationsModalStyles.containerLight),
      }}>
        {/* Header */}
        <View style={{
          ...ProfileNotificationsModalStyles.header,
          ...(isDark ? ProfileNotificationsModalStyles.headerDark : ProfileNotificationsModalStyles.headerLight),
        }}>
          <Text style={{
            ...ProfileNotificationsModalStyles.headerTitle,
            ...(isDark ? ProfileNotificationsModalStyles.headerTitleDark : ProfileNotificationsModalStyles.headerTitleLight),
          }}>
            Уведомления
          </Text>
          <View style={ProfileNotificationsModalStyles.headerActions}>
            <TouchableOpacity
              onPress={onMarkAllAsRead}
              style={ProfileNotificationsModalStyles.markAllReadButton}
            >
              <Text style={ProfileNotificationsModalStyles.markAllReadText}>
                Прочитать все
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications List */}
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};

export default ProfileNotificationsModal; 