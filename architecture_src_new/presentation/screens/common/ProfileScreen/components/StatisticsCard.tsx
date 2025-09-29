import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../shared/i18n';
import { TrendingUp, Car, Star, Clock } from '../../../../../shared/components/IconLibrary';

const { width } = Dimensions.get('window');

export interface UserStats {
  totalTrips: number;
  totalEarnings: number;
  averageRating: number;
  totalHours: number;
  completedTrips: number;
  cancelledTrips: number;
}

interface StatisticsCardProps {
  stats: UserStats;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ stats }) => {
  const { colors } = useTheme();
  const { t } = useI18n();

  const styles = createStyles(colors);

  const statItems = [
    {
      icon: Car,
      value: stats.totalTrips.toString(),
      label: t('profile.stats.totalTrips'),
      color: colors.primary,
    },
    {
      icon: TrendingUp,
      value: `$${stats.totalEarnings.toFixed(0)}`,
      label: t('profile.stats.totalEarnings'),
      color: '#10B981', // Green for earnings
    },
    {
      icon: Star,
      value: stats.averageRating.toFixed(1),
      label: t('profile.stats.averageRating'),
      color: '#F59E0B', // Amber for rating
    },
    {
      icon: Clock,
      value: `${stats.totalHours.toFixed(0)}h`,
      label: t('profile.stats.totalHours'),
      color: colors.primary,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.stats.title')}</Text>
      
      <View style={styles.statsGrid}>
        {statItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <View key={index} style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <IconComponent size={20} color={item.color} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      {/* Additional Stats Row */}
      <View style={styles.additionalStats}>
        <View style={styles.additionalStat}>
          <Text style={styles.additionalValue}>{stats.completedTrips}</Text>
          <Text style={styles.additionalLabel}>{t('profile.stats.completedTrips')}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.additionalStat}>
          <Text style={styles.additionalValue}>{stats.cancelledTrips}</Text>
          <Text style={styles.additionalLabel}>{t('profile.stats.cancelledTrips')}</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    width: (width - 72) / 2, // 2 columns with padding
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  additionalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  additionalStat: {
    flex: 1,
    alignItems: 'center',
  },
  additionalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  additionalLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
});
