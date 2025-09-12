/**
 * EmptyState component for OrdersList
 * Displays empty state, loading, or error states
 */

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { OrdersScreenStyles as styles } from '../../styles/OrdersScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface EmptyStateProps {
  loading: boolean;
  error: string | null;
  isDriver: boolean;
  onRetry: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  loading,
  error,
  isDriver,
  onRetry
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  if (loading) {
    return (
      <View style={[styles.emptyState, { backgroundColor: currentColors.background }]}>
        <ActivityIndicator size="large" color={currentColors.primary} />
        <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
          {t('orders.loading')}
        </Text>
        <Text style={[styles.emptyDescription, { color: currentColors.textSecondary }]}>
          {t('orders.loadingDescription')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.emptyState, { backgroundColor: currentColors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={currentColors.error} />
        <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
          {t('orders.error')}
        </Text>
        <Text style={[styles.emptyDescription, { color: currentColors.textSecondary }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: currentColors.primary }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryButtonText, { color: currentColors.surface }]}>
            {t('orders.retry')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.emptyState, { backgroundColor: currentColors.background }]}>
      <Ionicons 
        name={isDriver ? "people-outline" : "car-outline"} 
        size={64} 
        color={currentColors.textSecondary} 
      />
      <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
        {isDriver ? t('orders.emptyTitleForDriver') : t('orders.emptyTitle')}
      </Text>
      <Text style={[styles.emptyDescription, { color: currentColors.textSecondary }]}>
        {isDriver ? t('orders.emptyDescriptionForDriver') : t('orders.emptyDescription')}
      </Text>
    </View>
  );
};
