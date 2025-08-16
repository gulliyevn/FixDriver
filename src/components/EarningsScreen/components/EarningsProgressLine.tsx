import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useI18n } from '../../../hooks/useI18n';
import { getCurrentColors, SIZES } from '../../../constants/colors';
import { useLevelProgress } from '../../../context/LevelProgressContext';
import { useVIPTimeTracking } from '../hooks/useVIPTimeTracking';

interface EarningsProgressLineProps {
  isDark: boolean;
}

const EarningsProgressLine: React.FC<EarningsProgressLineProps> = ({ isDark }) => {
  const { t } = useI18n();
  const colors = getCurrentColors(isDark);
  const { driverLevel } = useLevelProgress();
  
  // VIP система отслеживания времени
  const { vipTimeData, getCurrentHoursOnline } = useVIPTimeTracking(driverLevel.isVIP);
  
  // Анимация для прогресс бара
  const progressAnim = useRef(new Animated.Value(0)).current;
  const prevProgress = useRef(driverLevel.isVIP ? vipTimeData.daysOnline : driverLevel.currentProgress);
  
  // Рассчитываем процент прогресса в зависимости от VIP статуса
  const progressPercentage = driverLevel.isVIP 
    ? (driverLevel.vipDaysOnline / driverLevel.vipDaysRequired) * 100
    : (driverLevel.currentProgress / driverLevel.maxProgress) * 100;


  
  // Анимация при изменении прогресса
  useEffect(() => {
    const currentProgress = driverLevel.isVIP ? driverLevel.vipDaysOnline : driverLevel.currentProgress;
    
    if (currentProgress !== prevProgress.current) {
      // Анимируем к новому значению
      Animated.timing(progressAnim, {
        toValue: progressPercentage,
        duration: 800, // 800ms для плавной анимации
        useNativeDriver: false,
      }).start();
      
      prevProgress.current = currentProgress;
    } else {
      // Устанавливаем начальное значение без анимации
      progressAnim.setValue(progressPercentage);
    }
  }, [driverLevel.currentProgress, driverLevel.maxProgress, driverLevel.vipDaysOnline, progressPercentage, progressAnim, driverLevel.isVIP]);

  const styles = StyleSheet.create({
    container: {
      marginTop: SIZES.lg,
    },
    progressBar: {
      width: '100%',
      height: 24,
      backgroundColor: colors.border,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    progressText: {
      fontSize: SIZES.fontSize.sm,
      fontWeight: '700',
      color: colors.background,
      textAlign: 'center',
      zIndex: 1,
    },
  });

  // Функция для получения названия следующего уровня
  const getNextLevelTitle = (level: number) => {
    const levelNames = {
      1: 'Стартер',
      2: 'Упорный', 
      3: 'Надежный',
      4: 'Чемпион',
      5: 'Суперзвезда',
      6: 'Император'
    };
    return levelNames[level as keyof typeof levelNames] || 'Максимум';
  };

  // Функция для получения текста прогресса
  const getProgressText = () => {
    // Если VIP статус, показываем дни онлайн
    if (driverLevel.isVIP) {
      // Используем данные из driverLevel для синхронизации
      return `${driverLevel.vipDaysOnline}/${driverLevel.vipDaysRequired} ${t('common.levels.days')}`;
    }
    
    // Обычный прогресс поездок
    return `${driverLevel.currentProgress}/${driverLevel.maxProgress}`;
  };

  // Проверяем, есть ли данные
  if (!driverLevel || !driverLevel.subLevelTitle) {
    console.log('EarningsProgressLine - нет данных driverLevel');
    return (
      <View style={styles.container}>
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>0/0</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Прогресс бар с информацией внутри */}
      <View style={styles.progressBar}>
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
        
        <Text style={styles.progressText}>
          {getProgressText()}
        </Text>
      </View>
    </View>
  );
};

export default EarningsProgressLine;
