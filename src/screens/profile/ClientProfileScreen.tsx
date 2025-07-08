import React, { useState } from 'react';
import { 
  View, 
  Text, 
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
import { mockChildren } from '../../mocks';
import { ClientProfileScreenStyles } from '../../styles/screens/ClientProfileScreen.styles';

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

  const [children] = useState<Child[]>(mockChildren);

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
    <View style={[ClientProfileScreenStyles.container, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Notifications Button */}
      <TouchableOpacity 
        style={ClientProfileScreenStyles.notificationButton} 
        onPress={handleNotificationsCenter}
      >
        <Ionicons name="notifications-outline" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        <View style={ClientProfileScreenStyles.notificationBadge}>
          <Text style={ClientProfileScreenStyles.notificationBadgeText}>3</Text>
        </View>
      </TouchableOpacity>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <AppCard style={ClientProfileScreenStyles.profileCard} margin={16}>
        <View style={ClientProfileScreenStyles.profileHeader}>
          <AppAvatar
            source={{ uri: "https://via.placeholder.com/80" }}
            name="Иван Петров"
            size={80}
          />
          <View style={ClientProfileScreenStyles.profileInfo}>
            <Text style={ClientProfileScreenStyles.profileName}>Иван Петров</Text>
            <Text style={ClientProfileScreenStyles.profileEmail}>ivan@example.com</Text>
            <Text style={ClientProfileScreenStyles.profilePhone}>+7 (999) 123-45-67</Text>
            <View style={ClientProfileScreenStyles.ratingContainer}>
              <Text style={ClientProfileScreenStyles.ratingText}>4.8</Text>
              <Text style={ClientProfileScreenStyles.ratingStar}>★</Text>
              <Text style={ClientProfileScreenStyles.ratingLabel}>(127 поездок)</Text>
            </View>
          </View>
        </View>
      </AppCard>

      {/* Quick Stats */}
      <AppCard style={ClientProfileScreenStyles.statsCard} margin={16}>
        <View style={ClientProfileScreenStyles.statsGrid}>
          <View style={ClientProfileScreenStyles.statItem}>
            <Text style={ClientProfileScreenStyles.statValue}>127</Text>
            <Text style={ClientProfileScreenStyles.statLabel}>Поездок</Text>
          </View>
          <View style={ClientProfileScreenStyles.statDivider} />
          <View style={ClientProfileScreenStyles.statItem}>
            <Text style={ClientProfileScreenStyles.statValue}>₽12,450</Text>
            <Text style={ClientProfileScreenStyles.statLabel}>Потрачено</Text>
          </View>
          <View style={ClientProfileScreenStyles.statDivider} />
          <View style={ClientProfileScreenStyles.statItem}>
            <Text style={ClientProfileScreenStyles.statValue}>4.8</Text>
            <Text style={ClientProfileScreenStyles.statLabel}>Рейтинг</Text>
          </View>
        </View>
      </AppCard>

      {/* Children Section */}
      <AppCard style={ClientProfileScreenStyles.childrenCard} margin={16}>
        <View style={ClientProfileScreenStyles.sectionHeader}>
          <Text style={ClientProfileScreenStyles.sectionTitle}>Дети под опекой</Text>
          <TouchableOpacity onPress={() => handleOptionPress('Добавить ребенка')}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        {children.map((child) => (
          <View key={child.id} style={ClientProfileScreenStyles.childItem}>
            <AppAvatar name={child.name} size={40} />
            <View style={ClientProfileScreenStyles.childInfo}>
              <Text style={ClientProfileScreenStyles.childName}>{child.name}</Text>
              <Text style={ClientProfileScreenStyles.childDetails}>{child.age} лет • {child.school}</Text>
            </View>
            <TouchableOpacity onPress={() => handleOptionPress('Редактировать')}>
              <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
        ))}
      </AppCard>

      {/* Settings Section */}
      <AppCard style={ClientProfileScreenStyles.settingsCard} margin={16}>
        <Text style={ClientProfileScreenStyles.sectionTitle}>Настройки</Text>
        
        <View style={ClientProfileScreenStyles.settingItem}>
          <View style={ClientProfileScreenStyles.settingInfo}>
            <Ionicons name="notifications" size={20} color="#007AFF" />
            <Text style={ClientProfileScreenStyles.settingText}>Уведомления</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={ClientProfileScreenStyles.settingItem}>
          <View style={ClientProfileScreenStyles.settingInfo}>
            <Ionicons name="location" size={20} color="#007AFF" />
            <Text style={ClientProfileScreenStyles.settingText}>Геолокация</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={ClientProfileScreenStyles.settingItem}>
          <View style={ClientProfileScreenStyles.settingInfo}>
            <Ionicons name="moon" size={20} color="#007AFF" />
            <Text style={ClientProfileScreenStyles.settingText}>Темная тема</Text>
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
      <AppCard style={ClientProfileScreenStyles.optionsCard} margin={16}>
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
      <TouchableOpacity style={ClientProfileScreenStyles.logoutButton} onPress={handleLogout}>
        <Text style={ClientProfileScreenStyles.logoutText}>Выйти из аккаунта</Text>
      </TouchableOpacity>

      {/* Модал центра уведомлений */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[ClientProfileScreenStyles.modalContainer, { backgroundColor: isDark ? '#000000' : '#F2F2F7' }]}>
          <View style={[ClientProfileScreenStyles.modalHeader, { borderBottomColor: isDark ? '#333333' : '#E5E5EA' }]}>
            <Text style={[ClientProfileScreenStyles.modalTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Центр уведомлений
            </Text>
            <TouchableOpacity onPress={() => setShowNotificationsModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          </View>

          {notifications.filter(n => !n.isRead).length > 0 && (
            <TouchableOpacity style={ClientProfileScreenStyles.markAllButton} onPress={handleMarkAllAsRead}>
              <Text style={ClientProfileScreenStyles.markAllButtonText}>
                Прочитать все ({notifications.filter(n => !n.isRead).length})
              </Text>
            </TouchableOpacity>
          )}

          <ScrollView style={ClientProfileScreenStyles.notificationsList} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={ClientProfileScreenStyles.emptyState}>
                <Ionicons 
                  name="notifications-off" 
                  size={64} 
                  color={isDark ? '#6B7280' : '#9CA3AF'} 
                />
                <Text style={[ClientProfileScreenStyles.emptyStateText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Нет уведомлений
                </Text>
                <Text style={[ClientProfileScreenStyles.emptyStateSubtext, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  Все уведомления будут отображаться здесь
                </Text>
              </View>
            ) : (
              notifications.map((notification) => (
                <View
                  key={notification.id}
                  style={[
                    ClientProfileScreenStyles.notificationItem,
                    { 
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      borderColor: isDark ? '#374151' : '#E5E5EA'
                    },
                    !notification.isRead && ClientProfileScreenStyles.unreadNotification,
                  ]}
                >
                  <View style={ClientProfileScreenStyles.notificationContent}>
                    <View
                      style={[
                        ClientProfileScreenStyles.notificationIcon,
                        { backgroundColor: getNotificationColor(notification.type) + '20' },
                      ]}
                    >
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color={getNotificationColor(notification.type)}
                      />
                    </View>

                    <View style={ClientProfileScreenStyles.notificationTextContainer}>
                      <Text
                        style={[
                          ClientProfileScreenStyles.notificationTitle,
                          { color: isDark ? '#FFFFFF' : '#000000' },
                          !notification.isRead && ClientProfileScreenStyles.unreadTitle,
                        ]}
                      >
                        {notification.title}
                      </Text>
                      <Text
                        style={[
                          ClientProfileScreenStyles.notificationMessage,
                          { color: isDark ? '#9CA3AF' : '#6B7280' }
                        ]}
                      >
                        {notification.message}
                      </Text>
                                             <Text
                         style={[
                           ClientProfileScreenStyles.notificationTime,
                           { color: isDark ? '#6B7280' : '#9CA3AF' }
                         ]}
                       >
                         {new Date(notification.createdAt).toLocaleString('ru-RU')}
                       </Text>
                    </View>

                    <TouchableOpacity
                      style={ClientProfileScreenStyles.deleteButton}
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

export default ClientProfileScreen;
