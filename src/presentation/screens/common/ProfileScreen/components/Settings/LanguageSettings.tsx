/**
 * LanguageSettings component
 * Language selection settings
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

interface LanguageSettingsProps {
  onLanguageChange: () => void;
}

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({ onLanguageChange }) => {
  const { isDark } = useTheme();
  const { t, language, languageOptions } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        {t('settings.language.section')}
      </Text>
      
      <TouchableOpacity 
        style={[styles.settingItem, { backgroundColor: currentColors.surface }]} 
        onPress={onLanguageChange}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="language" size={24} color={currentColors.primary} />
          <Text style={[styles.settingLabel, { color: currentColors.text }]}>
            {t('settings.language.current')}
          </Text>
        </View>
        <View style={styles.languageValue}>
          <Text style={[styles.settingLabel, { color: currentColors.textSecondary, fontWeight: '600' }]}>
            {currentLanguage?.flag} {currentLanguage?.name}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};
