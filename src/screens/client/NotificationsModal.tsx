import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DriversScreenStyles as styles } from '../../styles/screens/DriversScreen.styles';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

interface NotificationsModalProps {
  visible: boolean;
  notifications: Notification[];
  isDark: boolean;
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
  onDeleteNotification: (notificationId: string) => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  notifications,
  isDark,
  onClose,
  onMarkAsRead,
  onDeleteNotification,
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'warning';
      case 'error': return 'close-circle';
      default: return 'information-circle';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#3B82F6';
    }
  };

  const handleDeleteNotification = (notification: Notification) => {
    Alert.alert(
      'Удалить уведомление',
      'Вы уверены, что хотите удалить это уведомление?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => onDeleteNotification(notification.id)
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            Уведомления
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <ScrollView style={styles.notificationsList}>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off" size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
              <Text style={[styles.emptyStateText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Нет новых уведомлений
              </Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <View
                key={notification.id}
                style={[
                  styles.notificationItem,
                  { backgroundColor: isDark ? '#374151' : '#F9FAFB' },
                  !notification.isRead && styles.unreadNotification
                ]}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons 
                    name={getNotificationIcon(notification.type) as keyof typeof Ionicons.glyphMap} 
                    size={24} 
                    color={getNotificationColor(notification.type)} 
                  />
                </View>
                
                <View style={styles.notificationTextContainer}>
                  <View style={styles.notificationContent}>
                    <Text style={[styles.notificationTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                      {notification.title}
                    </Text>
                    <Text style={[styles.notificationTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {notification.timestamp}
                    </Text>
                  </View>
                  
                  <Text style={[styles.notificationMessage, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                    {notification.message}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    {!notification.isRead && (
                      <TouchableOpacity
                        style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#3B82F6', borderRadius: 4 }}
                        onPress={() => onMarkAsRead(notification.id)}
                      >
                        <Text style={{ color: '#FFFFFF', fontSize: 12 }}>Отметить как прочитанное</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteNotification(notification)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default NotificationsModal; 