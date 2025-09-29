import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { CheckCircle, XCircle, Clock, Calendar, Close } from '../../../../../shared/components/IconLibrary';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../shared/i18n';
import { createTripsFilterStyles } from './styles/TripsFilter.styles';

export interface TripFilter {
  status: 'all' | 'completed' | 'cancelled' | 'scheduled';
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
}

interface TripsFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: TripFilter) => void;
  currentFilter: TripFilter;
}

const TripsFilter: React.FC<TripsFilterProps> = ({
  visible,
  onClose,
  onApply,
  currentFilter
}) => {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = createTripsFilterStyles(colors);
  const [filter, setFilter] = useState<TripFilter>({
    status: currentFilter.status,
    dateRange: currentFilter.dateRange
  });
  
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const statuses = [
    { key: 'all', label: 'Все статусы', icon: CheckCircle },
    { key: 'completed', label: 'Завершено', icon: CheckCircle },
    { key: 'cancelled', label: 'Отменено', icon: XCircle },
    { key: 'scheduled', label: 'Запланировано', icon: Clock }
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
    const resetFilter: TripFilter = {
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
              Фильтр поездок
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Close size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
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

export default TripsFilter;
