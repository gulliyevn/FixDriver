import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import { useI18n } from '../../../../shared/hooks/useI18n';
import { useTheme } from '../../../context/ThemeContext';
import { useProfile } from '../../../../shared/hooks/useProfile';
import { useBalance } from '../../../../shared/hooks/useBalance';
import { formatBalance } from '../../../../shared/utils/formatters';
import { colors } from '../../../../shared/constants/colors';
import { ProfileScreenStyles as styles, getProfileScreenStyles } from './styles/ProfileScreen.styles';

/**
 * Profile Screen
 * 
 * Main profile screen with role-based logic
 * Shows different content for clients and drivers
 */

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const { isDark } = useTheme();
  const currentColors = isDark ? colors.dark : colors.light;
  const dynamicStyles = getProfileScreenStyles(isDark);

  // Profile and balance hooks
  const { profile, loading, error, loadProfile } = useProfile();
  const balanceHook = useBalance();

  // Role detection
  const isDriver = user?.role === 'driver';

  // Reload profile on focus
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  // Get user stats based on role
  const getUserStats = () => {
    if (!profile) return null;
    
    const baseStats = {
      trips: 127,
      rating: profile.rating,
      balance: formatBalance(balanceHook.balance) + ' AFc',
      address: profile.address,
      email: profile.email,
      memberSince: new Date(profile.createdAt).getFullYear(),
      id: profile.id,
      role: profile.role,
      avatar: profile.avatar,
    };

    if (isDriver) {
      return {
        ...baseStats,
        spent: '45 230 AFc', // Earnings for drivers
        label: t('profile.earnings'),
      };
    } else {
      return {
        ...baseStats,
        spent: '12 450 AFc', // Spent for clients
        label: t('profile.spent'),
      };
    }
  };

  const userStats = getUserStats() || {
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
    label: isDriver ? t('profile.earnings') : t('profile.spent'),
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('profile.logout'), 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  // Handle edit profile navigation
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  // Error handling
  if (error || !profile) {
    return (
      <View style={[styles.container, dynamicStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.profileName, dynamicStyles.profileName]}>
          {error || t('profile.failedToLoadProfile')}
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Fixed section with avatar and stats */}
      <View style={[styles.fixedSection, dynamicStyles.fixedSection]}>
        {/* Avatar, name, phone, premium button */}
        <View style={styles.profileRow}>
          <TouchableOpacity style={styles.avatar} onPress={handleEditProfile}>
            {profile?.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={48} color={styles.avatarIcon.color} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileText} onPress={handleEditProfile}>
            <Text style={[styles.profileName, dynamicStyles.profileName]}>
              {profile?.name || ''} {profile?.surname || ''}
            </Text>
            <Text style={[styles.profilePhone, dynamicStyles.profilePhone]}>
              {profile?.phone || ''}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.premiumButtonContainer} 
            onPress={() => navigation.navigate('PremiumPackages')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFFFFF', '#E6F3FF', '#B3D9FF', '#80BFFF', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.premiumButton, dynamicStyles.premiumButton]}
            >
              <Ionicons name="diamond" size={24} color="#0066CC" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Stats block */}
        <View style={[styles.statsBox, dynamicStyles.statsBox]}>
          <View style={styles.statCol}>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>{userStats.trips}</Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
              {t('profile.trips')}
            </Text>
          </View>
          <View style={[styles.statDivider, dynamicStyles.statDivider]} />
          <View style={styles.statCol}>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>{userStats.spent}</Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
              {userStats.label}
            </Text>
          </View>
          <View style={[styles.statDivider, dynamicStyles.statDivider]} />
          <View style={styles.statCol}>
            <Text style={[styles.statValue, dynamicStyles.statValue]}>{userStats.rating}</Text>
            <Text style={[styles.statLabel, dynamicStyles.statLabel]}>
              {t('profile.rating')}
            </Text>
          </View>
        </View>

        {/* Thin line under stats */}
        <View style={[styles.statsDivider, dynamicStyles.statsDivider]} />
      </View>

      {/* Scrollable section with menu */}
      <ScrollView style={[styles.scrollSection, dynamicStyles.scrollSection]} contentContainerStyle={styles.contentContainer}>
        {/* Balance */}
        <TouchableOpacity style={[styles.menuItem, styles.menuItemFirst, dynamicStyles.menuItem, dynamicStyles.menuItemFirst]} onPress={() => navigation.navigate('Balance')}>
          <Ionicons name="refresh" size={28} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('profile.balance')}</Text>
          <Text style={[styles.menuValue, dynamicStyles.menuValue]}>{userStats.balance}</Text>
        </TouchableOpacity>

        {/* Cards */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Cards')}>
          <Ionicons name="card" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('profile.cards')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>

        {/* Trips */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Trips')}>
          <Ionicons name="time" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('profile.trips')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>

        {/* Payment History */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('PaymentHistory')}>
          <Ionicons name="document-text" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('profile.paymentHistory')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('profile.settings')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>

        {/* Role-specific menu items */}
        {!isDriver && (
          <>
            {/* Residence - only for clients */}
            <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Residence')}>
              <Ionicons name="home" size={22} color={currentColors.primary} style={styles.menuIcon} />
              <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('profile.residence')}</Text>
              <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
            </TouchableOpacity>
          </>
        )}

        {isDriver && (
          <>
            {/* Vehicles - only for drivers */}
            <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('DriverVehicles')}>
              <Ionicons name="car" size={22} color={currentColors.primary} style={styles.menuIcon} />
              <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('profile.vehicles')}</Text>
              <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
            </TouchableOpacity>

            {/* Earnings - only for drivers */}
            <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Earnings')}>
              <Ionicons name="trending-up" size={22} color={currentColors.primary} style={styles.menuIcon} />
              <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('profile.earnings')}</Text>
              <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
            </TouchableOpacity>
          </>
        )}

        {/* Help */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('Help')}>
          <Ionicons name="help-circle" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, dynamicStyles.menuLabel]}>{t('profile.help')}</Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </TouchableOpacity>

        {/* About */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={() => navigation.navigate('About')}>
          <Ionicons name="information-circle" size={22} color={currentColors.primary} style={styles.menuIcon} />
          <Text style={[styles.menuLabelAbout, dynamicStyles.menuLabelAbout]}>{t('profile.about')}</Text>
          <Text style={[styles.menuVersion, dynamicStyles.menuVersion]}>1.0.0</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity 
          style={[styles.logout, dynamicStyles.logout]} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;
