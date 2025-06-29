import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  StatusBar,
  Modal
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import RatingStars from '../../components/RatingStars';
import { notificationService, Notification } from '../../services/NotificationService';

interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  carModel: string;
  carNumber: string;
  isOnline: boolean;
  distance: string;
  estimatedTime: string;
  isAvailable: boolean;
  photo?: string;
}

const DriversScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const drivers: Driver[] = [];

  useEffect(() => {
    setNotifications(notificationService.getNotifications());
  }, []);

  const handleDriverSelect = (driver: Driver) => {
    Alert.alert(
      'Выбор водителя',
      `Выбрать ${driver.name}?\n${driver.carModel} • ${driver.carNumber}\nРейтинг: ${driver.rating} ⭐`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выбрать', onPress: () => Alert.alert('Успешно', 'Водитель выбран!') }
      ]
    );
  };

  const handleBookDriver = (driver: Driver) => {
    Alert.alert(
      'Бронирование',
      `Забронировать ${driver.name} на завтра?\n${driver.carModel} • ${driver.carNumber}`,
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Забронировать', onPress: () => Alert.alert('Успешно', 'Водитель забронирован!') }
      ]
    );
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

  const handleFilterPress = () => {
    Alert.alert('Фильтры', 'Расширенные фильтры будут доступны в следующем обновлении');
  };

  const filters = [
    { id: 'all', label: 'Все', icon: 'car' },
    { id: 'online', label: 'Онлайн', icon: 'radio-button-on' },
    { id: 'nearby', label: 'Близко', icon: 'location' },
    { id: 'top', label: 'Топ', icon: 'star' },
    { id: 'available', label: 'Свободны', icon: 'checkmark-circle' },
  ];

  const filteredDrivers = drivers.filter(driver => {
    if (selectedFilter === 'online') return driver.isOnline;
    if (selectedFilter === 'nearby') return parseFloat(driver.distance) <= 1.0;
    if (selectedFilter === 'top') return driver.rating >= 4.8;
    if (selectedFilter === 'available') return driver.isAvailable;
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Мои водители
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationBtn} onPress={handleNotifications}>
            <Ionicons name="notifications-outline" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
            {notificationService.getUnreadCount() > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{notificationService.getUnreadCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
            <Ionicons name="options-outline" size={24} color="#1E3A8A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск водителей..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
            underlineColorAndroid="transparent"
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={14} 
                color={selectedFilter === filter.id ? '#FFFFFF' : '#1E3A8A'} 
              />
              <Text style={[
                styles.filterText,
                { color: selectedFilter === filter.id ? '#FFFFFF' : '#1E3A8A' }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Drivers List */}
      <ScrollView style={styles.driversList} showsVerticalScrollIndicator={false}>
        {filteredDrivers.map((driver) => (
          <AppCard key={driver.id} style={styles.driverCard} margin={8}>
            <View style={styles.driverContent}>
              <View style={styles.driverHeader}>
                <View style={styles.driverInfo}>
                  <View style={styles.driverAvatar}>
                    {driver.photo ? (
                      <Ionicons name="person" size={24} color="#1E3A8A" />
                    ) : (
                      <Ionicons name="person" size={24} color="#1E3A8A" />
                    )}
                  </View>
                  <View style={styles.driverDetails}>
                    <Text style={styles.driverName}>{driver.name}</Text>
                    <Text style={styles.carInfo}>
                      {driver.carModel} • {driver.carNumber}
                    </Text>
                  </View>
                </View>
                <View style={styles.driverStatus}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: driver.isOnline ? '#10B981' : '#6B7280' }
                  ]} />
                  <Text style={styles.statusText}>
                    {driver.isOnline ? 'Онлайн' : 'Офлайн'}
                  </Text>
                </View>
              </View>

              <View style={styles.driverStats}>
                <View style={styles.statItem}>
                  <RatingStars rating={driver.rating} size={16} />
                  <Text style={styles.statText}>{driver.rating}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="car" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{driver.totalRides} поездок</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="location" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{driver.distance}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={16} color="#6B7280" />
                  <Text style={styles.statText}>{driver.estimatedTime}</Text>
                </View>
              </View>

              <View style={styles.driverFooter}>
                <View style={styles.actionButtons}>
                  {driver.isAvailable ? (
                    <>
                      <TouchableOpacity 
                        style={styles.selectButton}
                        onPress={() => handleDriverSelect(driver)}
                      >
                        <Text style={styles.selectButtonText}>Выбрать</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.bookButton}
                        onPress={() => handleBookDriver(driver)}
                      >
                        <Text style={styles.bookButtonText}>Забронировать</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity style={styles.unavailableButton} disabled>
                      <Text style={styles.unavailableButtonText}>Недоступен</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </AppCard>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    padding: 8,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 44,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  filtersContainer: {
    marginBottom: 0,
    paddingBottom: 0,
    marginTop: 8,
    height: 32,
    minHeight: 32,
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 0,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E3A8A',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  driversList: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 0,
    paddingTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  driverCard: {
    marginBottom: 8,
  },
  driverContent: {
    paddingVertical: 8,
  },
  driverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  carInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  driverStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
  },
  driverStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  driverFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  selectButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookButtonText: {
    color: '#1E3A8A',
    fontSize: 14,
    fontWeight: '600',
  },
  unavailableButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  unavailableButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
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

export default DriversScreen;
