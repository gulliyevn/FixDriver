import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ActionButtonsProps } from '../types/Chat';
import { createChatListScreenStyles } from '../styles/ChatListScreen.styles';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectionMode,
  selectedCount,
  totalCount,
  onToggleSelection,
  onSelectAll,
  onDeleteSelected,
  onMarkAsRead
}) => {
  const { isDark } = useTheme();
  const styles = createChatListScreenStyles(isDark);

  if (!selectionMode) {
    return (
      <View style={styles.headerActions}>
        <TouchableOpacity
          accessibilityLabel="Select"
          onPress={onToggleSelection}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={isDark ? '#F9FAFB' : '#111827'}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.actionButtonsContainer}>
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.selectAllButton]}
          onPress={onSelectAll}
        >
          <Text style={styles.selectAllButtonText}>
            {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
        {selectedCount > 0 && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDeleteSelected}
          >
            <Text style={styles.deleteButtonText}>
              Delete ({selectedCount})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ActionButtons;
