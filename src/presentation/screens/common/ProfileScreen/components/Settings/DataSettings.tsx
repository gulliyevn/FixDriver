/**
 * DataSettings component
 * Data management and account deletion
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../context/AuthContext';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

interface DataSettingsProps {
  navigation: any;
  isDriver: boolean;
}

export const DataSettings: React.FC<DataSettingsProps> = ({ navigation, isDriver }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { logout } = useAuth();
  const currentColors = isDark ? darkColors : lightColors;

  const handleDeleteAccount = () => {
    Alert.alert(
      t('settings.data.deleteAccount'),
      t('settings.data.deleteAccountConfirm'),
      [
        { text: t('settings.cancel'), style: 'cancel' },
        { 
          text: t('settings.data.deleteAccount'), 
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // const result = isDriver 
              //   ? await DriverProfileService.deleteAccount()
              //   : await ProfileService.deleteAccount();
              
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert(
                t('settings.data.deleteAccountSuccess'),
                t('settings.data.deleteAccountSuccessMessage'),
                [
                  {
                    text: t('settings.ok'),
                    onPress: async () => {
                      await logout();
                      navigation.navigate('Auth', { screen: 'Login' });
                    }
                  }
                ]
              );
            } catch (error) {
              Alert.alert(
                t('settings.error'),
                t('settings.data.deleteAccountError'),
                [{ text: t('settings.ok') }]
              );
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        {t('settings.data.title')}
      </Text>
      
      <TouchableOpacity 
        style={[styles.settingItem, { backgroundColor: currentColors.surface }]}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        onPress={handleDeleteAccount}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="trash" size={24} color={currentColors.error} />
          <Text style={[styles.settingLabel, { color: currentColors.error }]}>
            {t('settings.data.deleteAccount')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};
