import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { 
  LEVELS_CONFIG, 
  VIP_CONFIG, 
  getLevelConfig, 
  isVIPLevel,
  calculateMonthlyVIPBonus,
  calculateQuarterlyVIPBonus
} from '../types/levels.config';
import { useBalanceContext } from '../../../context/BalanceContext';
import { useI18n } from '../../../hooks/useI18n';

const LEVEL_PROGRESS_KEY = '@driver_level_progress';

export interface DriverLevel {
  currentLevel: number;
  currentSubLevel: number;
  currentProgress: number;
  maxProgress: number;
  title: string;
  subLevelTitle: string;
  icon: string;
  nextReward: string;
  isRewardAvailable: boolean;
  isVIP: boolean;
  vipDaysOnline: number;
  vipDaysRequired: number;
  vipStartDate?: string; // Дата начала VIP статуса
  vipLevel: number; // VIP уровень 1-12
}

export const useEarningsLevel = () => {
  const { addEarnings, loadBalance, loadEarnings } = useBalanceContext();
  const { t } = useI18n();
  
  const [driverLevel, setDriverLevel] = useState<DriverLevel>(() => {
    const config = getLevelConfig(1, 1);
    return {
      currentLevel: 1,
      currentSubLevel: 1,
      currentProgress: 0,
      maxProgress: config.maxProgress,
      title: config.levelKey,
      subLevelTitle: `${config.levelKey} 1`,
      icon: config.icon,
      nextReward: config.bonus.toString(),
      isRewardAvailable: false,
      isVIP: false,
      vipDaysOnline: 0,
      vipDaysRequired: VIP_CONFIG.minDaysPerMonth,
      vipLevel: 1,
    };
  });

  // Загружаем прогресс при инициализации
  useEffect(() => {
    loadLevelProgress();
  }, []);

  const loadLevelProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(LEVEL_PROGRESS_KEY);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setDriverLevel(progress);
      } else {
        // Инициализируем начальный уровень
        const initialLevel = createInitialLevel();
        setDriverLevel(initialLevel);
        await saveLevelProgress(initialLevel);
        
      }
    } catch (error) {
      
      const initialLevel = createInitialLevel();
      setDriverLevel(initialLevel);
    }
  };

  const createInitialLevel = (): DriverLevel => {
    const config = getLevelConfig(1, 1);
    return {
      currentLevel: 1,
      currentSubLevel: 1,
      currentProgress: 0,
      maxProgress: config.maxProgress,
      title: config.levelKey,
      subLevelTitle: `${config.levelKey} 1`,
      icon: config.icon,
      nextReward: config.bonus.toString(),
      isRewardAvailable: false,
      isVIP: false,
      vipDaysOnline: 0,
      vipDaysRequired: 30,
      vipLevel: 1,
    };
  };

  const saveLevelProgress = async (progress: DriverLevel) => {
    try {
      await AsyncStorage.setItem(LEVEL_PROGRESS_KEY, JSON.stringify(progress));
      setDriverLevel(progress);
      // Прогресс сохранен
    } catch (error) {
      
    }
  };

  // Функция для расчета VIP уровня на основе скользящего календаря
  const calculateVIPLevel = (vipStartDate: string, qualifiedDaysInPeriods: number[]): number => {
    const startDate = new Date(vipStartDate);
    const currentDate = new Date();
    const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Определяем количество завершенных 30-дневных периодов
    const completedPeriods = Math.floor(daysSinceStart / 30);
    
    // VIP уровень = 1 + количество завершенных периодов с минимум 20 днями
    let vipLevel = 1;
    
    for (let i = 0; i < completedPeriods && i < qualifiedDaysInPeriods.length; i++) {
      if (qualifiedDaysInPeriods[i] >= 20) {
        vipLevel++;
      } else {
        // Если не выполнил условия в каком-то периоде, сбрасываем прогресс
        break;
      }
    }
    
    // Максимум VIP 12
    return Math.min(vipLevel, 12);
  };

  // Принудительно активировать VIP уровень
  const activateVIPLevel = useCallback(async () => {
    const currentDate = new Date().toISOString();
    const updatedLevel: DriverLevel = {
      currentLevel: 7,
      currentSubLevel: 1,
      currentProgress: 0,
      maxProgress: VIP_CONFIG.minDaysPerMonth,
      title: 'vip',
      subLevelTitle: 'VIP 1',
      icon: VIP_CONFIG.icon,
      nextReward: VIP_CONFIG.monthlyBonuses.days20.toString(),
      isRewardAvailable: false,
      isVIP: true,
      vipDaysOnline: 0,
      vipDaysRequired: VIP_CONFIG.minDaysPerMonth,
      vipStartDate: currentDate,
      vipLevel: 1,
    };
    await saveLevelProgress(updatedLevel);
  }, []);

  // Функция для сброса данных (для тестирования)
  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem(LEVEL_PROGRESS_KEY);
      const initialLevel = createInitialLevel();
      setDriverLevel(initialLevel);
      await saveLevelProgress(initialLevel);
      
    } catch (error) {
      
    }
  };

  // Функция для расчета общего количества поездок
  const getTotalRidesForLevel = (level: number, subLevel: number, progress: number): number => {
    let totalRides = 0;
    
    // Суммируем поездки из предыдущих уровней
    for (let l = 1; l < level; l++) {
      for (let s = 1; s <= 3; s++) {
        const config = getLevelConfig(l, s);
        totalRides += config.maxProgress;
      }
    }
    
    // Добавляем поездки из предыдущих подуровней текущего уровня
    for (let s = 1; s < subLevel; s++) {
      const config = getLevelConfig(level, s);
      totalRides += config.maxProgress;
    }
    
    // Добавляем прогресс в текущем подуровне
    totalRides += progress;
    
    return totalRides;
  };

  // Функция для расчета уровня и подуровня на основе количества поездок
  const calculateLevelAndSubLevel = (totalRides: number) => {
    
    
    // Проверяем VIP статус (4320+ поездок)
    if (isVIPLevel(totalRides)) {
      
      // При первом достижении VIP, устанавливаем VIP 1
      // Дальнейшие расчеты VIP уровня происходят через calculateVIPLevel
      return {
        level: 7, // VIP уровень
        subLevel: 1,
        maxProgress: VIP_CONFIG.minDaysPerMonth,
        title: 'vip',
        subLevelTitle: 'VIP 1',
        icon: VIP_CONFIG.icon,
        nextReward: VIP_CONFIG.monthlyBonuses.days20.toString(),
      };
    }
    
    // Определяем уровень и подуровень по общему количеству поездок
    let accumulatedRides = 0;
    
    for (let level = 1; level <= 6; level++) {
      for (let subLevel = 1; subLevel <= 3; subLevel++) {
        const config = getLevelConfig(level, subLevel);
        const ridesInThisSubLevel = config.maxProgress;
        
        if (totalRides <= accumulatedRides + ridesInThisSubLevel) {
          // Нашли нужный подуровень
          const progressInSubLevel = totalRides - accumulatedRides;
          
          
          
          return {
            level,
            subLevel,
            maxProgress: ridesInThisSubLevel,
            title: config.levelKey,
            subLevelTitle: `${config.levelKey} ${subLevel}`,
            icon: config.icon,
            nextReward: config.bonus.toString(),
          };
        }
        
        accumulatedRides += ridesInThisSubLevel;
      }
    }
    
    // Если превысил максимальный уровень
    
    const maxConfig = getLevelConfig(6, 3);
    return {
      level: 6,
      subLevel: 3,
      maxProgress: maxConfig.maxProgress,
      title: maxConfig.levelKey,
      subLevelTitle: `${maxConfig.levelKey} 3`,
      icon: maxConfig.icon,
      nextReward: maxConfig.bonus.toString(),
    };
  };

  // Функция для увеличения прогресса на +1 при завершении поездки
  const incrementProgress = useCallback(async () => {
    // Увеличиваем общее количество поездок на 1
    const currentTotalRides = getTotalRidesForLevel(driverLevel.currentLevel, driverLevel.currentSubLevel, driverLevel.currentProgress);
    const newTotalRides = currentTotalRides + 1;
    
    // Рассчитываем новый уровень и подуровень
    const newLevelInfo = calculateLevelAndSubLevel(newTotalRides);
    
    // Проверяем, изменился ли уровень или подуровень
    const isLevelUp = newLevelInfo.level !== driverLevel.currentLevel || newLevelInfo.subLevel !== driverLevel.currentSubLevel;
    
    if (isLevelUp) {
      // Получаем информацию о бонусе за завершенный уровень
      const completedLevelConfig = getLevelConfig(driverLevel.currentLevel, driverLevel.currentSubLevel);
      const bonusAmount = completedLevelConfig.bonus;
      
      // Сильный haptic feedback при повышении уровня
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        // Игнорируем ошибки haptics
      }
      
      // Обновляем уровень
      const isNewVIP = newLevelInfo.level === 7 && !driverLevel.isVIP;
      const updatedLevel: DriverLevel = {
        currentLevel: newLevelInfo.level,
        currentSubLevel: newLevelInfo.subLevel,
        currentProgress: 0, // Прогресс обнуляется при смене подуровня
        maxProgress: newLevelInfo.maxProgress,
        title: newLevelInfo.title,
        subLevelTitle: newLevelInfo.subLevelTitle,
        icon: newLevelInfo.icon,
        nextReward: newLevelInfo.nextReward,
        isRewardAvailable: false,
        isVIP: newLevelInfo.level === 7,
        vipDaysOnline: driverLevel.vipDaysOnline,
        vipDaysRequired: VIP_CONFIG.minDaysPerMonth,
        vipStartDate: isNewVIP ? new Date().toISOString() : driverLevel.vipStartDate,
        vipLevel: isNewVIP ? 1 : driverLevel.vipLevel,
      };
      
      await saveLevelProgress(updatedLevel);
      
      // Возвращаем информацию о бонусе для начисления в основном экране
      return { 
        hasLevelUp: true,
        bonusAmount: bonusAmount,
        completedLevel: driverLevel.currentLevel,
        completedSubLevel: driverLevel.currentSubLevel
      };
    } else {
      // Обычный прогресс в рамках текущего подуровня
      const newProgress = driverLevel.currentProgress + 1;
      
      // Обновляем прогресс без начисления бонуса
      const updatedLevel: DriverLevel = {
        ...driverLevel,
        currentProgress: newProgress,
      };
      
      await saveLevelProgress(updatedLevel);
      
      // Возвращаем undefined для обычного прогресса
      return undefined;
    }
  }, [driverLevel, addEarnings]);

  // Функция для обновления VIP уровня на основе выполненных периодов
  const updateVIPLevel = useCallback(async (qualifiedDaysInPeriods: number[]) => {
    if (!driverLevel.isVIP || !driverLevel.vipStartDate) {
      return;
    }

    const newVipLevel = calculateVIPLevel(driverLevel.vipStartDate, qualifiedDaysInPeriods);
    
    if (newVipLevel !== driverLevel.vipLevel) {
      const updatedLevel: DriverLevel = {
        ...driverLevel,
        vipLevel: newVipLevel,
        subLevelTitle: `VIP ${newVipLevel}`,
      };
      
      await saveLevelProgress(updatedLevel);
      
    }
  }, [driverLevel, calculateVIPLevel]);

  // Функция для добавления нескольких поездок (для тестирования)
  const addRides = useCallback(async (count: number) => {
    for (let i = 0; i < count; i++) {
      await incrementProgress();
    }
  }, [incrementProgress]);

  return {
    driverLevel,
    incrementProgress,
    activateVIPLevel,
    updateVIPLevel,
    addRides,
    resetProgress,
    getTotalRidesForLevel,
  };
};
