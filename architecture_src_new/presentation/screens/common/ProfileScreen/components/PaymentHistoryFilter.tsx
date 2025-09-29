import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { CheckCircle, XCircle, Clock, Calendar, Close, Car, RefreshCw, CreditCard, List } from '../../../../../shared/components/IconLibrary';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../shared/i18n';
import { createPaymentHistoryFilterStyles } from './styles/PaymentHistoryFilter.styles';

export interface PaymentFilter {
  type: 'all' | 'trip' | 'refund' | 'fee';
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
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createPaymentHistoryFilterStyles(colors);
  const [filter, setFilter] = useState<PaymentFilter>(currentFilter);
  
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const paymentTypes = [
    { key: 'all', label: 'Все типы', icon: List },
    { key: 'trip', label: 'Поездки', icon: Car },
    { key: 'refund', label: 'Возвраты', icon: RefreshCw },
    { key: 'fee', label: 'Комиссии', icon: CreditCard }
  ];

  const statuses = [
    { key: 'all', label: 'Все статусы', icon: CheckCircle },
    { key: 'completed', label: 'Завершено', icon: CheckCircle },
    { key: 'pending', label: 'В обработке', icon: Clock },
    { key: 'failed', label: 'Ошибка', icon: XCircle }
  ];

  const dateRanges = [
    { key: 'all', label: 'Все время', icon: Calendar },
    { key: 'today', label: 'Сегодня', icon: Calendar },
    { key: 'week', label: 'Эта неделя', icon: Calendar },
    { key: 'month', label: 'Этот месяц', icon: Calendar },
    { key: 'year', label: 'Этот год', icon: Calendar }
  ];

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  // Анимация появления/скрытия
  useEffect(() => {
    if (visible) {
      // Затемнение появляется сразу
      fadeAnim.setValue(1);
      // Модальное окно слайдится снизу вверх
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
    } else {
      // Модальное окно слайдится сверху вниз
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        fadeAnim.setValue(0);
      });
    }
  }, [visible, fadeAnim, slideAnim]);

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
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View style={[
          styles.modalContainer,
          styles.animatedModalContainer,
          { transform: [{ translateY: slideAnim }] }
        ]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Фильтр платежей
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Close size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Тип платежа */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Тип платежа
              </Text>
              {paymentTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.optionContainer,
                      filter.type === type.key 
                        ? styles.optionContainerSelected
                        : styles.optionContainerUnselected
                    ]}
                    onPress={() => setFilter({ ...filter, type: type.key as any })}
                  >
                    <IconComponent 
                      size={20} 
                      color={filter.type === type.key ? colors.primary : colors.textSecondary}
                      style={styles.optionIcon}
                    />
                    <Text style={[
                      styles.optionText,
                      filter.type === type.key 
                        ? styles.optionTextSelected
                        : styles.optionTextUnselected
                    ]}>
                      {type.label}
                    </Text>
                    {filter.type === type.key && (
                      <CheckCircle 
                        size={20} 
                        color={colors.primary}
                        style={styles.checkmark}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Статус */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Статус
              </Text>
              {statuses.map((status) => {
                const IconComponent = status.icon;
                return (
                  <TouchableOpacity
                    key={status.key}
                    style={[
                      styles.optionContainer,
                      filter.status === status.key 
                        ? styles.optionContainerSelected
                        : styles.optionContainerUnselected
                    ]}
                    onPress={() => setFilter({ ...filter, status: status.key as any })}
                  >
                    <IconComponent 
                      size={20} 
                      color={filter.status === status.key ? colors.primary : colors.textSecondary}
                      style={styles.optionIcon}
                    />
                    <Text style={[
                      styles.optionText,
                      filter.status === status.key 
                        ? styles.optionTextSelected
                        : styles.optionTextUnselected
                    ]}>
                      {status.label}
                    </Text>
                    {filter.status === status.key && (
                      <CheckCircle 
                        size={20} 
                        color={colors.primary}
                        style={styles.checkmark}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Период */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Период
              </Text>
              {dateRanges.map((range) => {
                const IconComponent = range.icon;
                return (
                  <TouchableOpacity
                    key={range.key}
                    style={[
                      styles.optionContainer,
                      filter.dateRange === range.key 
                        ? styles.optionContainerSelected
                        : styles.optionContainerUnselected
                    ]}
                    onPress={() => setFilter({ ...filter, dateRange: range.key as any })}
                  >
                    <IconComponent 
                      size={20} 
                      color={filter.dateRange === range.key ? colors.primary : colors.textSecondary}
                      style={styles.optionIcon}
                    />
                    <Text style={[
                      styles.optionText,
                      filter.dateRange === range.key 
                        ? styles.optionTextSelected
                        : styles.optionTextUnselected
                    ]}>
                      {range.label}
                    </Text>
                    {filter.dateRange === range.key && (
                      <CheckCircle 
                        size={20} 
                        color={colors.primary}
                        style={styles.checkmark}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Кнопки */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>
                Сбросить
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>
                Применить
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default PaymentHistoryFilter;
