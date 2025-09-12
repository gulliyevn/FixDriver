/**
 * EmptyState component
 * Empty, loading, or error states for payment history
 */

import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { PaymentHistoryScreenStyles as styles } from '../styles/PaymentHistoryScreen.styles';

interface EmptyStateProps {
  type: 'loading' | 'error' | 'empty';
  title: string;
  description: string;
  colors: any;
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  colors,
  onRetry
}) => {
  const { t } = useLanguage();

  if (type === 'loading') {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          {t('paymentHistory.loading')}
        </Text>
        <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
          {t('paymentHistory.loadingDescription')}
        </Text>
      </View>
    );
  }

  if (type === 'error') {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          {t('paymentHistory.error')}
        </Text>
        <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
        {onRetry && (
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={onRetry}
          >
            <Text style={[styles.retryButtonText, { color: '#FFFFFF' }]}>
              {t('paymentHistory.retry')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.emptyState, { backgroundColor: colors.background }]}>
      <Ionicons name="document-outline" size={64} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
};
