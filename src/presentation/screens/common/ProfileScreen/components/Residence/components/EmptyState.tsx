import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../../../context/ThemeContext';
import { useI18n } from '../../../../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ResidenceScreen.styles';

/**
 * Empty State Component
 * 
 * Displays when no addresses are available
 * Shows helpful message and icon
 */

export const EmptyState: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.emptyState}>
      <Ionicons name="location-outline" size={64} color="#ccc" />
      <Text style={[styles.emptyStateText, { color: isDark ? '#ccc' : '#666' }]}>
        {t('residence.emptyState')}
      </Text>
    </View>
  );
};
