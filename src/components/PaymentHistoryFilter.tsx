import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../constants/colors';

export interface PaymentFilter {
  type: 'all' | 'trip' | 'topup' | 'refund' | 'fee';
  status: 'all' | 'completed' | 'pending' | 'failed';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
}

interface PaymentHistoryFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: PaymentFilter) => void;
  currentFilter: PaymentFilter;
}

const PaymentHistoryFilter: React.FC<PaymentHistoryFilterProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? colors.dark : colors.light;
  const [filter, setFilter] = useState<PaymentFilter>(currentFilter);

  const paymentTypes = [
    { key: 'all', label: t('client.paymentHistory.filter.allTypes'), icon: 'list' },
    { key: 'trip', label: t('client.paymentHistory.filter.trips'), icon: 'car' },
    { key: 'topup', label: t('client.paymentHistory.filter.topUps'), icon: 'add-circle' },
    { key: 'refund', label: t('client.paymentHistory.filter.refunds'), icon: 'refresh-circle' },
    { key: 'fee', label: t('client.paymentHistory.filter.fees'), icon: 'card' }
  ];

  const statuses = [
    { key: 'all', label: t('client.paymentHistory.filter.allStatuses'), icon: 'checkmark-circle' },
    { key: 'completed', label: t('client.paymentHistory.status.completed'), icon: 'checkmark-circle' },
    { key: 'pending', label: t('client.paymentHistory.status.pending'), icon: 'time' },
    { key: 'failed', label: t('client.paymentHistory.status.failed'), icon: 'close-circle' }
  ];

  const dateRanges = [
    { key: 'all', label: t('client.paymentHistory.filter.allTime'), icon: 'calendar' },
    { key: 'today', label: t('client.paymentHistory.filter.today'), icon: 'today' },
    { key: 'week', label: t('client.paymentHistory.filter.thisWeek'), icon: 'calendar-outline' },
    { key: 'month', label: t('client.paymentHistory.filter.thisMonth'), icon: 'calendar' },
    { key: 'year', label: t('client.paymentHistory.filter.thisYear'), icon: 'calendar' }
  ];

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  const handleReset = () => {
    const resetFilter: PaymentFilter = {
      type: 'all',
      status: 'all',
      dateRange: 'all'
    };
    setFilter(resetFilter);
    onApply(resetFilter);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
      }}>
        <View style={{
          backgroundColor: currentColors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          maxHeight: '80%'
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: currentColors.text
            }}>
              {t('client.paymentHistory.filter.title')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Тип платежа */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: currentColors.text,
                marginBottom: 12
              }}>
                {t('client.paymentHistory.filter.paymentType')}
              </Text>
              {paymentTypes.map((type) => (
                <TouchableOpacity
                  key={type.key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: filter.type === type.key ? currentColors.primary + '20' : 'transparent',
                    borderRadius: 8,
                    marginBottom: 8
                  }}
                  onPress={() => setFilter({ ...filter, type: type.key as any })}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={20} 
                    color={filter.type === type.key ? currentColors.primary : currentColors.textSecondary} 
                  />
                  <Text style={{
                    marginLeft: 12,
                    fontSize: 16,
                    color: filter.type === type.key ? currentColors.primary : currentColors.text
                  }}>
                    {type.label}
                  </Text>
                  {filter.type === type.key && (
                    <Ionicons 
                      name="checkmark" 
                      size={20} 
                      color={currentColors.primary} 
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Статус */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: currentColors.text,
                marginBottom: 12
              }}>
                {t('client.paymentHistory.filter.status')}
              </Text>
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status.key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: filter.status === status.key ? currentColors.primary + '20' : 'transparent',
                    borderRadius: 8,
                    marginBottom: 8
                  }}
                  onPress={() => setFilter({ ...filter, status: status.key as any })}
                >
                  <Ionicons 
                    name={status.icon as any} 
                    size={20} 
                    color={filter.status === status.key ? currentColors.primary : currentColors.textSecondary} 
                  />
                  <Text style={{
                    marginLeft: 12,
                    fontSize: 16,
                    color: filter.status === status.key ? currentColors.primary : currentColors.text
                  }}>
                    {status.label}
                  </Text>
                  {filter.status === status.key && (
                    <Ionicons 
                      name="checkmark" 
                      size={20} 
                      color={currentColors.primary} 
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Период */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: currentColors.text,
                marginBottom: 12
              }}>
                {t('client.paymentHistory.filter.period')}
              </Text>
              {dateRanges.map((range) => (
                <TouchableOpacity
                  key={range.key}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: filter.dateRange === range.key ? currentColors.primary + '20' : 'transparent',
                    borderRadius: 8,
                    marginBottom: 8
                  }}
                  onPress={() => setFilter({ ...filter, dateRange: range.key as any })}
                >
                  <Ionicons 
                    name={range.icon as any} 
                    size={20} 
                    color={filter.dateRange === range.key ? currentColors.primary : currentColors.textSecondary} 
                  />
                  <Text style={{
                    marginLeft: 12,
                    fontSize: 16,
                    color: filter.dateRange === range.key ? currentColors.primary : currentColors.text
                  }}>
                    {range.label}
                  </Text>
                  {filter.dateRange === range.key && (
                    <Ionicons 
                      name="checkmark" 
                      size={20} 
                      color={currentColors.primary} 
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Кнопки */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: currentColors.border
          }}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderWidth: 1,
                borderColor: currentColors.border,
                borderRadius: 8,
                marginRight: 8
              }}
              onPress={handleReset}
            >
              <Text style={{
                textAlign: 'center',
                fontSize: 16,
                color: currentColors.text
              }}>
                {t('client.paymentHistory.filter.reset')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 20,
                backgroundColor: currentColors.primary,
                borderRadius: 8,
                marginLeft: 8
              }}
              onPress={handleApply}
            >
              <Text style={{
                textAlign: 'center',
                fontSize: 16,
                color: '#fff',
                fontWeight: '600'
              }}>
                {t('client.paymentHistory.filter.apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentHistoryFilter; 