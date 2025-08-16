import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { DriverLevel, LEVEL_CONFIG, LEVEL_BONUSES, VIP_CONFIG } from '../types/earningsLevel.types';
import { generateRandomTrip } from '../../../constants/tripPricing';
import { useBalance } from '../../../hooks/useBalance';

const LEVEL_PROGRESS_KEY = '@driver_level_progress';

export const useEarningsLevel = () => {
  const { topUpBalance } = useBalance() as any;
  
  const [driverLevel, setDriverLevel] = useState<DriverLevel>({
    currentLevel: 1,
    currentSubLevel: 1,
    currentProgress: 0,
    maxProgress: 40,
    title: 'Стартер',
    subLevelTitle: 'Стартер 1',
    icon: '🥉',
    nextReward: '2',
    isRewardAvailable: false,
    isVIP: false,
    vipDaysOnline: 0,
    vipDaysRequired: 30,
  });

  // Загружаем прогресс при инициализации
  useEffect(() => {
    loadLevelProgress();
  }, []);

  const loadLevelProgress = async () => {
    try {
      // Принудительно сбрасываем прогресс при запуске
      await AsyncStorage.removeItem(LEVEL_PROGRESS_KEY);
      const initialLevel: DriverLevel = {
        currentLevel: 1,
        currentSubLevel: 1,
        currentProgress: 0,
        maxProgress: 40,
        title: 'Стартер',
        subLevelTitle: 'Стартер 1',
        icon: '🥉',
        nextReward: '2',
        isRewardAvailable: false,
        isVIP: false,
        vipDaysOnline: 0,
        vipDaysRequired: 30,
      };
      setDriverLevel(initialLevel);
      await saveLevelProgress(initialLevel);
    } catch (error) {
      console.error('Ошибка при загрузке прогресса уровня:', error);
      const initialLevel: DriverLevel = {
        currentLevel: 1,
        currentSubLevel: 1,
        currentProgress: 0,
        maxProgress: 40,
        title: 'Стартер',
        subLevelTitle: 'Стартер 1',
        icon: '🥉',
        nextReward: '2',
        isRewardAvailable: false,
        isVIP: false,
        vipDaysOnline: 0,
        vipDaysRequired: 30,
      };
      setDriverLevel(initialLevel);
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
        nextReward: '2',
        isRewardAvailable: false,
        isVIP: false,
        vipDaysOnline: 0,
        vipDaysRequired: 30,
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
    console.log('🔴 calculateLevelAndSubLevel - Всего поездок:', totalRides);
    
    // Проверяем VIP статус (4000+ поездок)
    if (totalRides >= VIP_CONFIG.minRides) {
      console.log('🔴 VIP уровень');
      return {
        level: 7, // VIP уровень
        subLevel: 1,
        maxProgress: VIP_CONFIG.daysRequired,
        title: VIP_CONFIG.title,
        subLevelTitle: VIP_CONFIG.title,
        icon: VIP_CONFIG.icon,
        nextReward: `${VIP_CONFIG.monthlyBonuses[20]}`, // Базовый VIP бонус
      };
    }
    
    let accumulatedRides = 0;
    
    for (let level = 1; level <= 6; level++) {
      const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
      console.log('🔴 Проверяем уровень', level, '-', config.title);
      
      for (let subLevel = 0; subLevel < 3; subLevel++) {
        const subLevelRides = config.subLevels[subLevel];
        const previousRides = accumulatedRides;
        accumulatedRides += subLevelRides;
        
        console.log('🔴 Подуровень', subLevel + 1, '- диапазон:', previousRides + 1, 'до', accumulatedRides, 'поездок');
        
        if (totalRides <= accumulatedRides) {
          const progressInSubLevel = totalRides - previousRides;
          console.log('🔴 НАЙДЕН УРОВЕНЬ:', level, subLevel + 1, config.title);
          console.log('🔴 Прогресс в подуровне:', progressInSubLevel, '/', subLevelRides);
          
          return {
            level,
            subLevel: subLevel + 1,
            maxProgress: subLevelRides,
            title: config.title,
            subLevelTitle: `${config.title} ${subLevel + 1}`,
            icon: config.icon,
            nextReward: `${LEVEL_BONUSES[level as keyof typeof LEVEL_BONUSES][subLevel]}`,
          };
        }
      }
    }
    
    // Если превысил максимальный уровень
    console.log('🔴 Максимальный уровень - Император 3');
    return {
      level: 6,
      subLevel: 3,
      maxProgress: 4000,
      title: 'Император',
      subLevelTitle: 'Император 3',
      icon: '👑',
      nextReward: '500',
    };
  };

  // Функция для увеличения прогресса на +1 при завершении поездки
  const incrementProgress = useCallback(async () => {
    const newProgress = driverLevel.currentProgress + 1;
    const newTotalRides = getTotalRidesForLevel(driverLevel.currentLevel, driverLevel.currentSubLevel, newProgress);
    
    // Рассчитываем новый уровень и подуровень
    const newLevelInfo = calculateLevelAndSubLevel(newTotalRides);
    
    // Рассчитываем правильный прогресс для нового подуровня
    let correctProgress = newProgress;
    if (newLevelInfo.level !== driverLevel.currentLevel || newLevelInfo.subLevel !== driverLevel.currentSubLevel) {
      // Если уровень изменился, нужно пересчитать прогресс
      let accumulatedRides = 0;
      
      // Суммируем поездки всех предыдущих уровней
      for (let l = 1; l < newLevelInfo.level; l++) {
        const config = LEVEL_CONFIG[l as keyof typeof LEVEL_CONFIG];
        accumulatedRides += config.subLevels[2]; // Максимум предыдущего уровня
      }
      
      // Добавляем поездки текущего уровня до текущего подуровня
      const currentConfig = LEVEL_CONFIG[newLevelInfo.level as keyof typeof LEVEL_CONFIG];
      for (let s = 0; s < newLevelInfo.subLevel - 1; s++) {
        accumulatedRides += currentConfig.subLevels[s];
      }
      
      // Прогресс в текущем подуровне
      correctProgress = newTotalRides - accumulatedRides;
    }
    
    // Проверяем, достигли ли следующего подуровня
    if (newLevelInfo.level !== driverLevel.currentLevel || newLevelInfo.subLevel !== driverLevel.currentSubLevel) {
      // Повышение уровня или подуровня
      const updatedLevel: DriverLevel = {
        currentLevel: newLevelInfo.level,
        currentSubLevel: newLevelInfo.subLevel,
        currentProgress: correctProgress, // Используем правильный прогресс
        maxProgress: newLevelInfo.maxProgress,
        title: newLevelInfo.title,
        subLevelTitle: newLevelInfo.subLevelTitle,
        icon: newLevelInfo.icon,
        nextReward: newLevelInfo.nextReward,
        isRewardAvailable: true,
        isVIP: newLevelInfo.level >= 7,
        vipDaysOnline: driverLevel.vipDaysOnline,
        vipDaysRequired: 30,
      };
      
      await saveLevelProgress(updatedLevel);
      
      // Сильный haptic feedback при повышении уровня
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Просто увеличиваем прогресс
      const updatedLevel: DriverLevel = {
        ...driverLevel,
        currentProgress: correctProgress,
        isRewardAvailable: correctProgress >= driverLevel.maxProgress,
      };
      
      await saveLevelProgress(updatedLevel);
      
      // Легкий haptic feedback при увеличении прогресса
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [driverLevel]);

  // Функция для добавления нескольких поездок (для тестирования)
  const addRides = useCallback(async (count: number) => {
    console.log('🔴 НАЧАЛО addRides - Текущий уровень:', driverLevel.title, driverLevel.currentSubLevel);
    console.log('🔴 Текущий прогресс:', driverLevel.currentProgress, '/', driverLevel.maxProgress);
    
    let currentLevel = { ...driverLevel };
    let totalEarnings = 0; // Сумма заработка за все поездки
    
    for (let i = 0; i < count; i++) {
      console.log(`\n🔄 ИТЕРАЦИЯ ${i + 1}/${count}`);
      console.log('🔴 До поездки - Уровень:', currentLevel.title, currentLevel.currentSubLevel);
      console.log('🔴 До поездки - Прогресс:', currentLevel.currentProgress, '/', currentLevel.maxProgress);
      
      // Генерируем случайную поездку с реальной стоимостью
      const trip = generateRandomTrip(currentLevel.currentLevel, 4.8);
      console.log('🔴 Стоимость поездки:', trip.price, 'AFc');
      
      // Суммируем стоимость поездки (но пока не добавляем к балансу)
      totalEarnings += trip.price;
      console.log('🔴 Накоплено:', totalEarnings, 'AFc');
      
      const newProgress = currentLevel.currentProgress + 1;
      const newTotalRides = getTotalRidesForLevel(currentLevel.currentLevel, currentLevel.currentSubLevel, newProgress);
      console.log('🔴 Новый прогресс:', newProgress);
      console.log('🔴 Всего поездок:', newTotalRides);
      
      // Рассчитываем новый уровень и подуровень
      const newLevelInfo = calculateLevelAndSubLevel(newTotalRides);
      console.log('🔴 Новый уровень:', newLevelInfo.level, newLevelInfo.subLevel, newLevelInfo.title);
      console.log('🔴 Новый бонус:', newLevelInfo.nextReward);
      
      // Рассчитываем правильный прогресс для нового подуровня
      let correctProgress = newProgress;
      if (newLevelInfo.level !== currentLevel.currentLevel || newLevelInfo.subLevel !== currentLevel.currentSubLevel) {
        // Если уровень изменился, нужно пересчитать прогресс
        let accumulatedRides = 0;
        
        // Суммируем поездки всех предыдущих уровней
        for (let l = 1; l < newLevelInfo.level; l++) {
          const config = LEVEL_CONFIG[l as keyof typeof LEVEL_CONFIG];
          accumulatedRides += config.subLevels[2]; // Максимум предыдущего уровня
        }
        
        // Добавляем поездки текущего уровня до текущего подуровня
        const currentConfig = LEVEL_CONFIG[newLevelInfo.level as keyof typeof LEVEL_CONFIG];
        for (let s = 0; s < newLevelInfo.subLevel - 1; s++) {
          accumulatedRides += currentConfig.subLevels[s];
        }
        
        // Прогресс в текущем подуровне
        correctProgress = newTotalRides - accumulatedRides;
        console.log('🔴 Правильный прогресс для нового подуровня:', correctProgress);
      }
      
      // Проверяем, достигли ли следующего подуровня
      const isLevelUp = newLevelInfo.level !== currentLevel.currentLevel || newLevelInfo.subLevel !== currentLevel.currentSubLevel;
      console.log('🔴 Повышение уровня:', isLevelUp ? 'ДА' : 'НЕТ');
      
      if (isLevelUp) {
        console.log('🔴 ПОВЫШЕНИЕ УРОВНЯ!');
        // Повышение уровня или подуровня
        const updatedLevel: DriverLevel = {
          currentLevel: newLevelInfo.level,
          currentSubLevel: newLevelInfo.subLevel,
          currentProgress: correctProgress, // Используем правильный прогресс
          maxProgress: newLevelInfo.maxProgress,
          title: newLevelInfo.title,
          subLevelTitle: newLevelInfo.subLevelTitle,
          icon: newLevelInfo.icon,
          nextReward: newLevelInfo.nextReward,
          isRewardAvailable: true,
          isVIP: newLevelInfo.level >= 7,
          vipDaysOnline: currentLevel.vipDaysOnline,
          vipDaysRequired: 30,
        };
        
        console.log('🔴 Сохраняем новый уровень...');
        await saveLevelProgress(updatedLevel);
        currentLevel = updatedLevel; // Обновляем локальную копию
        console.log('🔴 Уровень сохранен:', currentLevel.title, currentLevel.currentSubLevel);
        
        // Начисляем бонус за повышение уровня
        const bonusAmount = parseInt(newLevelInfo.nextReward);
        console.log('🔴 Начисляем бонус:', bonusAmount, 'AFc');
        await topUpBalance(bonusAmount);
        
        // Сильный haptic feedback при повышении уровня
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        console.log(`🚗 Поездка ${i + 1}: +${trip.price} AFc | Уровень: ${newLevelInfo.title} ${newLevelInfo.subLevel} | Бонус: +${bonusAmount} AFc`);
      } else {
        console.log('🔴 Обычный прогресс');
        // Просто увеличиваем прогресс
        const updatedLevel: DriverLevel = {
          ...currentLevel,
          currentProgress: correctProgress,
          isRewardAvailable: correctProgress >= currentLevel.maxProgress,
        };
        
        console.log('🔴 Сохраняем прогресс...');
        await saveLevelProgress(updatedLevel);
        currentLevel = updatedLevel; // Обновляем локальную копию
        console.log('🔴 Прогресс сохранен:', currentLevel.currentProgress, '/', currentLevel.maxProgress);
        
        // Легкий haptic feedback при увеличении прогресса
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        console.log(`🚗 Поездка ${i + 1}: +${trip.price} AFc | Прогресс: ${correctProgress}/${currentLevel.maxProgress}`);
      }
    }
    
    // Добавляем общую сумму заработка к балансу
    console.log('🔴 Добавляем к балансу:', totalEarnings, 'AFc');
    await topUpBalance(totalEarnings);
    console.log(`💰 Общий заработок за ${count} поездок: +${totalEarnings} AFc`);
    
    // Обновляем глобальное состояние driverLevel
    console.log('🔴 Обновляем глобальное состояние...');
    setDriverLevel(currentLevel);
    
    // Принудительно сохраняем финальное состояние
    await saveLevelProgress(currentLevel);
    
    console.log('🔴 КОНЕЦ addRides - Финальный уровень:', currentLevel.title, currentLevel.currentSubLevel);
    console.log('🔴 КОНЕЦ addRides - Финальный прогресс:', currentLevel.currentProgress, '/', currentLevel.maxProgress);
    console.log('🔴 КОНЕЦ addRides - Финальный бонус:', currentLevel.nextReward);
  }, [driverLevel, topUpBalance, setDriverLevel]);

  // Функция для получения общего количества поездок для уровня и подуровня
  const getTotalRidesForLevel = (level: number, subLevel: number, progress: number) => {
    console.log('🔴 getTotalRidesForLevel - Вход:', level, subLevel, progress);
    
    let totalRides = 0;
    
    // Суммируем поездки всех предыдущих уровней
    for (let l = 1; l < level; l++) {
      const config = LEVEL_CONFIG[l as keyof typeof LEVEL_CONFIG];
      const maxForLevel = config.subLevels[2]; // Максимум предыдущего уровня
      totalRides += maxForLevel;
      console.log('🔴 Уровень', l, '- добавляем:', maxForLevel, '=', totalRides);
    }
    
    // Добавляем поездки текущего уровня до текущего подуровня
    const currentConfig = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
    for (let s = 0; s < subLevel - 1; s++) {
      totalRides += currentConfig.subLevels[s];
      console.log('🔴 Подуровень', s + 1, '- добавляем:', currentConfig.subLevels[s], '=', totalRides);
    }
    
    // Добавляем текущий прогресс
    totalRides += progress;
    console.log('🔴 Текущий прогресс - добавляем:', progress, '=', totalRides);
    
    console.log('🔴 getTotalRidesForLevel - Итого:', totalRides);
    return totalRides;
  };

  // Временная функция для тестирования VIP системы
  const testVIPStatus = async () => {
    const vipTestLevel: DriverLevel = {
      currentLevel: 7,
      currentSubLevel: 1,
      currentProgress: 0,
      maxProgress: 30,
      title: 'VIP',
      subLevelTitle: 'VIP',
      icon: '💎',
      nextReward: '50',
      isRewardAvailable: false,
      isVIP: true,
      vipDaysOnline: 15,
      vipDaysRequired: 30,
    };
    
    await saveLevelProgress(vipTestLevel);
    console.log('VIP status test applied - nextReward:', vipTestLevel.nextReward);
  };

  // Функция для полной очистки данных (для тестирования)
  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem(LEVEL_PROGRESS_KEY);
      const cleanLevel: DriverLevel = {
        currentLevel: 1,
        currentSubLevel: 1,
        currentProgress: 0,
        maxProgress: 40,
        title: 'Стартер',
        subLevelTitle: 'Стартер 1',
        icon: '🥉',
        nextReward: '2',
        isRewardAvailable: false,
        isVIP: false,
        vipDaysOnline: 0,
        vipDaysRequired: 30,
      };
      setDriverLevel(cleanLevel);
      await saveLevelProgress(cleanLevel);
      
      console.log('All data cleared and reset to clean state');
    } catch (error) {
      console.error('Ошибка при очистке данных:', error);
    }
  };

  return {
    driverLevel,
    incrementProgress,
    addRides,
    resetProgress,
    testVIPStatus,
    clearAllData,
  };
};
