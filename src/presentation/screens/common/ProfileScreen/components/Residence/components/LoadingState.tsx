import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../../../../../../context/ThemeContext';
import { useI18n } from '../../../../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ResidenceScreen.styles';

/**
 * Loading State Component
 * 
 * Displays loading indicator while fetching addresses
 * Shows loading message to user
 */

export const LoadingState: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.emptyState}>
      <ActivityIndicator size="large" color="#003366" />
      <Text style={[styles.emptyStateText, { color: isDark ? '#ccc' : '#666' }]}>
        {t('residence.loading')}
      </Text>
    </View>
  );
};
