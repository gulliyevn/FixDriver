/**
 * NotificationSettings component
 * Settings for push notifications
 */

import React from 'react';
import { View, Text, Switch, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useNotifications } from '../../../../../../shared/hooks/useNotifications';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

export const NotificationSettings: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const {
    settings: notificationSettings,
    permissions,
    isLoading: notificationsLoading,
    togglePushNotifications,
    requestPermissions,
  } = useNotifications();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        {t('settings.notifications.title')}
      </Text>
      
      {notificationsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={currentColors.primary} />
          <Text style={[styles.loadingText, { color: currentColors.textSecondary }]}>
            {t('settings.notifications.loading')}
          </Text>
        </View>
      ) : (
        <>
          <View style={[styles.settingItem, { backgroundColor: currentColors.surface }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={24} color={currentColors.primary} />
              <Text style={[styles.settingLabel, { color: currentColors.text }]}>
                {t('settings.notifications.push')}
              </Text>
            </View>
            <Switch 
              value={notificationSettings.pushEnabled} 
              onValueChange={togglePushNotifications}
            />
          </View>
          
          {!permissions.granted && (
            <TouchableOpacity 
              style={[styles.permissionButton, { backgroundColor: currentColors.primary }]}
              onPress={requestPermissions}
            >
              <Text style={styles.permissionButtonText}>
                {t('settings.notifications.requestPermission')}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};
