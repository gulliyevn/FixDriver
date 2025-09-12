import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/ChatListScreen.styles';

/**
 * Selection Bar Component
 * 
 * Bottom action bar for chat selection mode
 * Provides bulk actions for selected chats
 */

interface SelectionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
  isDark: boolean;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onMarkAsRead,
  onDelete,
  isDark,
}) => {
  const { t } = useI18n();

  const isAllSelected = selectedCount === totalCount;

  return (
    <View style={[styles.actionButtonsContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.selectAllButton]}
          onPress={onSelectAll}
        >
          <Text style={[styles.selectAllButtonText, { color: isDark ? '#fff' : '#000' }]}>
            {isAllSelected ? t('common.deselectAll') : t('common.selectAll')}
          </Text>
        </TouchableOpacity>
        {selectedCount > 0 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Text style={styles.deleteButtonText}>
              {t('common.delete')} ({selectedCount})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
