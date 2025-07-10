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
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#E5E7EB',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
    }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: getNotificationColor(item.type),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}>
        <Ionicons name={getNotificationIcon(item.type) as keyof typeof Ionicons.glyphMap} size={20} color="#FFFFFF" />
      </View>
      
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: isDark ? '#F9FAFB' : '#1F2937',
          marginBottom: 4,
        }}>
          {item.title}
        </Text>
        <Text style={{
          fontSize: 14,
          color: isDark ? '#9CA3AF' : '#6B7280',
          marginBottom: 4,
        }}>
          {item.message}
        </Text>
        <Text style={{
          fontSize: 12,
          color: isDark ? '#6B7280' : '#9CA3AF',
        }}>
          {new Date(item.createdAt).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={() => onDeleteNotification(item.id)}
        style={{
          padding: 8,
        }}
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
        flex: 1,
        backgroundColor: isDark ? '#000000' : '#F2F2F7',
      }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#374151' : '#E5E7EB',
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#1F2937',
          }}>
            Уведомления
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={onMarkAllAsRead}
              style={{ marginRight: 16 }}
            >
              <Text style={{ color: '#007AFF', fontSize: 16 }}>
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