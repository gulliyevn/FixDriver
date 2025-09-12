/**
 * SelectionBar component
 * Bottom bar for multi-selection actions
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { OrdersScreenStyles as styles } from '../../styles/OrdersScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface SelectionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onBook: () => void;
  onDelete: () => void;
  onCancel: () => void;
  isDriver: boolean;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onBook,
  onDelete,
  onCancel,
  isDriver
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  const isAllSelected = selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  return (
    <View style={[
      styles.selectionBar,
      { backgroundColor: currentColors.surface }
    ]}>
      {/* Selection info */}
      <View style={styles.selectionInfo}>
        <Text style={[styles.selectionText, { color: currentColors.text }]}>
          {t('orders.selection.selected', { count: selectedCount })}
        </Text>
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={onSelectAll}
        >
          <Text style={[styles.selectAllText, { color: currentColors.primary }]}>
            {isAllSelected ? t('orders.selection.deselectAll') : t('orders.selection.selectAll')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.selectionActions}>
        {hasSelection && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: currentColors.primary }]}
              onPress={onBook}
            >
              <Ionicons name={isDriver ? "checkmark" : "car"} size={20} color="#FFFFFF" />
              <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
                {isDriver ? t('orders.selection.accept') : t('orders.selection.book')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: currentColors.error }]}
              onPress={onDelete}
            >
              <Ionicons name="trash" size={20} color="#FFFFFF" />
              <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
                {t('orders.selection.delete')}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: currentColors.border }]}
          onPress={onCancel}
        >
          <Text style={[styles.cancelButtonText, { color: currentColors.text }]}>
            {t('orders.selection.cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
