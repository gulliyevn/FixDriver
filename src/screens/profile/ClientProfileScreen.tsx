import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ClientProfileScreenStyles as styles } from '../../styles/screens/ClientProfileScreen.styles';
import { mockUsers } from '../../mocks/users';
import { ClientScreenProps } from '../../types/navigation';

// TODO: Для подключения бэкенда заменить на:
// import { useProfile } from '../../hooks/useProfile';
// import { useNotifications } from '../../hooks/useNotifications';
// import { useUserStats } from '../../hooks/useUserStats';

const ClientProfileScreen: React.FC<ClientScreenProps<'Profile'>> = ({ navigation }) => {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const [notificationsCount] = useState(Math.floor(Math.random() * 10) + 1); // Случайное количество уведомлений 1-10
  
// TODO: Для бэкенда заменить на:
// const { user, loading: userLoading } = useProfile();
// const { notificationsCount, loading: notificationsLoading } = useNotifications();
// const { userStats, loading: statsLoading } = useUserStats();
  
  const user = mockUsers[0]; // Используем первого клиента из моков

  // Данные из мокдата
  const getUserStats = (userId: string) => {
    return {
      trips: 127,
      spent: '12 450 AZN',
      rating: user.rating,
      balance: '0 AZN',
      address: user.address,
      email: user.email,
      memberSince: new Date(user.createdAt).getFullYear(),
      id: user.id,
      role: user.role,
      avatar: user.avatar,
    };
  };

  const userStats = getUserStats(user.id);

// TODO: Для бэкенда добавить обработку загрузки
// if (userLoading || notificationsLoading || statsLoading) {
//   return <LoadingSpinner />;
// }

// TODO: Для бэкенда добавить обработку ошибок
// if (!user) {
//   return <ErrorDisplay message="Не удалось загрузить профиль" />;
// }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Аватар, имя, телефон, колокол */}
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={styles.avatarIcon.color} />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.profileName}>{user.name} {user.surname}</Text>
          <Text style={styles.profilePhone}>{user.phone}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity style={styles.bell} onPress={() => console.log('Открыть уведомления')}>
          <Ionicons name="notifications-outline" size={24} color={styles.bellIcon.color} />
          {notificationsCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{notificationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* Блок статистики */}
      <View style={styles.statsBox}>
        <View style={styles.statCol}>
          <Text style={styles.statValue}>{userStats.trips}</Text>
          <Text style={styles.statLabel}>{t('client.profile.trips')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statValue}>{userStats.spent}</Text>
          <Text style={styles.statLabel}>{t('client.profile.spent')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statValue}>{userStats.rating}</Text>
          <Text style={styles.statLabel}>{t('client.profile.rating')}</Text>
        </View>
      </View>
      {/* Пункты меню */}
      <TouchableOpacity style={[styles.menuItem, styles.menuItemFirst]} onPress={() => navigation.navigate('Balance')}>
        <Ionicons name="refresh" size={28} color={styles.balanceIcon.color} style={styles.menuIcon} />
        <Text style={styles.menuLabel}>{t('client.profile.balance')}</Text>
        <Text style={styles.menuValue}>{userStats.balance}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Cards')}>
        <Ionicons name="card" size={22} color={styles.menuIconDefault.color} style={styles.menuIcon} />
        <Text style={styles.menuLabel}>{t('client.profile.cards')}</Text>
        <Ionicons name="chevron-forward" size={20} color={styles.chevronIcon.color} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Debts')}>
        <Ionicons name="wallet" size={22} color={styles.menuIconDefault.color} style={styles.menuIcon} />
        <Text style={styles.menuLabel}>{t('client.profile.debts')}</Text>
        <Ionicons name="chevron-forward" size={20} color={styles.chevronIcon.color} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Cars')}>
        <Ionicons name="car" size={22} color={styles.menuIconDefault.color} style={styles.menuIcon} />
        <Text style={styles.menuLabel}>{t('client.profile.cars')}</Text>
        <Ionicons name="chevron-forward" size={20} color={styles.chevronIcon.color} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PaymentHistory')}>
        <Ionicons name="document-text" size={22} color={styles.menuIconDefault.color} style={styles.menuIcon} />
        <Text style={styles.menuLabel}>{t('client.profile.paymentHistory')}</Text>
        <Ionicons name="chevron-forward" size={20} color={styles.chevronIcon.color} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
        <Ionicons name="settings" size={22} color={styles.menuIconDefault.color} style={styles.menuIcon} />
        <Text style={styles.menuLabel}>{t('client.settings')}</Text>
        <Ionicons name="chevron-forward" size={20} color={styles.chevronIcon.color} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Residence')}>
        <Ionicons name="home" size={22} color={styles.menuIconDefault.color} style={styles.menuIcon} />
        <Text style={styles.menuLabel}>{t('client.profile.residence')}</Text>
        <Ionicons name="chevron-forward" size={20} color={styles.chevronIcon.color} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Help')}>
        <Ionicons name="help-circle" size={22} color={styles.menuIconDefault.color} style={styles.menuIcon} />
        <Text style={styles.menuLabel}>{t('client.profile.help')}</Text>
        <Ionicons name="chevron-forward" size={20} color={styles.chevronIcon.color} />
      </TouchableOpacity>
      {/* О приложении */}
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('About')}>
        <Ionicons name="information-circle" size={22} color={styles.menuIconDefault.color} style={styles.menuIcon} />
        <Text style={styles.menuLabelAbout}>{t('client.profile.about')}</Text>
        <Text style={styles.menuVersion}>1.0.0</Text>
      </TouchableOpacity>
      {/* Выйти */}
      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>{t('client.profile.logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ClientProfileScreen;
