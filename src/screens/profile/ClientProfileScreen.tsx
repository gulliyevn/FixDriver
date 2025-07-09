import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Switch,
  StatusBar
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AppAvatar from '../../components/AppAvatar';
import ProfileOption from '../../components/ProfileOption';
import ProfileNotificationsModal from '../../components/ProfileNotificationsModal';
import ProfileChildrenSection from '../../components/ProfileChildrenSection';
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

  const handleAddChild = () => {
    handleOptionPress('Добавить ребенка');
  };

  const handleEditChild = (child: Child) => {
    handleOptionPress(`Редактировать ${child.name}`);
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
        <ProfileChildrenSection
          children={children}
          onAddChild={handleAddChild}
          onEditChild={handleEditChild}
        />

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
              trackColor={{ false: '#E5E7EB', true: '#007AFF' }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#F9FAFB'}
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
              trackColor={{ false: '#E5E7EB', true: '#007AFF' }}
              thumbColor={locationEnabled ? '#FFFFFF' : '#F9FAFB'}
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
              trackColor={{ false: '#E5E7EB', true: '#007AFF' }}
              thumbColor={isDark ? '#FFFFFF' : '#F9FAFB'}
            />
          </View>
        </AppCard>

        {/* Profile Options */}
        <AppCard style={ClientProfileScreenStyles.optionsCard} margin={16}>
          <ProfileOption
            icon={<Ionicons name="person" size={22} color="#007AFF" />}
            label="Редактировать профиль"
            value="Изменить личные данные"
            onPress={() => handleOptionPress('Редактировать профиль')}
          />
          
          <ProfileOption
            icon={<Ionicons name="card" size={22} color="#007AFF" />}
            label="Способы оплаты"
            value="Управление картами"
            onPress={() => handleOptionPress('Способы оплаты')}
          />
          
          <ProfileOption
            icon={<Ionicons name="shield-checkmark" size={22} color="#007AFF" />}
            label="Безопасность"
            value="Настройки безопасности"
            onPress={() => handleOptionPress('Безопасность')}
          />
          
          <ProfileOption
            icon={<Ionicons name="help-circle" size={22} color="#007AFF" />}
            label="Поддержка"
            value="Связаться с поддержкой"
            onPress={() => handleOptionPress('Поддержка')}
          />
          
          <ProfileOption
            icon={<Ionicons name="information-circle" size={22} color="#007AFF" />}
            label="О приложении"
            value="Версия 1.0.0"
            onPress={() => handleOptionPress('О приложении')}
          />
        </AppCard>

        {/* Logout Button */}
        <TouchableOpacity
          style={ClientProfileScreenStyles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={ClientProfileScreenStyles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Notifications Modal */}
      <ProfileNotificationsModal
        visible={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        notifications={notifications}
        onDeleteNotification={handleDeleteNotification}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </View>
  );
};

export default ClientProfileScreen;
