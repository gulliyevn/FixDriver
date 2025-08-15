import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from '../../../hooks/useI18n';
import { useEarningsLevel } from '../hooks/useEarningsLevel';
import { getCurrentColors, SHADOWS, SIZES } from '../../../constants/colors';

interface EarningsProgressLineProps {
  isDark: boolean;
}

const EarningsProgressLine: React.FC<EarningsProgressLineProps> = ({ isDark }) => {
  const { t } = useI18n();
  const colors = getCurrentColors(isDark);
  const { driverLevel } = useEarningsLevel();

  const progressPercentage = (driverLevel.currentProgress / driverLevel.maxProgress) * 100;

  const styles = StyleSheet.create({
    container: {
      marginTop: SIZES.lg,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressInfo: {
      flex: 1,
    },
    progressText: {
      fontSize: SIZES.fontSize.sm,
      fontWeight: '700',
      color: colors.background,
      zIndex: 1,
    },
    levelTitle: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      marginBottom: SIZES.sm,
    },
    progressBar: {
      width: '100%',
      height: 24,
      backgroundColor: colors.border,
      borderRadius: 12,
      marginBottom: SIZES.xs,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    rewardText: {
      fontSize: SIZES.fontSize.sm,
      fontWeight: '600',
      color: colors.success,
      textAlign: 'right',
    },
  });

  return (
    <View style={styles.container}>
              <View style={styles.progressBar}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${progressPercentage}%`,
              height: '100%',
              borderRadius: 12,
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
          <Text style={styles.progressText}>
            {driverLevel.currentProgress}/{driverLevel.maxProgress}
          </Text>
        </View>
    </View>
  );
};

export default EarningsProgressLine;
