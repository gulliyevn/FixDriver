import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { DriverLevel, LEVEL_CONFIG, LEVEL_BONUSES } from '../types/earningsLevel.types';

const LEVEL_PROGRESS_KEY = '@driver_level_progress';

export const useEarningsLevel = () => {
  const [driverLevel, setDriverLevel] = useState<DriverLevel>({
    currentLevel: 1,
    currentSubLevel: 1,
    currentProgress: 0,
    maxProgress: 40,
    title: 'Стартер',
    subLevelTitle: 'Стартер 1',
    icon: '🥉',
    nextReward: '+2 AFc',
    isRewardAvailable: false,
  });

  // Загружаем прогресс при инициализации
  useEffect(() => {
    loadLevelProgress();
  }, []);

  const loadLevelProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(LEVEL_PROGRESS_KEY);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        
        // Миграция данных - добавляем недостающие поля
        const migratedProgress: DriverLevel = {
          currentLevel: parsedProgress.currentLevel || 1,
          currentSubLevel: parsedProgress.currentSubLevel || 1,
          currentProgress: parsedProgress.currentProgress || 0,
          maxProgress: parsedProgress.maxProgress || 40,
          title: parsedProgress.title || 'Стартер',
          subLevelTitle: parsedProgress.subLevelTitle || 'Стартер 1',
          icon: parsedProgress.icon || '🥉',
          nextReward: parsedProgress.nextReward || '+2 AFc',
          isRewardAvailable: parsedProgress.isRewardAvailable || false,
        };
        
        // Если это старая версия данных, пересчитываем правильные значения
        if (!parsedProgress.subLevelTitle) {
          const totalRides = getTotalRidesForLevel(migratedProgress.currentLevel, migratedProgress.currentSubLevel, migratedProgress.currentProgress);
          const newLevelInfo = calculateLevelAndSubLevel(totalRides);
          
          migratedProgress.currentLevel = newLevelInfo.level;
          migratedProgress.currentSubLevel = newLevelInfo.subLevel;
          migratedProgress.maxProgress = newLevelInfo.maxProgress;
          migratedProgress.title = newLevelInfo.title;
          migratedProgress.subLevelTitle = newLevelInfo.subLevelTitle;
          migratedProgress.icon = newLevelInfo.icon;
          migratedProgress.nextReward = newLevelInfo.nextReward;
        }
        
        setDriverLevel(migratedProgress);
        console.log('Loaded and migrated driver level:', migratedProgress);
      } else {
        console.log('No saved progress found, using default');
        // Сохраняем начальное состояние
        await saveLevelProgress(driverLevel);
      }
    } catch (error) {
      console.error('Ошибка при загрузке прогресса уровня:', error);
    }
  };

  const saveLevelProgress = async (progress: DriverLevel) => {
    try {
      await AsyncStorage.setItem(LEVEL_PROGRESS_KEY, JSON.stringify(progress));
      setDriverLevel(progress);
    } catch (error) {
      console.error('Ошибка при сохранении прогресса уровня:', error);
    }
  };

  // Функция для сброса данных (для тестирования)
  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem(LEVEL_PROGRESS_KEY);
      const initialLevel: DriverLevel = {
        currentLevel: 1,
        currentSubLevel: 1,
        currentProgress: 0,
        maxProgress: 40,
        title: 'Стартер',
        subLevelTitle: 'Стартер 1',
        icon: '🥉',
        nextReward: '+2 AFc',
        isRewardAvailable: false,
      };
      setDriverLevel(initialLevel);
      await saveLevelProgress(initialLevel);
      console.log('Progress reset to initial state');
    } catch (error) {
      console.error('Ошибка при сбросе прогресса:', error);
    }
  };

  // Функция для расчета уровня и подуровня на основе количества поездок
  const calculateLevelAndSubLevel = (totalRides: number) => {
    for (let level = 1; level <= 6; level++) {
      const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
      for (let subLevel = 0; subLevel < 3; subLevel++) {
        if (totalRides <= config.subLevels[subLevel]) {
          return {
            level,
            subLevel: subLevel + 1,
            maxProgress: config.subLevels[subLevel],
            title: config.title,
            subLevelTitle: `${config.title} ${subLevel + 1}`,
            icon: config.icon,
            nextReward: `+${LEVEL_BONUSES[level as keyof typeof LEVEL_BONUSES][subLevel]} AFc`,
          };
        }
      }
    }
    
    // Если превысил максимальный уровень
    return {
      level: 6,
      subLevel: 3,
      maxProgress: 4000,
      title: 'Император',
      subLevelTitle: 'Император 3',
      icon: '👑',
      nextReward: '+500 AFc',
    };
  };

  // Функция для увеличения прогресса на +1 при завершении поездки
  const incrementProgress = useCallback(async () => {
    const newProgress = driverLevel.currentProgress + 1;
    const newTotalRides = getTotalRidesForLevel(driverLevel.currentLevel, driverLevel.currentSubLevel, newProgress);
    
    // Рассчитываем новый уровень и подуровень
    const newLevelInfo = calculateLevelAndSubLevel(newTotalRides);
    
    // Проверяем, достигли ли следующего подуровня
    if (newLevelInfo.level !== driverLevel.currentLevel || newLevelInfo.subLevel !== driverLevel.currentSubLevel) {
      // Повышение уровня или подуровня
      const updatedLevel: DriverLevel = {
        currentLevel: newLevelInfo.level,
        currentSubLevel: newLevelInfo.subLevel,
        currentProgress: 0, // Сбрасываем прогресс для нового подуровня
        maxProgress: newLevelInfo.maxProgress,
        title: newLevelInfo.title,
        subLevelTitle: newLevelInfo.subLevelTitle,
        icon: newLevelInfo.icon,
        nextReward: newLevelInfo.nextReward,
        isRewardAvailable: true,
      };
      
      await saveLevelProgress(updatedLevel);
      
      // Сильный haptic feedback при повышении уровня
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Просто увеличиваем прогресс
      const updatedLevel: DriverLevel = {
        ...driverLevel,
        currentProgress: newProgress,
        isRewardAvailable: newProgress >= driverLevel.maxProgress,
      };
      
      await saveLevelProgress(updatedLevel);
      
      // Легкий haptic feedback при увеличении прогресса
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [driverLevel]);

  // Функция для получения общего количества поездок для уровня и подуровня
  const getTotalRidesForLevel = (level: number, subLevel: number, progress: number) => {
    if (level === 1) {
      return progress;
    }
    
    // Суммируем поездки всех предыдущих уровней
    let totalRides = 0;
    for (let l = 1; l < level; l++) {
      const config = LEVEL_CONFIG[l as keyof typeof LEVEL_CONFIG];
      totalRides += config.subLevels[2]; // Максимум предыдущего уровня
    }
    
    // Добавляем поездки текущего подуровня
    if (subLevel === 1) {
      totalRides += progress;
    } else {
      const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
      totalRides += config.subLevels[subLevel - 2] + progress;
    }
    
    return totalRides;
  };

  return {
    driverLevel,
    incrementProgress,
    resetProgress,
  };
};
