import React from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../hooks/useI18n';

type DriversHeaderProps = {
  styles: any;
  isDark: boolean;
  filterExpandAnim: Animated.Value;
  onToggleFilter: () => void;
  onOpenNotifications: () => void;
};

const DriversHeader: React.FC<DriversHeaderProps> = ({ styles, isDark, filterExpandAnim, onToggleFilter, onOpenNotifications }) => {
  const { t } = useI18n();

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
          <Text style={styles.headerTitle}>{t('client.drivers')}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterIconContainer} onPress={onToggleFilter} accessibilityLabel={t('client.notifications.filter')}>
              <Ionicons name="funnel-outline" size={22} color={isDark ? '#F9FAFB' : '#111827'} />
            </TouchableOpacity>
            <TouchableOpacity accessibilityLabel={t('client.notifications.title')} onPress={onOpenNotifications} style={styles.filterButton}>
              <Ionicons name="notifications-outline" size={22} color={isDark ? '#F9FAFB' : '#111827'} />
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer} contentContainerStyle={styles.filtersContent}>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>{t('client.driversScreen.filters.all')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Ionicons name="radio-button-on" size={16} color={isDark ? '#3B82F6' : '#083198'} />
              <Text style={styles.filterChipText}>{t('client.chat.online')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Ionicons name="star" size={16} color={isDark ? '#3B82F6' : '#083198'} />
              <Text style={styles.filterChipText}>{t('client.driversScreen.filters.rating45')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Ionicons name="diamond" size={16} color={isDark ? '#3B82F6' : '#083198'} />
              <Text style={styles.filterChipText}>{t('client.profile.vip.title')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Ionicons name="location" size={16} color={isDark ? '#3B82F6' : '#083198'} />
              <Text style={styles.filterChipText}>{t('client.driversScreen.filters.nearby')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Ionicons name="flash" size={16} color={isDark ? '#3B82F6' : '#083198'} />
              <Text style={styles.filterChipText}>{t('client.driversScreen.filters.fastDispatch')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Ionicons name="wallet" size={16} color={isDark ? '#3B82F6' : '#083198'} />
              <Text style={styles.filterChipText}>{t('client.driversScreen.filters.economy')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default React.memo(DriversHeader);


