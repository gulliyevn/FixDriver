import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../../core/context/ThemeContext';
import { useI18n } from '../../../../../shared/i18n';
import { useLevelProgress } from '../../../../../core/context/LevelProgressContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { createEarningsProgressLineStyles } from '../styles/EarningsProgressLine.styles';
import { getLevelConfig } from '../types/levels.config';

interface EarningsProgressLineProps {
  // VIP data lifted up for single source of truth
  vipQualifiedDays?: number;
  vipRidesToday?: number;
  vipCurrentHours?: number;
}

const EarningsProgressLine: React.FC<EarningsProgressLineProps> = ({ 
  vipQualifiedDays, 
  vipRidesToday, 
  vipCurrentHours 
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const colors = isDark ? darkColors : lightColors;
  const styles = createEarningsProgressLineStyles();
  const { driverLevel } = useLevelProgress();
  
  // Get current online hours from props (single source from parent)
  const currentHours = vipCurrentHours ?? 0;
  
  // Animation for progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;
  const prevProgress = useRef(driverLevel.isVIP ? (vipQualifiedDays ?? 0) : driverLevel.currentProgress);
  
  // Check VIP conditions for today
  const isQualifiedToday = driverLevel.isVIP && currentHours >= 10 && (vipRidesToday ?? 0) >= 3;
  const displayDays = driverLevel.isVIP 
    ? (vipQualifiedDays ?? 0) + (isQualifiedToday ? 1 : 0)
    : 0;
  
  // Calculate progress percentage based on VIP status
  const progressPercentage = driverLevel.isVIP 
    ? (displayDays / 30) * 100
    : (driverLevel.currentProgress / driverLevel.maxProgress) * 100;

  // Current progress for animation
  const currentProgress = driverLevel.isVIP ? displayDays : driverLevel.currentProgress;
  
  // Animation on progress change
  useEffect(() => {
    if (currentProgress !== prevProgress.current) {
      // Animate to new value
      Animated.timing(progressAnim, {
        toValue: progressPercentage,
        duration: 800, // 800ms for smooth animation
        useNativeDriver: false,
      }).start();
      
      prevProgress.current = currentProgress;
    } else {
      // Set initial value without animation
      progressAnim.setValue(progressPercentage);
    }
  }, [currentProgress, progressPercentage, progressAnim, vipQualifiedDays, vipRidesToday, currentHours, driverLevel.isVIP]);

  // Get progress text based on VIP status
  const getProgressText = (): string => {
    if (driverLevel.isVIP) {
      // VIP progress: days qualified
      return `${displayDays}/30`;
    }
    // Regular progress: trips
    return `${driverLevel.currentProgress}/${driverLevel.maxProgress}`;
  };

  // Check if we have data
  if (!driverLevel || !driverLevel.subLevelTitle) {
    console.log('EarningsProgressLine - no driverLevel data');
    return (
      <View style={styles.container}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <Text style={[styles.progressText, { color: colors.text }]}>0/0</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress bar with information inside */}
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            borderRadius: 12,
          }}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 12,
            }}
          />
        </Animated.View>
        
        <Text style={[styles.progressText, { color: colors.text }]}>
          {getProgressText()}
        </Text>
      </View>
    </View>
  );
};

export default EarningsProgressLine;