import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../../../../context/ThemeContext';
import { useI18n } from '../../../../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ResidenceScreen.styles';

/**
 * Error State Component
 * 
 * Displays error message with retry option
 * Handles error recovery actions
 */

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();

  return (
    <View style={styles.emptyState}>
      <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
      <Text style={[styles.emptyStateText, { color: isDark ? '#ccc' : '#666' }]}>
        {error}
      </Text>
      <TouchableOpacity 
        style={styles.retryButton}
        onPress={onRetry}
      >
        <Text style={styles.retryButtonText}>{t('residence.retry')}</Text>
      </TouchableOpacity>
    </View>
  );
};
