import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../shared/i18n';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { TopDriver } from '../types/earnings.types';
import { createTopDriversStyles } from '../styles/TopDrivers.styles';
import { mockTopDrivers } from '../../../../../shared/mocks/data/drivers';

interface TopDriversProps {
  drivers?: TopDriver[];
  onDriverPress?: (driver: TopDriver) => void;
}

const TopDrivers: React.FC<TopDriversProps> = ({ 
  drivers = [], 
  onDriverPress 
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const colors = isDark ? darkColors : lightColors;
  const styles = createTopDriversStyles();

  // Use mock data from central mocks (will be replaced with gRPC data)
  const displayDrivers = drivers.length > 0 ? drivers : mockTopDrivers;

  const formatEarnings = (earnings: number): string => {
    return `${earnings.toLocaleString()} AFc`;
  };

  const renderDriverItem = (driver: TopDriver, index: number) => (
    <TouchableOpacity 
      key={driver.id} 
      style={[
        styles.driverItem,
        { borderBottomColor: colors.border },
        index === displayDrivers.length - 1 && { borderBottomWidth: 0 }
      ]}
      activeOpacity={0.7}
      onPress={() => onDriverPress?.(driver)}
    >
      <View style={styles.driverHeader}>
        <View style={styles.positionContainer}>
          <Text style={[styles.position, { color: colors.primary }]}>
            {driver.position}
          </Text>
        </View>
        <View style={styles.driverContent}>
          <Text style={[styles.driverName, { color: colors.text }]}>
            {driver.name}
          </Text>
          <Text style={[styles.driverLevel, { color: colors.textSecondary }]}>
            {driver.level}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={[styles.rides, { color: colors.textSecondary }]}>
            {driver.rides}
          </Text>
          <Text style={[styles.earnings, { color: colors.primary }]}>
            {formatEarnings(driver.earnings)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="trophy-outline" size={20} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            {t('earnings.topDrivers')}
          </Text>
        </View>
      </View>

      {/* Drivers List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {displayDrivers.map(renderDriverItem)}
      </ScrollView>
    </View>
  );
};

export default TopDrivers;
