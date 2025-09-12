/**
 * FilterChips component
 * Filter chips for drivers list
 */

import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { OrdersScreenStyles as styles } from '../../styles/OrdersScreen.styles';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';

interface FilterChipsProps {
  activeFilters: {
    all?: boolean;
    online?: boolean;
    priceAsc?: boolean;
    priceDesc?: boolean;
    rating45?: boolean;
    vip?: boolean;
    dailyTrips?: boolean;
    economy?: boolean;
  };
  onFilterSelect: (key: string) => void;
  isDriver: boolean;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilters,
  onFilterSelect,
  isDriver
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const currentColors = isDark ? darkColors : lightColors;

  const getFilterChips = () => {
    const baseChips = [
      { key: 'all', label: t('orders.filters.all') },
      { key: 'online', label: t('orders.filters.online') },
      { key: 'rating45', label: t('orders.filters.rating45') },
      { key: 'priceAsc', label: t('orders.filters.priceAsc') },
      { key: 'priceDesc', label: t('orders.filters.priceDesc') },
    ];

    if (isDriver) {
      // Driver-specific filters
      baseChips.push(
        { key: 'dailyTrips', label: t('orders.filters.dailyTrips') }
      );
    } else {
      // Client-specific filters
      baseChips.push(
        { key: 'vip', label: t('orders.filters.vip') },
        { key: 'economy', label: t('orders.filters.economy') }
      );
    }

    return baseChips;
  };

  const chips = getFilterChips();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {chips.map((chip) => {
        const isActive = activeFilters[chip.key as keyof typeof activeFilters];
        
        return (
          <TouchableOpacity
            key={chip.key}
            style={[
              styles.filterChip,
              {
                backgroundColor: isActive ? currentColors.primary : currentColors.surface,
                borderColor: currentColors.border
              }
            ]}
            onPress={() => onFilterSelect(chip.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                {
                  color: isActive ? currentColors.surface : currentColors.text
                }
              ]}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
