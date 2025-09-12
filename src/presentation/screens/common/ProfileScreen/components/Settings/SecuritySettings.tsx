/**
 * SecuritySettings component
 * Security and password settings
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { ChangePasswordModal } from './ChangePasswordModal';
import { SettingsScreenStyles as styles } from '../styles/SettingsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

interface SecuritySettingsProps {
  navigation: any;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;
  
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
        {t('settings.security.title')}
      </Text>
      
      <TouchableOpacity 
        style={[styles.settingItem, { backgroundColor: currentColors.surface }]}
        onPress={() => setChangePasswordModalVisible(true)}
      >
        <View style={styles.settingInfo}>
          <Ionicons name="lock-closed" size={24} color={currentColors.primary} />
          <Text style={[styles.settingLabel, { color: currentColors.text }]}>
            {t('settings.security.changePassword')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={currentColors.textSecondary} />
      </TouchableOpacity>

      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
      />
    </View>
  );
};
