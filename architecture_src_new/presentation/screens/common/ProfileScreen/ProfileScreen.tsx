import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import { Bell, Wallet, CreditCard, Clock, FileText, Settings, Home, HelpCircle, Info, Car, ChevronRight, Loader2, User, LogOut } from 'lucide-react-native';
import { useTheme } from '../../../../core/context/ThemeContext';
import { useAuth } from '../../../../core/context/AuthContext';
import { useI18n } from '../../../../shared/i18n';
import { createProfileScreenStyles } from './styles/ProfileScreen.styles';
import NotificationsModal from '../../../components/notifications/NotificationsModal';

export interface ProfileScreenProps {
  onLogout?: () => void;
}

type ActiveScreen = 'main' | 'trips' | 'residence' | 'help' | 'about';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { isDark, colors } = useTheme();
  const { user, logout, isLoading } = useAuth();
  const { t } = useI18n();
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('main');
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const styles = createProfileScreenStyles(isDark);

  // Debug user data
  console.log('👤 ProfileScreen user data:', {
    id: user?.id,
    name: user?.name,
    surname: user?.surname,
    email: user?.email,
    phone: user?.phone,
    role: user?.role
  });

  // Determine user role
  const isDriver = user?.role === 'driver';

  // Handle scroll position
  const handleScroll = (event: any) => {
    // ScrollView will maintain position automatically with maintainVisibleContentPosition
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      t('profile.logout.title'),
      t('profile.logout.message'),
      [
        { text: t('common.buttons.cancel'), style: 'cancel' },
        { 
          text: t('profile.logout.confirm'), 
          style: 'destructive',
          onPress: () => {
            logout();
            onLogout?.();
          }
        }
      ]
    );
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Loader2 size={80} color={colors.textSecondary} />
          <Text style={styles.loginPromptText}>
            {t('common.loading')}
          </Text>
        </View>
      </View>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <User size={80} color={colors.textSecondary} />
          <Text style={styles.loginPromptText}>
            {t('profile.loginRequired')}
          </Text>
        </View>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeScreen) {
      case 'main':
        return (
          <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
            {/* Profile Header */}
            <View style={styles.profileRow}>
              <TouchableOpacity style={styles.avatar}>
                {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                ) : (
                  <User size={32} color={colors.card} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileText}>
                <Text style={styles.profileName}>
                  {(user as any)?.name || (user as any)?.firstName || ''} {(user as any)?.surname || (user as any)?.lastName || ''}
                </Text>
                <Text style={styles.profilePhone}>
                  {user?.phone || ''}
                </Text>
                <Text style={styles.profileEmail}>
                  {user?.email || ''}
                </Text>
              </TouchableOpacity>
            </View>


            {/* Notification Bell */}
            <TouchableOpacity 
              style={styles.bell}
              onPress={() => setIsNotificationsModalVisible(true)}
            >
              <Bell size={20} color={colors.primary} />
              <View style={styles.bellBadge}>
                <Text style={styles.bellBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            {/* Stats Box */}
            <View style={styles.statsBox}>
              <View style={styles.statCol}>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>{t('profile.menu.trips')}</Text>
              </View>
              <View style={styles.statsDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statValue}>4.8</Text>
                <Text style={styles.statLabel}>{t('profile.menu.rating')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statCol}>
                <Text style={styles.statValue}>$125</Text>
                <Text style={styles.statLabel}>{t('profile.menu.balance')}</Text>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menu}>
              {/* Balance */}
              <TouchableOpacity style={[styles.menuItem, styles.menuItemFirst]}>
                <Wallet size={28} color={colors.primary} style={styles.balanceIcon} />
                <Text style={styles.menuLabel}>{t('profile.menu.balance')}</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Cards */}
              <TouchableOpacity style={styles.menuItem}>
                <CreditCard size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.cards')}</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Trips */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('trips')}>
                <Clock size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.trips')}</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Payment History */}
              <TouchableOpacity style={styles.menuItem}>
                <FileText size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.paymentHistory')}</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Settings */}
              <TouchableOpacity style={styles.menuItem}>
                <Settings size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.settings')}</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Residence */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('residence')}>
                <Home size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.residence')}</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Help */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('help')}>
                <HelpCircle size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.help')}</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* About */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('about')}>
                <Info size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.about')}</Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Driver specific - Vehicles */}
              {isDriver && (
                <TouchableOpacity style={styles.menuItem}>
                  <Car size={22} color={colors.primary} style={styles.menuIconDefault} />
                  <Text style={styles.menuLabel}>{t('profile.menu.vehicles')}</Text>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logout} 
              onPress={handleLogout}
            >
              <LogOut 
                size={20} 
                color={colors.card}
              />
              <Text style={styles.logoutText}>{t('profile.logout.title')}</Text>
            </TouchableOpacity>
          </ScrollView>
        );
        
      case 'trips':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {t('profile.menu.trips')}
              </Text>
              <Text style={styles.subtitle}>
                История поездок
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.placeholder}>
                Здесь будет история ваших поездок
              </Text>
            </View>
          </ScrollView>
        );
        
      case 'residence':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {t('profile.menu.residence')}
              </Text>
              <Text style={styles.subtitle}>
                Управление адресом
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.placeholder}>
                Здесь можно изменить адрес
              </Text>
            </View>
          </ScrollView>
        );
        
      case 'help':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {t('profile.menu.help')}
              </Text>
              <Text style={styles.subtitle}>
                Центр поддержки
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.placeholder}>
                Здесь будет справочная информация
              </Text>
            </View>
          </ScrollView>
        );
        
      case 'about':
        return (
          <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {t('profile.menu.about')}
              </Text>
              <Text style={styles.subtitle}>
                Информация о приложении
              </Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.placeholder}>
                Здесь будет информация о приложении
              </Text>
            </View>
          </ScrollView>
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {renderContent()}
      </ScrollView>
      
      {/* Back button for sub-screens */}
      {activeScreen !== 'main' && (
        <View style={styles.backButton} onTouchEnd={() => setActiveScreen('main')}>
          <Text style={styles.backButtonText}>
            {t('common.back')}
          </Text>
        </View>
      )}

      {/* Notifications Modal */}
      <NotificationsModal
        visible={isNotificationsModalVisible}
        onClose={() => setIsNotificationsModalVisible(false)}
      />
    </View>
  );
};


export default ProfileScreen;
