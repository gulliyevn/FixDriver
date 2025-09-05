import React from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../core/context/ThemeContext';
import { useI18n } from '../../shared/i18n';
import { lightColors, darkColors } from '../../shared/constants/colors';
import { createEarningsHeaderStyles } from './styles/EarningsHeader.styles';

type EarningsHeaderProps = {
  filterExpandAnim: Animated.Value;
  onToggleFilter: () => void;
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
  onPeriodSelect: (period: 'today' | 'week' | 'month' | 'year') => void;
  isOnline: boolean;
  onStatusChange: () => void;
};

const EarningsHeader: React.FC<EarningsHeaderProps> = ({ 
  filterExpandAnim, 
  onToggleFilter, 
  selectedPeriod, 
  onPeriodSelect,
  isOnline,
  onStatusChange,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const colors = isDark ? darkColors : lightColors;
  const styles = createEarningsHeaderStyles(colors);

  const periodOptions = [
    { key: 'today', label: t('earnings.today'), icon: 'time' },
    { key: 'week', label: t('earnings.week'), icon: 'today' },
    { key: 'month', label: t('earnings.month'), icon: 'calendar' },
    { key: 'year', label: t('earnings.year'), icon: 'calendar-outline' },
  ] as const;

  return (
    <Animated.View
      style={[
        styles.header,
        {
          paddingTop: filterExpandAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 16] }),
          paddingBottom: filterExpandAnim.interpolate({ inputRange: [0, 1], outputRange: [-2, 12] }),
        },
      ]}
    >
      <View style={styles.headerTop}>
        <View style={[styles.headerRow, { marginTop: 4 }]}>
          <Text style={styles.headerTitle}>{t('earnings.title')}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.filterIconContainer} 
              onPress={onToggleFilter} 
              accessibilityLabel={t('earnings.filter')}
            >
              <Ionicons name="funnel-outline" size={22} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              accessibilityLabel={t('earnings.changeStatus')} 
              onPress={onStatusChange} 
              style={styles.statusButton}
            >
              <Ionicons 
                name={isOnline ? "radio-button-on" : "radio-button-off"} 
                size={22} 
                color={isOnline ? "#10B981" : "#6B7280"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={[
            styles.filtersWrapper,
            {
              maxHeight: filterExpandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
              opacity: filterExpandAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0, 1] }),
              overflow: 'hidden',
            },
          ]}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filtersContainer} 
            contentContainerStyle={styles.filtersContent}
          >
            {periodOptions.map((period) => (
              <TouchableOpacity 
                key={period.key}
                style={[
                  styles.filterChip,
                  selectedPeriod === period.key && styles.filterChipActive
                ]}
                onPress={() => onPeriodSelect(period.key)}
              >
                <Ionicons 
                  name={period.icon as any} 
                  size={16} 
                  color={selectedPeriod === period.key 
                    ? colors.surface
                    : colors.primary
                  } 
                />
                <Text style={[
                  styles.filterChipText,
                  selectedPeriod === period.key && styles.filterChipTextActive
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default React.memo(EarningsHeader);