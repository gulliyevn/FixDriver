import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { DriverProfileScreenStyles as styles, getDriverProfileStyles } from '../../styles/screens/DriverProfileScreen.styles';
import { mockUsers, mockDrivers } from '../../mocks/users';
import { ClientScreenProps } from '../../types/navigation';
import { colors } from '../../constants/colors';
import { Driver } from '../../types/user';

// TODO: Для подключения бэкенда заменить на:
// import { useProfile } from '../../hooks/useProfile';
// import { useNotifications } from '../../hooks/useNotifications';
// import { useDriverStats } from '../../hooks/useDriverStats';

const DriverProfileScreen: React.FC<ClientScreenProps<'DriverProfile'>> = ({ navigation }) => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getDriverProfileStyles(isDark);
  const [notificationsCount] = useState(Math.floor(Math.random() * 10) + 1); // Случайное количество уведомлений 1-10
  
// TODO: Для бэкенда заменить на:
// const { user, loading: userLoading } = useProfile();
// const { notificationsCount, loading: notificationsLoading } = useNotifications();
// const { driverStats, loading: statsLoading } = useDriverStats();
  
  const driver = mockDrivers[0] || mockDrivers[1]; // Используем водителя из моков
  const user = mockUsers[0]; // Используем клиента для базовой информации
  
  // Проверяем, что у нас есть водитель
  if (!driver) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <Text style={[styles.profileName, dynamicStyles.profileName]}>Нет данных водителя</Text>
      </View>
    );
  }

  // Данные из мокдата
  const getDriverStats = (driverId: string) => {
    return {
      trips: 89,
      earnings: '8 750 AFc',
      rating: driver.rating,
      balance: '1 250 AFc',
      address: 'ул. Низами, 23, Баку', // Заглушка
      email: driver.email,
      memberSince: new Date(driver.created_at).getFullYear(),
      id: driver.id,
      role: 'driver',
      avatar: driver.avatar,
      car: `${driver.vehicle_brand || 'Toyota'} ${driver.vehicle_model || 'Camry'} ${driver.vehicle_year || '2020'}`,
      isAvailable: driver.isAvailable || true,
    };
  };

  const driverStats = getDriverStats(driver.id);

// TODO: Для бэкенда добавить обработку загрузки
// if (userLoading || notificationsLoading || statsLoading) {
//   return <LoadingSpinner />;
// }

// TODO: Для бэкенда добавить обработку ошибок
// if (!user) {
//   return <ErrorDisplay message="Не удалось загрузить профиль" />;
// }

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.contentContainer}>
      {/* Аватар, имя, телефон, колокол */}
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={styles.avatarIcon.color} />
        </View>
        <View style={styles.profileText}>
          <Text style={[styles.profileName, dynamicStyles.profileName]}>{driver.first_name} {driver.last_name}</Text>
          <Text style={[styles.profilePhone, dynamicStyles.profilePhone]}>{driver.phone_number}</Text>
          <Text style={[styles.profileEmail, dynamicStyles.profileEmail]}>{driver.email}</Text>
          <Text style={[styles.profileCar, dynamicStyles.profileCar]}>{driverStats.car}</Text>
        </View>
        <TouchableOpacity style={[styles.bell, dynamicStyles.bell]} onPress={() => {}}>
          <Ionicons name="notifications-outline" size={24} color={currentColors.primary} />
          {notificationsCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{notificationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Статус доступности */}
      <View style={[styles.statusBox, dynamicStyles.statusBox]}>
        <View style={[styles.statusIndicator, { backgroundColor: driverStats.isAvailable ? '#4CAF50' : '#F44336' }]} />
        <Text style={[styles.statusText, dynamicStyles.statusText]}>
          {driverStats.isAvailable ? t('driver.status.online') : t('driver.status.offline')}
        </Text>
      </View>
      
      {/* Блок статистики */}
      <View style={[styles.statsBox, dynamicStyles.statsBox]}>
        <View style={styles.statCol}>
          <Text style={[styles.statValue, dynamicStyles.statValue]}>{driverStats.trips}</Text>
          <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{t('driver.orders.title')}</Text>
        </View>
        <View style={[styles.statDivider, dynamicStyles.statDivider]} />
        <View style={styles.statCol}>
          <Text style={[styles.statValue, dynamicStyles.statValue]}>{driverStats.earnings}</Text>
          <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{t('driver.earnings.title')}</Text>
        </View>
        <View style={[styles.statDivider, dynamicStyles.statDivider]} />
        <View style={styles.statCol}>
          <Text style={[styles.statValue, dynamicStyles.statValue]}>{driverStats.rating}</Text>
          <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{t('driver.profile.ratings')}</Text>
        </View>
      </View>
      
      {/* Пункты меню */}
      <TouchableOpacity style={[styles.menuItem, styles.menuItemFirst, dynamicStyles.menuItem, dynamicStyles.menuItemFirst]} onPress={() => {}}>
        <Ionicons name="refresh" size={28} color={currentColors.primary} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('driver.earnings.title')}</Text>
        <Text style={[styles.menuValue, dynamicStyles.menuValue]}>{driverStats.balance}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => {}}>
        <Ionicons name="list" size={22} color={currentColors.primary} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('driver.orders.title')}</Text>
        <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => {}}>
        <Ionicons name="calendar" size={22} color={currentColors.primary} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('driver.schedule.title')}</Text>
        <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => {}}>
        <Ionicons name="car" size={22} color={currentColors.primary} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('driver.profile.vehicleInfo')}</Text>
        <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => {}}>
        <Ionicons name="document-text" size={22} color={currentColors.primary} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('driver.profile.documents')}</Text>
        <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => {}}>
        <Ionicons name="settings" size={22} color={currentColors.primary} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('driver.settings')}</Text>
        <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => {}}>
        <Ionicons name="help-circle" size={22} color={currentColors.primary} style={styles.menuIcon} />
        <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('driver.profile.title')}</Text>
        <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
      </TouchableOpacity>
      
      {/* О приложении */}
      <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => {}}>
        <Ionicons name="information-circle" size={22} color={currentColors.primary} style={styles.menuIcon} />
        <Text style={[styles.menuLabelAbout, dynamicStyles.menuLabelAbout]}>{t('driver.profile.title')}</Text>
        <Text style={[styles.menuVersion, dynamicStyles.menuVersion]}>1.0.0</Text>
      </TouchableOpacity>
      
      {/* Выйти */}
      <TouchableOpacity style={[styles.logout, dynamicStyles.logout]} onPress={logout}>
        <Text style={styles.logoutText}>{t('driver.chat.logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DriverProfileScreen;
