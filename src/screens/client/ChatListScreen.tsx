import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { notificationService, Notification } from '../../services/NotificationService';

type NavigationProp = StackNavigationProp<ClientStackParamList, 'ChatList'>;

interface ChatPreview {
  driverId: string;
  driverName: string;
  driverCar: string;
  driverNumber: string;
  driverRating: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  driverStatus: 'online' | 'offline' | 'busy';
}

const ChatListScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const chats: ChatPreview[] = [
    {
      driverId: 'driver1',
      driverName: 'Александр Петров',
      driverCar: 'Toyota Camry',
      driverNumber: 'А123БВ777',
      driverRating: '4.8',
      lastMessage: 'Приеду через 5 минут. Буду на белой Toyota Camry.',
      timestamp: '14:32',
      unreadCount: 2,
      driverStatus: 'online'
    },
    {
      driverId: 'driver2',
      driverName: 'Мурад Алиев',
      driverCar: 'Mercedes E-Class',
      driverNumber: 'В456ГД888',
      driverRating: '4.9',
      lastMessage: 'Спасибо за поездку!',
      timestamp: 'Вчера',
      unreadCount: 0,
      driverStatus: 'offline'
    }
  ];

  useEffect(() => {
    setNotifications(notificationService.getNotifications());
  }, []);

  const handleChatPress = (chat: ChatPreview) => {
    navigation.navigate('ChatConversation', {
      driverId: chat.driverId,
      driverName: chat.driverName,
      driverCar: chat.driverCar,
      driverNumber: chat.driverNumber,
      driverRating: chat.driverRating,
      driverStatus: chat.driverStatus
    });
  };

  const handleNotifications = () => {
    setNotifications(notificationService.getNotifications());
    setShowNotificationsModal(true);
    setIsSelectionMode(false);
    setSelectedNotifications([]);
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
            notificationService.removeNotification(notificationId);
            setNotifications(notificationService.getNotifications());
          },
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
    setNotifications(notificationService.getNotifications());
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

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotifications([]);
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAllNotifications = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const deleteSelectedNotifications = () => {
    if (selectedNotifications.length === 0) return;
    
    Alert.alert(
      'Удалить уведомления',
      `Вы уверены, что хотите удалить ${selectedNotifications.length} уведомлений?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            selectedNotifications.forEach(id => {
              notificationService.removeNotification(id);
            });
            setNotifications(notificationService.getNotifications());
            setSelectedNotifications([]);
            setIsSelectionMode(false);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'В сети';
      case 'busy': return 'Занят';
      case 'offline': return 'Не в сети';
      default: return 'Не в сети';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.notificationBtn} onPress={handleNotifications}>
          <Ionicons name="notifications-outline" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
          {notificationService.getUnreadCount() > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{notificationService.getUnreadCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Чаты
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Chat List */}
      <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
        {chats.map((chat) => (
          <TouchableOpacity key={chat.driverId} onPress={() => handleChatPress(chat)}>
            <AppCard style={styles.chatItem} margin={16}>
              <View style={styles.chatContent}>
                <View style={styles.driverInfo}>
                  <View style={styles.driverAvatar}>
                    <Text style={{ fontSize: 20 }}>👨‍💼</Text>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(chat.driverStatus) }]} />
                  </View>
                  <View style={styles.chatDetails}>
                    <View style={styles.chatHeader}>
                      <Text style={[styles.driverName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                        {chat.driverName}
                      </Text>
                      <Text style={styles.timestamp}>{chat.timestamp}</Text>
                    </View>
                    <Text style={styles.carInfo}>{chat.driverCar} • {chat.driverNumber}</Text>
                    <Text style={[styles.lastMessage, { color: isDark ? '#D1D5DB' : '#6B7280' }]} numberOfLines={1}>
                      {chat.lastMessage}
                    </Text>
                    <View style={styles.chatFooter}>
                      <View style={styles.statusContainer}>
                        <Text style={[styles.statusText, { color: getStatusColor(chat.driverStatus) }]}>
                          {getStatusText(chat.driverStatus)}
                        </Text>
                      </View>
                      {chat.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.rating}>
                  <Text style={[styles.ratingText, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                    {chat.driverRating}
                  </Text>
                  <Text style={styles.ratingStar}>⭐</Text>
                </View>
              </View>
            </AppCard>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Модал центра уведомлений */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333333' : '#E5E5EA' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Центр уведомлений
            </Text>
            <View style={styles.modalHeaderActions}>
              {!isSelectionMode ? (
                <>
                  <TouchableOpacity onPress={toggleSelectionMode} style={styles.modalSelectButton}>
                    <Text style={[styles.modalSelectButtonText, { color: isDark ? '#FFFFFF' : '#1E3A8A' }]}>
                      Выбрать
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowNotificationsModal(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={toggleSelectionMode} style={styles.cancelButton}>
                  <Text style={[styles.cancelButtonText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    Отмена
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {!isSelectionMode && notifications.filter(n => !n.isRead).length > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
              <Text style={styles.markAllButtonText}>
                Прочитать все ({notifications.filter(n => !n.isRead).length})
              </Text>
            </TouchableOpacity>
          )}

          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons 
                  name="notifications-off" 
                  size={64} 
                  color={isDark ? '#6B7280' : '#9CA3AF'} 
                />
                <Text style={[styles.emptyStateText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Нет уведомлений
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Все уведомления будут отображаться здесь
                </Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    { 
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: isDark ? '#374151' : '#E5E5EA'
                    },
                    !notification.isRead && styles.unreadNotification,
                    isSelectionMode && selectedNotifications.includes(notification.id) && styles.selectedNotification,
                  ]}
                  onPress={() => isSelectionMode ? toggleNotificationSelection(notification.id) : null}
                  disabled={!isSelectionMode}
                >
                  <View style={styles.notificationContent}>
                    {isSelectionMode && (
                      <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => toggleNotificationSelection(notification.id)}
                      >
                        <Ionicons
                          name={selectedNotifications.includes(notification.id) ? "checkbox" : "square-outline"}
                          size={24}
                          color={selectedNotifications.includes(notification.id) ? "#1E3A8A" : "#9CA3AF"}
                        />
                      </TouchableOpacity>
                    )}

                    <View
                      style={[
                        styles.notificationIcon,
                        { backgroundColor: getNotificationColor(notification.type) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color={getNotificationColor(notification.type)}
                      />
                    </View>

                    <View style={styles.notificationTextContainer}>
                      <Text
                        style={[
                          styles.notificationTitle,
                          { color: isDark ? '#FFFFFF' : '#000000' },
                          !notification.isRead && styles.unreadTitle,
                        ]}
                      >
                        {notification.title}
                      </Text>
                      <Text
                        style={[
                          styles.notificationMessage,
                          { color: isDark ? '#9CA3AF' : '#6B7280' }
                        ]}
                      >
                        {notification.message}
                      </Text>
                      <Text
                        style={[
                          styles.notificationTime,
                          { color: isDark ? '#6B7280' : '#9CA3AF' }
                        ]}
                      >
                        {notification.time.toLocaleString('ru-RU')}
                      </Text>
                    </View>

                    {!isSelectionMode && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteNotification(notification.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Кнопки снизу модала */}
          {isSelectionMode && (
            <View style={[styles.bottomActions, { borderTopColor: isDark ? '#333333' : '#E5E5EA' }]}>
              <TouchableOpacity 
                style={[styles.bottomButton, styles.selectAllButton]} 
                onPress={selectAllNotifications}
              >
                <Text style={[styles.bottomButtonText, { color: '#1E3A8A' }]}>
                  {selectedNotifications.length === notifications.length ? 'Снять все' : 'Выбрать все'}
                </Text>
              </TouchableOpacity>
              
              {selectedNotifications.length > 0 && (
                <TouchableOpacity 
                  style={[styles.bottomButton, styles.deleteAllButton]} 
                  onPress={deleteSelectedNotifications}
                >
                  <Text style={[styles.bottomButtonText, { color: '#FFFFFF' }]}>
                    Удалить ({selectedNotifications.length})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  notificationBtn: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    marginBottom: 8,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  driverInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  carInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  rating: {
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingStar: {
    fontSize: 14,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalSelectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modalSelectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  markAllButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  markAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  notificationItem: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A8A',
  },
  selectedNotification: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
    padding: 4,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectAllButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  deleteAllButton: {
    backgroundColor: '#EF4444',
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChatListScreen; 