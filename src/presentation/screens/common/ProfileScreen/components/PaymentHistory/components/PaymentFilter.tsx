/**
 * PaymentFilter component
 * Filter modal for payment history
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../../../../../context/LanguageContext';
import { PaymentHistoryScreenStyles as styles } from '../styles/PaymentHistoryScreen.styles';

interface PaymentFilter {
  type: 'all' | 'trip' | 'topup' | 'refund' | 'fee';
  status: 'all' | 'completed' | 'pending' | 'failed';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
}

interface PaymentFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: PaymentFilter) => void;
  currentFilter: PaymentFilter;
  colors: any;
}

export const PaymentFilter: React.FC<PaymentFilterProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter,
  colors
}) => {
  const { t } = useLanguage();
  const [localFilter, setLocalFilter] = useState<PaymentFilter>(currentFilter);

  const handleApply = () => {
    onApply(localFilter);
    onClose();
  };

  const handleReset = () => {
    const resetFilter: PaymentFilter = {
      type: 'all',
      status: 'all',
      dateRange: 'all'
    };
    setLocalFilter(resetFilter);
    onApply(resetFilter);
    onClose();
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.filterSection}>
      <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
        {title}
      </Text>
      <View style={styles.filterOptions}>
        {children}
      </View>
    </View>
  );

  const FilterOption = ({ 
    value, 
    label, 
    currentValue, 
    onSelect 
  }: { 
    value: string; 
    label: string; 
    currentValue: string; 
    onSelect: (value: string) => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterOption,
        { 
          backgroundColor: currentValue === value ? colors.primary : colors.surface,
          borderColor: colors.border
        }
      ]}
      onPress={() => onSelect(value)}
    >
      <Text style={[
        styles.filterOptionText,
        { 
          color: currentValue === value ? '#FFFFFF' : colors.text 
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.filterModal, { backgroundColor: colors.background }]}>
        <View style={[styles.filterHeader, { backgroundColor: colors.surface }]}>
          <TouchableOpacity onPress={onClose} style={styles.filterCloseButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.filterTitle, { color: colors.text }]}>
            {t('paymentHistory.filter.title')}
          </Text>
          <TouchableOpacity onPress={handleReset} style={styles.filterResetButton}>
            <Text style={[styles.filterResetText, { color: colors.primary }]}>
              {t('paymentHistory.filter.reset')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.filterContent}
          contentContainerStyle={styles.filterContentContainer}
        >
          <FilterSection title={t('paymentHistory.filter.type')}>
            <FilterOption
              value="all"
              label={t('paymentHistory.filter.all')}
              currentValue={localFilter.type}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, type: value as any }))}
            />
            <FilterOption
              value="trip"
              label={t('paymentHistory.filter.trip')}
              currentValue={localFilter.type}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, type: value as any }))}
            />
            <FilterOption
              value="fee"
              label={t('paymentHistory.filter.fee')}
              currentValue={localFilter.type}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, type: value as any }))}
            />
            <FilterOption
              value="refund"
              label={t('paymentHistory.filter.refund')}
              currentValue={localFilter.type}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, type: value as any }))}
            />
          </FilterSection>

          <FilterSection title={t('paymentHistory.filter.status')}>
            <FilterOption
              value="all"
              label={t('paymentHistory.filter.all')}
              currentValue={localFilter.status}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, status: value as any }))}
            />
            <FilterOption
              value="completed"
              label={t('paymentHistory.filter.completed')}
              currentValue={localFilter.status}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, status: value as any }))}
            />
            <FilterOption
              value="pending"
              label={t('paymentHistory.filter.pending')}
              currentValue={localFilter.status}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, status: value as any }))}
            />
            <FilterOption
              value="failed"
              label={t('paymentHistory.filter.failed')}
              currentValue={localFilter.status}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, status: value as any }))}
            />
          </FilterSection>

          <FilterSection title={t('paymentHistory.filter.dateRange')}>
            <FilterOption
              value="all"
              label={t('paymentHistory.filter.all')}
              currentValue={localFilter.dateRange}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, dateRange: value as any }))}
            />
            <FilterOption
              value="today"
              label={t('paymentHistory.filter.today')}
              currentValue={localFilter.dateRange}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, dateRange: value as any }))}
            />
            <FilterOption
              value="week"
              label={t('paymentHistory.filter.week')}
              currentValue={localFilter.dateRange}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, dateRange: value as any }))}
            />
            <FilterOption
              value="month"
              label={t('paymentHistory.filter.month')}
              currentValue={localFilter.dateRange}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, dateRange: value as any }))}
            />
            <FilterOption
              value="year"
              label={t('paymentHistory.filter.year')}
              currentValue={localFilter.dateRange}
              onSelect={(value) => setLocalFilter(prev => ({ ...prev, dateRange: value as any }))}
            />
          </FilterSection>
        </ScrollView>

        <View style={[styles.filterFooter, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[styles.filterApplyButton, { backgroundColor: colors.primary }]}
            onPress={handleApply}
          >
            <Text style={[styles.filterApplyText, { color: '#FFFFFF' }]}>
              {t('paymentHistory.filter.apply')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
