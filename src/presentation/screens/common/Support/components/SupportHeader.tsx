import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/SupportChatScreen.styles';

/**
 * Support Header Component
 * 
 * Header with back button, title, status and close button
 */

interface SupportHeaderProps {
  title: string;
  isDark: boolean;
  onBack: () => void;
  onClose: () => void;
}

export const SupportHeader: React.FC<SupportHeaderProps> = ({
  title,
  isDark,
  onBack,
  onClose
}) => {
  const { t } = useI18n();

  return (
    <View style={[styles.header, isDark && styles.headerDark]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
      </TouchableOpacity>
      
      <View style={styles.headerInfo}>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          {title}
        </Text>
        <View style={styles.statusContainer}>
          <View style={styles.onlineIndicator} />
          <Text style={[styles.statusText, isDark && styles.statusTextDark]}>
            {t('support.online')}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
      </TouchableOpacity>
    </View>
  );
};
