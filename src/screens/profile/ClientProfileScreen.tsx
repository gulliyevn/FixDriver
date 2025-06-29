import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Switch,
  StatusBar,
  Modal
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AppAvatar from '../../components/AppAvatar';
import ProfileOption from '../../components/ProfileOption';
import { Ionicons } from '@expo/vector-icons';
import AppCard from '../../components/AppCard';
import { notificationService, Notification } from '../../services/NotificationService';

interface Child {
  id: string;
  name: string;
  age: number;
  school?: string;
  avatar?: string;
}

const ClientProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [children] = useState<Child[]>([
    { id: '1', name: 'Анна', age: 12, school: 'Школа №123' },
    { id: '2', name: 'Михаил', age: 8, school: 'Школа №456' },
  ]);

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const handleOptionPress = (option: string) => {
    Alert.alert('Опция', `${option} будет доступна в следующем обновлении`);
  };

  const handleNotificationsCenter = () => {
    setNotifications(notificationService.getNotifications());
    setShowNotificationsModal(true);
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

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Notifications Button */}
      <TouchableOpacity 
        style={styles.notificationButton} 
        onPress={handleNotificationsCenter}
      >
        <Ionicons name="notifications-outline" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>3</Text>
        </View>
      </TouchableOpacity>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <AppCard style={styles.profileCard} margin={16}>
        <View style={styles.profileHeader}>
          <AppAvatar 
            source={{ uri: "https://via.placeholder.com/80" }}
            name="Иван Петров"
            size={80}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Иван Петров</Text>
            <Text style={styles.profileEmail}>ivan@example.com</Text>
            <Text style={styles.profilePhone}>+7 (999) 123-45-67</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={styles.ratingLabel}>(127 поездок)</Text>
            </View>
          </View>
        </View>
      </AppCard>

      {/* Quick Stats */}
      <AppCard style={styles.statsCard} margin={16}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>Поездок</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₽12,450</Text>
            <Text style={styles.statLabel}>Потрачено</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Рейтинг</Text>
          </View>
        </View>
      </AppCard>

      {/* Children Section */}
      <AppCard style={styles.childrenCard} margin={16}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Дети под опекой</Text>
          <TouchableOpacity onPress={() => handleOptionPress('Добавить ребенка')}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        {children.map((child) => (
          <View key={child.id} style={styles.childItem}>
            <AppAvatar name={child.name} size={40} />
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childDetails}>{child.age} лет • {child.school}</Text>
            </View>
            <TouchableOpacity onPress={() => handleOptionPress('Редактировать')}>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        ))}
      </AppCard>

      {/* Settings Section */}
      <AppCard style={styles.settingsCard} margin={16}>
        <Text style={styles.sectionTitle}>Настройки</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Уведомления</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="location" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Геолокация</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={20} color="#007AFF" />
            <Text style={styles.settingText}>Темная тема</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </AppCard>

      {/* Options Section */}
      <AppCard style={styles.optionsCard} margin={16}>
        <ProfileOption
          icon={<Ionicons name="card" size={22} color="#007AFF" />}
          label="Платежные методы"
          value="Добавить карту"
          onPress={() => handleOptionPress('Платежные методы')}
        />
        
        <ProfileOption
          icon={<Ionicons name="heart" size={22} color="#FF3B30" />}
          label="Избранные места"
          value="Дом, работа, школа"
          onPress={() => handleOptionPress('Избранные места')}
        />
        
        <ProfileOption
          icon={<Ionicons name="time" size={22} color="#FF9500" />}
          label="История поездок"
          value="Последние 30 дней"
          onPress={() => handleOptionPress('История поездок')}
        />
        
        <ProfileOption
          icon={<Ionicons name="notifications" size={22} color="#1E3A8A" />}
          label="Центр уведомлений"
          value="Все уведомления"
          onPress={handleNotificationsCenter}
        />
        
        <ProfileOption
          icon={<Ionicons name="help-circle" size={22} color="#34C759" />}
          label="Помощь"
          value="FAQ и поддержка"
          onPress={() => handleOptionPress('Помощь')}
        />
        
        <ProfileOption
          icon={<Ionicons name="information-circle" size={22} color="#8E8E93" />}
          label="О приложении"
          value="Версия 1.0.0"
          onPress={() => handleOptionPress('О приложении')}
        />
      </AppCard>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>

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
            <TouchableOpacity onPress={() => setShowNotificationsModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          </View>

          {notifications.filter(n => !n.isRead).length > 0 && (
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
                <View
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    { 
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: isDark ? '#374151' : '#E5E5EA'
                    },
                    !notification.isRead && styles.unreadNotification,
                  ]}
                >
                  <View style={styles.notificationContent}>
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

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteNotification(notification.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  ratingStar: {
    fontSize: 16,
    color: '#FFD700',
    marginLeft: 4,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  statsCard: {
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
  },
  childrenCard: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  childInfo: {
    flex: 1,
    marginLeft: 12,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  childDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  settingsCard: {
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  optionsCard: {
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  markAllButton: {
    backgroundColor: '#1E3A8A',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  markAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  notificationItem: {
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E3A8A',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
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
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  notificationButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});

export default ClientProfileScreen;
