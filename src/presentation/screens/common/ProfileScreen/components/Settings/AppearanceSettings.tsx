/**
 * AppearanceSettings component
 * Appearance and theme settings
 */

import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

export const AppearanceSettings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        {t('settings.appearance.title')}
      </Text>
      
      <View style={[styles.settingItem, { backgroundColor: currentColors.surface }]}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon" size={24} color={currentColors.primary} />
          <Text style={[styles.settingLabel, { color: currentColors.text }]}>
            {t('settings.appearance.darkMode')}
          </Text>
        </View>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>
    </View>
  );
};
