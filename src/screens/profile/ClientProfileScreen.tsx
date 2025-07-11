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
import { useI18n } from '../../hooks/useI18n';
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
  const { t, setLanguage, getCurrentLanguage, languageOptions, language } = useI18n();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [children] = useState<Child[]>(mockChildren);

  // Отладочная информация
  React.useEffect(() => {
    console.log('🌍 Текущий язык в профиле:', language);
    console.log('📝 Доступные языки:', languageOptions.map(lang => `${lang.flag} ${lang.native}`));
  }, [language, languageOptions]);

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('profile.logoutCancel'), style: 'cancel' },
        { text: t('profile.logoutConfirmButton'), onPress: logout, style: 'destructive' }
      ]
    );
  };

  const handleOptionPress = (option: string) => {
    Alert.alert(t('profile.option'), t('profile.optionNotAvailable', { option }));
  };

  const handleLanguageSelect = async () => {
    const currentLang = getCurrentLanguage();
    
    const languageNames = languageOptions.map(lang => ({
      text: `${lang.flag} ${lang.native}`,
      onPress: async () => {
        if (lang.code !== currentLang) {
          try {
            console.log('🔄 Меняем язык с', currentLang, 'на', lang.code);
            await setLanguage(lang.code);
            console.log('✅ Язык успешно изменен на', lang.code);
            Alert.alert(
              t('profile.languageChanged'),
              t('profile.languageChangeSuccess')
            );
          } catch (error) {
            console.error('❌ Ошибка при смене языка:', error);
            Alert.alert(t('common.error'), 'Failed to change language');
          }
        } else {
          console.log('ℹ️ Язык уже установлен:', lang.code);
        }
      }
    }));

    Alert.alert(
      t('profile.selectLanguage'),
      `Текущий язык: ${currentLang}`,
      languageNames
    );
  };

  const handleNotificationsCenter = () => {
    setNotifications(notificationService.getNotifications());
    setShowNotificationsModal(true);
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      t('profile.deleteNotification'),
      t('profile.deleteNotificationConfirm'),
      [
        { text: t('profile.cancel'), style: 'cancel' },
        {
          text: t('profile.delete'),
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
    handleOptionPress(t('profile.addChild'));
  };

  const handleEditChild = (child: Child) => {
    handleOptionPress(`${t('profile.editProfile')} ${child.name}`);
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
              <Text style={ClientProfileScreenStyles.statLabel}>{t('profile.trips')}</Text>
            </View>
            <View style={ClientProfileScreenStyles.statDivider} />
            <View style={ClientProfileScreenStyles.statItem}>
              <Text style={ClientProfileScreenStyles.statValue}>₽12,450</Text>
              <Text style={ClientProfileScreenStyles.statLabel}>{t('profile.spent')}</Text>
            </View>
            <View style={ClientProfileScreenStyles.statDivider} />
            <View style={ClientProfileScreenStyles.statItem}>
              <Text style={ClientProfileScreenStyles.statValue}>4.8</Text>
              <Text style={ClientProfileScreenStyles.statLabel}>{t('profile.rating')}</Text>
            </View>
          </View>
        </AppCard>

        {/* Children Section */}
        <ProfileChildrenSection
          onAddChild={handleAddChild}
          onEditChild={handleEditChild}
        >
          {children}
        </ProfileChildrenSection>

        {/* Settings Section */}
        <AppCard style={ClientProfileScreenStyles.settingsCard} margin={16}>
          <Text style={ClientProfileScreenStyles.sectionTitle}>{t('profile.settings')}</Text>
          
          <View style={ClientProfileScreenStyles.settingItem}>
            <View style={ClientProfileScreenStyles.settingInfo}>
              <Ionicons name="notifications" size={20} color="#007AFF" />
              <Text style={ClientProfileScreenStyles.settingText}>{t('profile.notifications')}</Text>
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
              <Text style={ClientProfileScreenStyles.settingText}>{t('profile.locationEnabled')}</Text>
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
              <Text style={ClientProfileScreenStyles.settingText}>{t('profile.darkTheme')}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E5E7EB', true: '#007AFF' }}
              thumbColor={isDark ? '#FFFFFF' : '#F9FAFB'}
            />
          </View>

          <TouchableOpacity 
            style={ClientProfileScreenStyles.settingItem}
            onPress={handleLanguageSelect}
          >
            <View style={ClientProfileScreenStyles.settingInfo}>
              <Ionicons name="language" size={20} color="#007AFF" />
              <Text style={ClientProfileScreenStyles.settingText}>{t('profile.language')}</Text>
            </View>
            <View style={ClientProfileScreenStyles.settingValue}>
              <Text style={ClientProfileScreenStyles.settingValueText}>
                {languageOptions.find(lang => lang.code === getCurrentLanguage())?.native}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
            </View>
          </TouchableOpacity>
        </AppCard>

        {/* Profile Options */}
        <AppCard style={ClientProfileScreenStyles.optionsCard} margin={16}>
          <ProfileOption
            icon={<Ionicons name="person" size={22} color="#007AFF" />}
            label={t('profile.editProfile')}
            value={t('profile.editProfileDesc')}
            onPress={() => handleOptionPress(t('profile.editProfile'))}
          />
          
          <ProfileOption
            icon={<Ionicons name="card" size={22} color="#007AFF" />}
            label={t('profile.paymentMethods')}
            value={t('profile.paymentMethodsDesc')}
            onPress={() => handleOptionPress(t('profile.paymentMethods'))}
          />
          
          <ProfileOption
            icon={<Ionicons name="shield-checkmark" size={22} color="#007AFF" />}
            label={t('profile.security')}
            value={t('profile.securityDesc')}
            onPress={() => handleOptionPress(t('profile.security'))}
          />
          
          <ProfileOption
            icon={<Ionicons name="help-circle" size={22} color="#007AFF" />}
            label={t('profile.support')}
            value={t('profile.supportDesc')}
            onPress={() => handleOptionPress(t('profile.support'))}
          />
          
          <ProfileOption
            icon={<Ionicons name="information-circle" size={22} color="#007AFF" />}
            label={t('profile.about')}
            value={t('profile.aboutDesc')}
            onPress={() => handleOptionPress(t('profile.about'))}
          />
        </AppCard>

        {/* Logout Button */}
        <TouchableOpacity
          style={ClientProfileScreenStyles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={ClientProfileScreenStyles.logoutText}>{t('profile.logout')}</Text>
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
