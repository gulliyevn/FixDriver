import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/NotificationsScreen.styles';

/**
 * Empty State Component
 * 
 * Shows when there are no notifications
 */

interface EmptyStateProps {
  isDark: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ isDark }) => {
  const { t } = useI18n();

  return (
    <View style={styles.emptyState}>
      <Ionicons 
        name="notifications-off" 
        size={64} 
        color={isDark ? '#6B7280' : '#9CA3AF'} 
      />
      <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>
        {t('notifications.noNotifications')}
      </Text>
      <Text style={[styles.emptyStateSubtext, isDark && styles.emptyStateSubtextDark]}>
        {t('notifications.allNotificationsHere')}
      </Text>
    </View>
  );
};
