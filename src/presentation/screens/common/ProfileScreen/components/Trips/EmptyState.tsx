/**
 * EmptyState component
 * Displays empty state, loading, or error states
 */

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { TripsScreenStyles as styles } from '../../styles/TripsScreen.styles';
import { lightColors, darkColors } from '../../../../../../shared/constants/colors';

interface EmptyStateProps {
  type: 'empty' | 'loading' | 'error';
  isDriver?: boolean;
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  isDriver = false, 
  onRetry 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  const getEmptyStateContent = () => {
    switch (type) {
      case 'loading':
        return {
          icon: null,
          title: t('trips.loading'),
          description: t('trips.loadingDescription'),
          showRetry: false
        };
      
      case 'error':
        return {
          icon: 'alert-circle-outline',
          title: t('trips.error'),
          description: t('trips.errorDescription'),
          showRetry: true
        };
      
      case 'empty':
      default:
        return {
          icon: 'car-outline',
          title: isDriver ? t('trips.emptyTitleForDriver') : t('trips.emptyTitle'),
          description: isDriver ? t('trips.emptyDescriptionForDriver') : t('trips.emptyDescription'),
          showRetry: false
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <View style={[styles.emptyState, { backgroundColor: currentColors.background }]}>
      {type === 'loading' ? (
        <ActivityIndicator size="large" color={currentColors.primary} />
      ) : (
        <Ionicons 
          name={content.icon as any} 
          size={64} 
          color={currentColors.textSecondary} 
        />
      )}
      
      <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
        {content.title}
      </Text>
      
      <Text style={[styles.emptyDescription, { color: currentColors.textSecondary }]}>
        {content.description}
      </Text>
      
      {content.showRetry && onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: currentColors.primary }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryButtonText, { color: currentColors.surface }]}>
            {t('trips.retry')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
