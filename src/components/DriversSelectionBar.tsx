import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useI18n } from '../hooks/useI18n';

type DriversSelectionBarProps = {
  styles: any;
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onBook: () => void;
};

const DriversSelectionBar: React.FC<DriversSelectionBarProps> = ({ styles, selectedCount, totalCount, onSelectAll, onBook }) => {
  const { t } = useI18n();
  return (
    <View style={styles.actionButtonsContainer}>
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={[styles.actionButton, styles.selectAllButton]} onPress={onSelectAll}>
          <Text style={styles.selectAllButtonText}>
            {selectedCount === totalCount ? t('client.driversScreen.selection.deselectAll') : t('client.driversScreen.selection.selectAll')}
          </Text>
        </TouchableOpacity>
        {selectedCount > 0 && (
          <TouchableOpacity style={[styles.actionButton, styles.bookButton]} onPress={onBook}>
            <Text style={styles.bookButtonText}>{t('client.driversScreen.selection.bookCount', { count: selectedCount })}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(DriversSelectionBar);


