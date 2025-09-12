import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/NotificationsScreen.styles';

/**
 * Selection Bar Component
 * 
 * Action bar for selected notifications
 */

interface SelectionBarProps {
  selectedCount: number;
  isDark: boolean;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  isDark,
  onMarkAsRead,
  onDelete
}) => {
  const { t } = useI18n();

  return (
    <View style={styles.selectionActions}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={onMarkAsRead}
      >
        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        <Text style={styles.actionButtonText}>{t('notifications.markRead')}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.deleteActionButton]}
        onPress={onDelete}
      >
        <Ionicons name="trash" size={20} color="#EF4444" />
        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
          {t('notifications.delete')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
