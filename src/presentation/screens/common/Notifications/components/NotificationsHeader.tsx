import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/NotificationsScreen.styles';

/**
 * Notifications Header Component
 * 
 * Header with title, actions and selection mode
 */

interface NotificationsHeaderProps {
  isSelectionMode: boolean;
  selectedCount: number;
  totalCount: number;
  unreadCount: number;
  isDark: boolean;
  onCancelSelection: () => void;
  onSelectAll: () => void;
  onMarkAllAsRead: () => void;
  onEnterSelectionMode: () => void;
}

export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  isSelectionMode,
  selectedCount,
  totalCount,
  unreadCount,
  isDark,
  onCancelSelection,
  onSelectAll,
  onMarkAllAsRead,
  onEnterSelectionMode
}) => {
  const { t } = useI18n();

  if (isSelectionMode) {
    return (
      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.selectionHeader} testID="selection-header">
          <TouchableOpacity onPress={onCancelSelection}>
            <Text style={styles.cancelButton}>{t('notifications.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.selectionTitle}>
            {t('notifications.selectedCount')}: {selectedCount}
          </Text>
          <TouchableOpacity onPress={onSelectAll}>
            <Text style={styles.selectAllButton}>
              {selectedCount === totalCount ? t('notifications.unselectAll') : t('notifications.selectAll')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.header, isDark && styles.headerDark]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Ionicons name="notifications" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
            {t('notifications.title')}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={onMarkAllAsRead}
            >
              <Text style={styles.markAllButtonText}>
                {t('notifications.readAll')} ({unreadCount})
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={onEnterSelectionMode}
            testID="select-button"
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
