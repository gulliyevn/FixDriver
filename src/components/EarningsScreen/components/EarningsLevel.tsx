import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from '../../../hooks/useI18n';
import { useEarningsLevel } from '../hooks/useEarningsLevel';
import { getCurrentColors, SHADOWS, SIZES } from '../../../constants/colors';

interface EarningsLevelProps {
  isDark: boolean;
}

const EarningsLevel: React.FC<EarningsLevelProps> = ({ isDark }) => {
  const { t } = useI18n();
  const colors = getCurrentColors(isDark);
  const { driverLevel } = useEarningsLevel();

  const progressPercentage = (driverLevel.currentProgress / driverLevel.maxProgress) * 100;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: SIZES.xl,
      marginHorizontal: SIZES.xl,
      marginBottom: SIZES.lg,
      borderRadius: SIZES.radius.lg,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    levelContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 6,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    progressFill: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 6,
      borderColor: 'transparent',
      borderTopColor: '#10B981',
      borderRightColor: '#10B981',
      transform: [{ rotate: `${-90 + (progressPercentage * 3.6)}deg` }],
    },
    progressText: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '700',
      color: colors.text,
    },
    levelInfo: {
      flex: 1,
      marginLeft: SIZES.lg,
    },
    levelTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: colors.text,
      marginBottom: SIZES.xs,
    },
    levelDescription: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      marginBottom: SIZES.sm,
    },
    rewardSection: {
      alignItems: 'flex-end',
    },
    rewardIcon: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.success + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rewardText: {
      fontSize: SIZES.fontSize.xs,
      fontWeight: '600',
      color: colors.success,
      marginTop: 2,
    },
    progressBar: {
      width: '100%',
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginTop: SIZES.sm,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        {/* Круглый прогресс-бар */}
        <View style={styles.progressSection}>
          <View style={styles.progressCircle}>
            <View style={styles.progressFill} />
            <Text style={styles.progressText}>
              {driverLevel.currentProgress}/{driverLevel.maxProgress}
            </Text>
            <Text style={styles.rewardText}>{driverLevel.nextReward}</Text>
          </View>
          
          {/* Информация об уровне */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>{driverLevel.title}</Text>
            <Text style={styles.levelDescription}>
              Уровень {driverLevel.currentLevel}
            </Text>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: `${progressPercentage}%`,
                  height: '100%',
                  borderRadius: 2,
                }}
              />
            </View>
          </View>
        </View>


      </View>
    </View>
  );
};

export default EarningsLevel;
