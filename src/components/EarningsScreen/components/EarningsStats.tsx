import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../hooks/useI18n';
import { useEarningsStats } from '../hooks/useEarningsStats';
import { getCurrentColors, SHADOWS, SIZES } from '../../../constants/colors';


interface EarningsStatsProps {
  period: 'today' | 'week' | 'month' | 'year';
  isDark: boolean;
}

const EarningsStats: React.FC<EarningsStatsProps> = ({ period, isDark }) => {
  const { t } = useI18n();
  const colors = getCurrentColors(isDark);
  const { statsCards } = useEarningsStats(period);
  const [isExpanded, setIsExpanded] = useState(true);
  const [animation] = useState(new Animated.Value(1));
  const [chevronRotation] = useState(new Animated.Value(0));

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: SIZES.xl,
      marginHorizontal: SIZES.xl,
      marginBottom: SIZES.lg,
      borderRadius: SIZES.radius.lg,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SIZES.lg,
    },
    title: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '600',
      color: colors.text,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      width: '48%',
      backgroundColor: colors.background,
      borderRadius: SIZES.radius.md,
      padding: SIZES.lg,
      marginBottom: SIZES.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SIZES.xs,
    },
    statValue: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    statSubtitle: {
      fontSize: SIZES.fontSize.xs,
      color: colors.textSecondary,
      marginBottom: SIZES.xs,
      textAlign: 'center',
      marginLeft: SIZES.xs,
      marginTop: SIZES.xs,
    },
    statTitle: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: SIZES.xs,
    },

  });

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    const toRotation = isExpanded ? 1 : 0;
    
    Animated.parallel([
      Animated.timing(animation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(chevronRotation, {
        toValue: toRotation,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
              <TouchableOpacity style={styles.headerContainer} onPress={toggleExpanded}>
          <Text style={styles.title}>{t('driver.earnings.stats.title')}</Text>
        <Animated.View style={{
          transform: [{
            rotate: chevronRotation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '180deg'],
            }),
          }],
        }}>
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color={colors.textSecondary} 
          />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View style={{
        maxHeight: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 500],
        }),
        opacity: animation,
        overflow: 'hidden',
      }}>
        <View style={styles.statsGrid}>
          {statsCards.map((card, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.valueContainer}>
                <Text style={styles.statValue}>{card.value}</Text>
                {card.subtitle && (
                  <Text style={styles.statSubtitle}>{card.subtitle}</Text>
                )}
              </View>
              
              <Text style={styles.statTitle}>
                {card.title === 'totalRides' && t('driver.earnings.stats.totalRides')}
                {card.title === 'avgRating' && t('driver.earnings.stats.avgRating')}
                {card.title === 'workHours' && t('driver.earnings.stats.workHours')}
                {card.title === 'completionRate' && t('driver.earnings.stats.completionRate')}
                {card.title === 'avgPerRide' && t('driver.earnings.stats.avgPerRide')}
                {card.title === 'scheduleCompletion' && t('driver.earnings.stats.scheduleCompletion')}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

export default EarningsStats;
