import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../hooks/useI18n';
import { useTheme } from '../../context/ThemeContext';
import { ClientProfileScreenStyles as styles, getClientProfileStyles } from '../../styles/screens/ClientProfileScreen.styles';
import { mockUsers } from '../../mocks/users';
import { ClientScreenProps } from '../../types/navigation';
import { colors } from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import NotificationsScreen from '../common/NotificationsScreen';
import { useProfile } from '../../hooks/useProfile';

// TODO: Для подключения бэкенда заменить на:
// import { useNotifications } from '../../hooks/useNotifications';
// import { useUserStats } from '../../hooks/useUserStats';

const ClientProfileScreen: React.FC<ClientScreenProps<'ClientProfile'>> = ({ navigation }) => {
  const { logout } = useAuth();
  const { t } = useI18n();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getClientProfileStyles(isDark);
  const [notificationsCount] = useState(Math.floor(Math.random() * 10) + 1); // Случайное количество уведомлений 1-10
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);

  // Используем хук для работы с профилем
  const { profile, loading, error, loadProfile } = useProfile();
  


  // Баланс из AsyncStorage
  const [balance, setBalance] = React.useState<string>('0');
  
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      (async () => {
        const stored = await AsyncStorage.getItem('user_balance');
        if (isActive) {
          setBalance(stored ?? '0');
          // Перезагружаем профиль при фокусе экрана
          loadProfile();
        }
      })();
      return () => { isActive = false; };
    }, []) // Убираем loadProfile из зависимостей
  );
  
// TODO: Для бэкенда заменить на:
// const { user, loading: userLoading } = useProfile();
// const { notificationsCount, loading: notificationsLoading } = useNotifications();
// const { userStats, loading: statsLoading } = useUserStats();
  
  // Данные из мокдата
  const getUserStats = (userId: string) => {
    if (!profile) return null;
    
    return {
      trips: 127,
      spent: '12 450 AFc',
      rating: profile.rating,
      balance: balance + ' AFc',
      address: profile.address,
      email: profile.email,
      memberSince: new Date(profile.createdAt).getFullYear(),
      id: profile.id,
      role: profile.role,
      avatar: profile.avatar,
    };
  };

  const userStats = getUserStats(profile?.id || '') || {
    trips: 0,
    spent: '0 AFc',
    rating: 0,
    balance: '0 AFc',
    address: '',
    email: '',
    memberSince: new Date().getFullYear(),
    id: '',
    role: '',
    avatar: '',
  };

// Обработка загрузки
if (loading) {
  return (
    <View style={[styles.container, dynamicStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={[styles.profileName, dynamicStyles.profileName]}>{t('profile.loadingProfile')}</Text>
    </View>
  );
}

// Обработка ошибок
if (error || !profile) {
  return (
    <View style={[styles.container, dynamicStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={[styles.profileName, dynamicStyles.profileName]}>{error || t('profile.failedToLoadProfile')}</Text>
    </View>
  );
}

  return (
    <>
      {/* Фиксированная секция с аватаром и статистикой */}
      <View style={[styles.fixedSection, dynamicStyles.fixedSection]}>
        {/* Аватар, имя, телефон, колокол */}
        <View style={styles.profileRow}>
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('EditClientProfile')}>
            <Ionicons name="person" size={48} color={styles.avatarIcon.color} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileText} onPress={() => navigation.navigate('EditClientProfile')}>
            <Text style={[styles.profileName, dynamicStyles.profileName]}>{profile?.name || ''} {profile?.surname || ''}</Text>
            <Text style={[styles.profilePhone, dynamicStyles.profilePhone]}>{profile?.phone || ''}</Text>
            <Text style={[styles.profileEmail, dynamicStyles.profileEmail]}>{profile?.email || ''}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bell, dynamicStyles.bell]} onPress={() => setNotificationsModalVisible(true)}>
            <Ionicons name="notifications-outline" size={24} color={currentColors.primary} />
            {notificationsCount > 0 && (
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>{notificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* Блок статистики */}
        <View style={[styles.statsBox, dynamicStyles.statsBox]}>
          <View style={styles.statCol}>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>{userStats.trips}</Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{t('client.profile.trips')}</Text>
          </View>
          <View style={[styles.statDivider, dynamicStyles.statDivider]} />
          <View style={styles.statCol}>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>{userStats.spent}</Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{t('client.profile.spent')}</Text>
          </View>
          <View style={[styles.statDivider, dynamicStyles.statDivider]} />
          <View style={styles.statCol}>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>{userStats.rating}</Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{t('client.profile.rating')}</Text>
          </View>
        </View>
        {/* Тонкая линия под статистикой */}
        <View style={[styles.statsDivider, dynamicStyles.statsDivider]} />
      </View>

      {/* Скроллируемая секция с меню */}
      <ScrollView style={[styles.scrollSection, dynamicStyles.scrollSection]} contentContainerStyle={styles.contentContainer}>
        {/* Пункты меню */}
        <TouchableOpacity style={[styles.menuItem, styles.menuItemFirst, dynamicStyles.menuItem, dynamicStyles.menuItemFirst]} onPress={() => navigation.navigate('Balance')}>
          <Ionicons name="refresh" size={28} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('client.profile.balance')}</Text>
          <Text style={[styles.menuValue, dynamicStyles.menuValue]}>{userStats.balance}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Cards')}>
          <Ionicons name="card" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('client.profile.cards')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Trips')}>
          <Ionicons name="time" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('client.profile.trips')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('PaymentHistory')}>
          <Ionicons name="document-text" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('client.profile.paymentHistory')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('client.settings')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Residence')}>
          <Ionicons name="home" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('client.profile.residence')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Help')}>
          <Ionicons name="help-circle" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('client.profile.help')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>
        {/* О приложении */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('About')}>
          <Ionicons name="information-circle" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabelAbout, dynamicStyles.menuLabelAbout]}>{t('client.profile.about')}</Text>
          <Text style={[styles.menuVersion, dynamicStyles.menuVersion]}>1.0.0</Text>
        </TouchableOpacity>
        {/* Выйти */}
        <TouchableOpacity 
          style={[styles.logout, dynamicStyles.logout]} 
          onPress={() => {
            Alert.alert(
              t('client.profile.logout'),
              t('client.profile.logoutConfirm'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                { 
                  text: t('client.profile.logout'), 
                  style: 'destructive',
                  onPress: logout
                }
              ]
            );
          }}
        >
          <Text style={styles.logoutText}>{t('client.profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Модальное окно уведомлений */}
      <Modal
        visible={notificationsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setNotificationsModalVisible(false)}
      >
        <NotificationsScreen />
      </Modal>
    </>
  );
};

export default ClientProfileScreen;
