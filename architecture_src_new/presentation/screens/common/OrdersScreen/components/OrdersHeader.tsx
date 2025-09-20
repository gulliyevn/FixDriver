import React from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OrdersHeaderProps } from '../types/orders-header.types';
import { useOrdersHeader } from '../hooks/useOrdersHeader';
import { createOrdersHeaderStyles } from '../styles/OrdersHeader.styles';
import { useI18n } from '../../../../../shared/i18n';

const OrdersHeader: React.FC<OrdersHeaderProps> = ({
  role,
  isDark,
  onBackPress,
  onFilterPress,
  onNotificationsPress,
  showBackButton = true,
  showFilterButton = true,
  showNotificationsButton = true,
  filterExpandAnim,
  onToggleFilter,
  onSelectFilter,
  activeFilters = {},
}) => {
  const [state] = useOrdersHeader(role);
  const { t } = useI18n();
  const styles = createOrdersHeaderStyles(isDark);

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={[styles.headerRow, { marginTop: 4 }]}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{state.title}</Text>
            {state.subtitle && (
              <Text style={styles.subtitle}>{state.subtitle}</Text>
            )}
          </View>
          <View style={styles.headerActions}>
            {showFilterButton && onToggleFilter && (
              <TouchableOpacity 
                style={styles.filterIconContainer}
                onPress={onToggleFilter}
                accessibilityLabel="Фильтры"
              >
                <Ionicons 
                  name="funnel-outline" 
                  size={22} 
                  color={isDark ? '#F9FAFB' : '#111827'} 
                />
              </TouchableOpacity>
            )}

            {showNotificationsButton && onNotificationsPress && (
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={onNotificationsPress}
                accessibilityLabel="Уведомления"
              >
                <Ionicons 
                  name="notifications-outline" 
                  size={22} 
                  color={isDark ? '#F9FAFB' : '#111827'} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Раскрывающиеся фильтры */}
        {filterExpandAnim && onSelectFilter && (
          <Animated.View
            style={[
              styles.filtersWrapper,
              {
                height: filterExpandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
                opacity: filterExpandAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0, 1] }),
                overflow: 'hidden',
                marginTop: filterExpandAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 24] }),
              },
            ]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              directionalLockEnabled
              alwaysBounceVertical={false}
              bounces={false}
              overScrollMode="never"
              scrollEventThrottle={16}
              style={styles.filtersContainer}
              contentContainerStyle={styles.filtersContent}
            >
              <TouchableOpacity
                style={[styles.filterChip, activeFilters.all && styles.filterChipActive]}
                onPress={() => onSelectFilter('all')}
              >
                <Text style={[styles.filterChipText, activeFilters.all && styles.filterChipTextActive]}>
                  {t('client.driversScreen.filters.all') || 'Все'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterChip, activeFilters.online && styles.filterChipActive]}
                onPress={() => onSelectFilter('online')}
              >
                <Ionicons name="radio-button-on" size={16} color={isDark ? '#3B82F6' : '#083198'} />
                <Text style={[styles.filterChipText, activeFilters.online && styles.filterChipTextActive]}>
                  {t('client.chat.online') || 'Онлайн'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterChip, activeFilters.priceDesc && styles.filterChipActive]}
                onPress={() => onSelectFilter('priceDesc')}
              >
                <Ionicons name="chevron-down-outline" size={16} color={isDark ? '#3B82F6' : '#083198'} />
                <Text style={[styles.filterChipText, activeFilters.priceDesc && styles.filterChipTextActive]}>
                  {t('client.driversScreen.filters.price') || 'Цена'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterChip, activeFilters.priceAsc && styles.filterChipActive]}
                onPress={() => onSelectFilter('priceAsc')}
              >
                <Ionicons name="chevron-up-outline" size={16} color={isDark ? '#3B82F6' : '#083198'} />
                <Text style={[styles.filterChipText, activeFilters.priceAsc && styles.filterChipTextActive]}>
                  {t('client.driversScreen.filters.price') || 'Цена'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.filterChip, activeFilters.rating45 && styles.filterChipActive]}
                onPress={() => onSelectFilter('rating45')}
              >
                <Ionicons name="star" size={16} color={isDark ? '#3B82F6' : '#083198'} />
                <Text style={[styles.filterChipText, activeFilters.rating45 && styles.filterChipTextActive]}>
                  {t('client.driversScreen.filters.rating45') || '4.5+'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default OrdersHeader;
