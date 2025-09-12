/**
 * LocationSettings component
 * Location and GPS settings
 */

import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

export const LocationSettings: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [autoLocation, setAutoLocation] = useState(true);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        {t('settings.location.title')}
      </Text>
      
      <View style={[styles.settingItem, { backgroundColor: currentColors.surface }]}>
        <View style={styles.settingInfo}>
          <Ionicons name="location" size={24} color={currentColors.primary} />
          <Text style={[styles.settingLabel, { color: currentColors.text }]}>
            {t('settings.location.autoLocation')}
          </Text>
        </View>
        <Switch value={autoLocation} onValueChange={setAutoLocation} />
      </View>
    </View>
  );
};
