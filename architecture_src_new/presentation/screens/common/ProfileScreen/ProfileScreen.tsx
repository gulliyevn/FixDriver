import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Bell, Wallet, CreditCard, Clock, FileText, Settings, Home, HelpCircle, Info, Car, ChevronRight, Loader, UserIcon, TrendingUp, Crown } from '../../../../shared/components/IconLibrary';
import { StatisticsScreen } from './components/StatisticsScreen';
import TripsScreen from './components/TripsScreen';
import PaymentHistoryScreen from './components/PaymentHistoryScreen';
import ResidenceScreen from './components/ResidenceScreen';
import HelpScreen from './components/HelpScreen';
import AboutScreen from './components/AboutScreen';
import SettingsScreen from './components/SettingsScreen';
import CardsScreen from './components/CardsScreen';
import VipScreen from './components/VipScreen';
import EditProfileScreen from './components/EditProfileScreen';
import BalanceScreen from './components/BalanceScreen';
import { useTheme } from '../../../../core/context/ThemeContext';
import { useAuth } from '../../../../core/context/AuthContext';
import { useI18n } from '../../../../shared/i18n';
import { createProfileScreenStyles } from './styles/ProfileScreen.styles';
import NotificationsModal from '../../../components/notifications/NotificationsModal';
import Button from '../../../components/ui/Button';

export interface ProfileScreenProps {
  onLogout?: () => void;
  onSubScreenChange?: (isSubScreen: boolean) => void;
}

type ActiveScreen = 'main' | 'statistics' | 'trips' | 'paymentHistory' | 'residence' | 'help' | 'about' | 'settings' | 'cards' | 'balance' | 'vip' | 'editProfile';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, onSubScreenChange }) => {
  const { isDark, colors } = useTheme();
  const { user, logout, isLoading } = useAuth();
  const { t } = useI18n();
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('main');
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Notify parent about sub-screen changes
  useEffect(() => {
    const isSubScreen = activeScreen !== 'main';
    onSubScreenChange?.(isSubScreen);
  }, [activeScreen, onSubScreenChange]);
  
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

  // Handle logout with Alert
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
          <Loader size={80} color={colors.textSecondary} />
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
          <UserIcon size={80} color={colors.textSecondary} />
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
                  <UserIcon size={32} color={colors.card} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.profileText}
                onPress={() => setActiveScreen('editProfile')}
              >
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


            {/* Menu Items */}
            <View style={styles.menu}>
              {/* Balance */}
              <TouchableOpacity 
                style={[styles.menuItem, styles.menuItemFirst]}
                onPress={() => setActiveScreen('balance')}
              >
                <Wallet size={22} color={colors.primary} style={styles.balanceIcon} />
                <Text style={styles.menuLabel}>{t('profile.menu.balance')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Cards */}
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setActiveScreen('cards')}
              >
                <CreditCard size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.cards')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Premium */}
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setActiveScreen('vip')}
              >
                <Crown size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.premium')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Statistics */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('statistics')}>
                <TrendingUp size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.statistics')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Trips */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('trips')}>
                <Clock size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.trips')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Payment History */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('paymentHistory')}>
                <FileText size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.paymentHistory')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Settings */}
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => setActiveScreen('settings')}
              >
                <Settings size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.settings')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Residence */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('residence')}>
                <Home size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.residence')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Help */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('help')}>
                <HelpCircle size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.help')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* About */}
              <TouchableOpacity style={styles.menuItem} onPress={() => setActiveScreen('about')}>
                <Info size={22} color={colors.primary} style={styles.menuIconDefault} />
                <Text style={styles.menuLabel}>{t('profile.menu.about')}</Text>
                <ChevronRight size={20} color={colors.primary} />
              </TouchableOpacity>

              {/* Driver specific - Vehicles */}
              {isDriver && (
                <TouchableOpacity style={styles.menuItem}>
                  <Car size={22} color={colors.primary} style={styles.menuIconDefault} />
                  <Text style={styles.menuLabel}>{t('profile.menu.vehicles')}</Text>
                  <ChevronRight size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Logout Button */}
            <View style={styles.logoutContainer}>
              <Button
                title={t('profile.logout.title')}
                onPress={handleLogout}
                variant="primary"
                size="medium"
                icon="log-out-outline"
                iconPosition="left"
                fullWidth
              />
            </View>

          </ScrollView>
        );
        
      case 'statistics':
        return (
          <StatisticsScreen />
        );
        
      case 'trips':
        return (
          <TripsScreen onBack={() => setActiveScreen('main')} />
        );
        
      case 'paymentHistory':
        return (
          <PaymentHistoryScreen onBack={() => setActiveScreen('main')} />
        );
        
      case 'residence':
        return (
          <ResidenceScreen onBack={() => setActiveScreen('main')} />
        );
        
      case 'help':
        return (
          <HelpScreen onBack={() => setActiveScreen('main')} />
        );
        
      case 'about':
        return (
          <AboutScreen onBack={() => setActiveScreen('main')} />
        );
        
      case 'settings':
        return (
          <SettingsScreen onBack={() => setActiveScreen('main')} />
        );
        
      case 'cards':
        return (
          <CardsScreen onBack={() => setActiveScreen('main')} />
        );
        
      case 'vip':
        return (
          <VipScreen onBack={() => setActiveScreen('main')} />
        );
        
      case 'balance':
        return (
          <BalanceScreen onBack={() => setActiveScreen('main')} />
        );
        
      case 'editProfile':
        return (
          <EditProfileScreen onBack={() => setActiveScreen('main')} />
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
