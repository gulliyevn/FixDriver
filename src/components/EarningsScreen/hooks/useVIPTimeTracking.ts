import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VIP_CONFIG, calculateMonthlyVIPBonus } from '../types/levels.config';
import { useBalanceContext } from '../../../context/BalanceContext';
import DriverStatusService from '../../../services/DriverStatusService';

const VIP_TIME_KEY = '@driver_vip_time_tracking';

interface VIPTimeData {
  currentDay: string; // YYYY-MM-DD
  currentMonth: string; // YYYY-MM (для совместимости)
  hoursOnline: number; // Накопленные часы за текущий день
  ridesToday: number; // Количество поездок за текущий день
  qualifiedDaysThisMonth: number; // Кол-во VIP-дней (>=10ч онлайн и >=3 поездки) за текущий период
  consecutiveQualifiedMonths: number; // Кол-во 30-дневных периодов подряд с >=20 VIP-днями
  lastOnlineTime: number | null;
  isCurrentlyOnline: boolean;
  vipCycleStartDate: string | null; // Дата начала VIP статуса (YYYY-MM-DD)
  periodStartDate: string | null; // Дата начала текущего 30-дневного периода (YYYY-MM-DD)
  qualifiedDaysHistory: number[]; // История квалифицированных дней по 30-дневным периодам
}

const MIN_HOURS_PER_DAY = 10;

export const useVIPTimeTracking = (isVIP: boolean) => {
  const { addEarnings } = useBalanceContext();
  // Добавляем состояние для принудительного обновления
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  // Функция для получения локальной даты в формате YYYY-MM-DD
  const getLocalDateString = (date: Date = new Date()) => {
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
  };

  const [vipTimeData, setVipTimeData] = useState<VIPTimeData>({
    currentDay: getLocalDateString(),
    currentMonth: getLocalDateString().slice(0, 7),
    hoursOnline: 0,
    ridesToday: 0,
    qualifiedDaysThisMonth: 0,
    consecutiveQualifiedMonths: 0,
    lastOnlineTime: null,
    isCurrentlyOnline: false,
    vipCycleStartDate: null,
    periodStartDate: null,
    qualifiedDaysHistory: [],
  });

  // Подписка на изменения статуса через DriverStatusService
  useEffect(() => {
    const unsub = DriverStatusService.subscribe((online) => {
      // Принудительно обновляем состояние при изменении статуса
      setUpdateTrigger(prev => prev + 1);
    });
    return () => {
      unsub();
    };
  }, []);

  // Загружаем данные при инициализации (всегда), чтобы таймер не сбрасывался при рестарте
  useEffect(() => {
    loadVIPTimeData();
  }, []);

  // Инициализируем старт 30-дневного периода только при первом включении онлайн, если VIP и период ещё не установлен
  // useEffect удален - период устанавливается только в startOnlineTime

  // Вспомогательная: следующая локальная полуночь как YYYY-MM-DD
  const getNextLocalMidnightDate = () => {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.toISOString().split('T')[0];
  };

  // Проверка смены дня (для всех уровней: сброс суток; VIP: ещё и квалификация/бонусы)
  const performDayCheck = useCallback(() => {
      const now = new Date();
      // Используем локальную дату, а не UTC
      const today = now.getFullYear() + '-' + 
                   String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(now.getDate()).padStart(2, '0');
      const currentMonth = today.slice(0, 7);
      
      // Ежедневная проверка 360-дневного цикла: по истечении 360 дней от старта — полный сброс цикла
      if (vipTimeData.vipCycleStartDate) {
        const cycleStart = new Date(vipTimeData.vipCycleStartDate);
        const msInDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.floor((now.getTime() - cycleStart.getTime()) / msInDay);
        if (diffDays >= 360) {
          const nextPeriodStart = getNextLocalMidnightDate();
          const resetData: VIPTimeData = {
            ...vipTimeData,
            consecutiveQualifiedMonths: 0,
            vipCycleStartDate: null,
            qualifiedDaysHistory: [],
            qualifiedDaysThisMonth: 0,
            periodStartDate: nextPeriodStart,
          };
          setVipTimeData(resetData);
          saveVIPTimeData(resetData);
        }
      }

      if (today !== vipTimeData.currentDay) {
        // Завершение суток: учитываем текущую онлайновую сессию до 23:59:59 предыдущего дня
        let additionalHours = 0;
        if (vipTimeData.isCurrentlyOnline && vipTimeData.lastOnlineTime) {
          // Полночь предыдущего дня (начало текущего дня)
          const midnight = new Date();
          midnight.setHours(0, 0, 0, 0);
          
          // Если сессия началась вчера, считаем только время до полуночи
          if (vipTimeData.lastOnlineTime < midnight.getTime()) {
            const diffMs = midnight.getTime() - vipTimeData.lastOnlineTime;
            additionalHours = diffMs / (1000 * 60 * 60);
          }
        }

        const effectiveHours = vipTimeData.hoursOnline + additionalHours;
        const isQualifiedDay = effectiveHours >= MIN_HOURS_PER_DAY && vipTimeData.ridesToday >= VIP_CONFIG.minRidesPerDay;
        
        // logs removed in production

        // Если есть активная сессия, продолжаем ее в новый день
        let newSessionHours = 0;
        let newLastOnlineTime = null;
        
        if (vipTimeData.isCurrentlyOnline && vipTimeData.lastOnlineTime) {
          const midnight = new Date();
          midnight.setHours(0, 0, 0, 0);
          
          // Если сессия продолжается через полночь, считаем время с полуночи
          if (vipTimeData.lastOnlineTime < midnight.getTime()) {
            newLastOnlineTime = midnight.getTime(); // Начинаем считать с полуночи
            newSessionHours = (Date.now() - midnight.getTime()) / (1000 * 60 * 60);
          } else {
            // Сессия началась уже сегодня
            newLastOnlineTime = vipTimeData.lastOnlineTime;
            newSessionHours = (Date.now() - vipTimeData.lastOnlineTime) / (1000 * 60 * 60);
          }
        }

        const newData: VIPTimeData = {
          ...vipTimeData,
          currentDay: today,
          hoursOnline: newSessionHours,
          ridesToday: 0, // Поездки сбрасываются каждый день
          qualifiedDaysThisMonth: isVIP
            ? vipTimeData.qualifiedDaysThisMonth + (isQualifiedDay ? 1 : 0)
            : vipTimeData.qualifiedDaysThisMonth,
          lastOnlineTime: newLastOnlineTime,
        };

        setVipTimeData(newData);
        saveVIPTimeData(newData);
      }
      // Проверка завершения 30-дневного периода — только для VIP
      if (isVIP && vipTimeData.periodStartDate) {
        const periodStart = new Date(vipTimeData.periodStartDate);
        const msInDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.floor((now.getTime() - periodStart.getTime()) / msInDay);
        if (diffDays >= 30) {
          const qualifiedDays = vipTimeData.qualifiedDaysThisMonth;
          
          // Добавляем период в историю текущего цикла
          const newHistory = [...vipTimeData.qualifiedDaysHistory, qualifiedDays];

          // Месячный бонус за период
          const monthlyBonus = calculateMonthlyVIPBonus(qualifiedDays);
          if (monthlyBonus > 0) {
            addEarnings(monthlyBonus);
          }

          // Подсчитываем подряд идущие успешные периоды
          const metMonthlyRequirement = qualifiedDays >= VIP_CONFIG.minDaysPerMonth;
          let trailingQualified = 0;
          for (let i = newHistory.length - 1; i >= 0; i -= 1) {
            if (newHistory[i] >= VIP_CONFIG.minDaysPerMonth) trailingQualified += 1;
            else break;
          }

          // Квартальные бонусы на 3/6/12-м успешном периоде
          if (metMonthlyRequirement) {
            if (trailingQualified === 3) {
              addEarnings(VIP_CONFIG.quarterlyBonuses.months3);
            } else if (trailingQualified === 6) {
              addEarnings(VIP_CONFIG.quarterlyBonuses.months6);
            } else if (trailingQualified === 12) {
              addEarnings(VIP_CONFIG.quarterlyBonuses.months12);
            }
          }

          const nextPeriodStart = getNextLocalMidnightDate();
          // Решаем, нужно ли сбрасывать цикл: при провале месяца ИЛИ по завершении 12-го успешного месяца
          const shouldResetCycle = (!metMonthlyRequirement) || (trailingQualified === 12);

          const newData: VIPTimeData = shouldResetCycle
            ? {
                ...vipTimeData,
                currentMonth, // для совместимости
                qualifiedDaysThisMonth: 0,
                qualifiedDaysHistory: [], // новый цикл
                consecutiveQualifiedMonths: 0,
                vipCycleStartDate: null,
                periodStartDate: nextPeriodStart,
              }
            : {
                ...vipTimeData,
                currentMonth, // для совместимости
                qualifiedDaysThisMonth: 0,
                qualifiedDaysHistory: newHistory,
                consecutiveQualifiedMonths: trailingQualified,
                // Старт новой серии — ставим дату начала серии, если это первый успешный месяц
                vipCycleStartDate:
                  trailingQualified === 1
                    ? new Date(vipTimeData.currentMonth + '-01T00:00:00').toISOString().split('T')[0]
                    : vipTimeData.vipCycleStartDate,
                periodStartDate: nextPeriodStart,
              };
          setVipTimeData(newData);
          saveVIPTimeData(newData);
          
          // logs removed in production
        }
      }
    }, [isVIP, vipTimeData]);

  // Таймер: проверяем каждую минуту
  useEffect(() => {
    const interval = setInterval(performDayCheck, 60000);
    return () => clearInterval(interval);
  }, [performDayCheck]);

  // Обновляем состояние каждую секунду когда онлайн для корректного отображения таймера
  useEffect(() => {
    if (!vipTimeData.isCurrentlyOnline) return;
    
    const interval = setInterval(() => {
      // Принудительно обновляем состояние для пересчета getCurrentHoursOnline
      setVipTimeData(prev => ({ ...prev }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [vipTimeData.isCurrentlyOnline, updateTrigger]); // Добавляем updateTrigger в зависимости

  const loadVIPTimeData = async () => {
    try {
      const saved = await AsyncStorage.getItem(VIP_TIME_KEY);
      if (saved) {
        const parsed: VIPTimeData = JSON.parse(saved);
        // Кламп значений от мусора/старых версий
        parsed.qualifiedDaysThisMonth = Math.max(0, Math.min(30, parsed.qualifiedDaysThisMonth || 0));
        parsed.hoursOnline = Math.max(0, parsed.hoursOnline || 0);
        parsed.ridesToday = Math.max(0, parsed.ridesToday || 0);
        // Обеспечиваем совместимость с новыми полями
        parsed.qualifiedDaysHistory = parsed.qualifiedDaysHistory || [];
        setVipTimeData(parsed);
      } else {
        const initialData: VIPTimeData = {
          currentDay: getLocalDateString(),
          currentMonth: getLocalDateString().slice(0, 7),
          hoursOnline: 0,
          ridesToday: 0,
          qualifiedDaysThisMonth: 0,
          consecutiveQualifiedMonths: 0,
          lastOnlineTime: null,
          isCurrentlyOnline: false,
          vipCycleStartDate: null,
          periodStartDate: null,
          qualifiedDaysHistory: [],
        };
        setVipTimeData(initialData);
        await AsyncStorage.setItem(VIP_TIME_KEY, JSON.stringify(initialData));
      }
    } catch (error) {
      console.error('Ошибка при загрузке VIP времени:', error);
    }
  };

  const saveVIPTimeData = async (data: VIPTimeData) => {
    try {
      await AsyncStorage.setItem(VIP_TIME_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Ошибка при сохранении VIP времени:', error);
    }
  };

  const startOnlineTime = useCallback(() => {
    const now = Date.now();
    const newData: VIPTimeData = {
      ...vipTimeData,
      isCurrentlyOnline: true,
      lastOnlineTime: now,
      // Инициализируем старт периода в 00:00 следующего дня после первого включения онлайн
      periodStartDate: isVIP ? (vipTimeData.periodStartDate ?? getNextLocalMidnightDate()) : vipTimeData.periodStartDate,
    };
    
    setVipTimeData(newData);
    saveVIPTimeData(newData);
    // Дублируем статус в AsyncStorage, чтобы не терялся при рестарте
    AsyncStorage.setItem('@driver_online_status', 'true').catch(() => {});
    // Уведомляем DriverStatusService о изменении статуса
    DriverStatusService.setOnline(true);
  }, [isVIP, vipTimeData]);

  const stopOnlineTime = useCallback(() => {
    if (!vipTimeData.isCurrentlyOnline || !vipTimeData.lastOnlineTime) return;
    
    const now = Date.now();
    const hoursDiff = (now - vipTimeData.lastOnlineTime) / (1000 * 60 * 60);
    
    const newData: VIPTimeData = {
      ...vipTimeData,
      isCurrentlyOnline: false,
      hoursOnline: vipTimeData.hoursOnline + hoursDiff,
      lastOnlineTime: null,
    };
    
    setVipTimeData(newData);
    saveVIPTimeData(newData);
    // Дублируем статус в AsyncStorage, чтобы не терялся при рестарте
    AsyncStorage.setItem('@driver_online_status', 'false').catch(() => {});
    // Уведомляем DriverStatusService о изменении статуса
    DriverStatusService.setOnline(false);
  }, [vipTimeData]);

  const getCurrentHoursOnline = useCallback(() => {
    const now = Date.now();
    // Если сессия активна — считаем до текущего момента
    if (vipTimeData.isCurrentlyOnline && vipTimeData.lastOnlineTime) {
      const currentSessionHours = (now - vipTimeData.lastOnlineTime) / (1000 * 60 * 60);
      return vipTimeData.hoursOnline + currentSessionHours;
    }
    // Если сессия не активна — возвращаем накопленное
    return vipTimeData.hoursOnline;
  }, [vipTimeData.isCurrentlyOnline, vipTimeData.lastOnlineTime, vipTimeData.hoursOnline, updateTrigger]); // Добавляем updateTrigger

  const resetVIPTimeData = useCallback(async () => {
    const resetData: VIPTimeData = {
      currentDay: getLocalDateString(),
      currentMonth: getLocalDateString().slice(0, 7),
      hoursOnline: 0,
      ridesToday: 0,
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: 0,
      lastOnlineTime: null,
      isCurrentlyOnline: false,
      vipCycleStartDate: null,
      periodStartDate: null,
      qualifiedDaysHistory: [],
    };
    
    setVipTimeData(resetData);
    await saveVIPTimeData(resetData);
  }, []);

  // Регистрируем завершенную поездку для учёта VIP-дня
  const registerRide = useCallback(async () => {
    if (!isVIP) return;
    const newData: VIPTimeData = {
      ...vipTimeData,
      ridesToday: vipTimeData.ridesToday + 1,
    };
    setVipTimeData(newData);
    await saveVIPTimeData(newData);
  }, [isVIP, vipTimeData]);

  // Ручное добавление часов онлайн (для тестирования)
  const addManualOnlineHours = useCallback(async (hours: number) => {
    if (!isVIP || hours <= 0) return;
    const newData: VIPTimeData = {
      ...vipTimeData,
      hoursOnline: vipTimeData.hoursOnline + hours,
      isCurrentlyOnline: true,
      lastOnlineTime: Date.now(),
    };
    setVipTimeData(newData);
    await saveVIPTimeData(newData);
  }, [isVIP, vipTimeData]);

  // Симуляция смены дня (для тестирования)
  const simulateDayChange = useCallback(async () => {
    const isQualified = vipTimeData.hoursOnline >= MIN_HOURS_PER_DAY && vipTimeData.ridesToday >= VIP_CONFIG.minRidesPerDay;
    
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    
    const newData: VIPTimeData = {
      ...vipTimeData,
      currentDay: getLocalDateString(nextDay),
      hoursOnline: 0,
      ridesToday: 0,
      qualifiedDaysThisMonth: vipTimeData.qualifiedDaysThisMonth + (isQualified ? 1 : 0),
      lastOnlineTime: null,
      isCurrentlyOnline: false,
    };
    
    setVipTimeData(newData);
    await saveVIPTimeData(newData);
    return { isQualified, newQualifiedDays: newData.qualifiedDaysThisMonth };
  }, [isVIP, vipTimeData]);

  // Симуляция смены месяца (для тестирования)
  const simulateMonthChange = useCallback(async () => {
    const qualifiedDays = vipTimeData.qualifiedDaysThisMonth;
    
    // Рассчитываем месячный бонус
    let monthlyBonus = 0;
    if (qualifiedDays >= 30) monthlyBonus = VIP_CONFIG.monthlyBonuses.days30;
    else if (qualifiedDays >= 25) monthlyBonus = VIP_CONFIG.monthlyBonuses.days25;
    else if (qualifiedDays >= 20) monthlyBonus = VIP_CONFIG.monthlyBonuses.days20;
    
    // Обновляем счетчик последовательных месяцев
    const metMonthlyRequirement = qualifiedDays >= 20;
    const newConsecutive = metMonthlyRequirement ? vipTimeData.consecutiveQualifiedMonths + 1 : 0;
    
    // Рассчитываем квартальный бонус
    let quarterlyBonus = 0;
    if (metMonthlyRequirement) {
      if (newConsecutive === 3) quarterlyBonus = VIP_CONFIG.quarterlyBonuses.months3;
      else if (newConsecutive === 6) quarterlyBonus = VIP_CONFIG.quarterlyBonuses.months6;
      else if (newConsecutive === 12) quarterlyBonus = VIP_CONFIG.quarterlyBonuses.months12;
    }
    
    // Начисляем бонусы
    if (monthlyBonus > 0) {
      await addEarnings(monthlyBonus);
    }
    
    if (quarterlyBonus > 0) {
      await addEarnings(quarterlyBonus);
    }
    
    // Обновление даты начала цикла
    let newVipCycleStartDate = vipTimeData.vipCycleStartDate;
    if (metMonthlyRequirement) {
      if (newConsecutive === 1) {
        // Старт новой серии: считаем, что закончился первый успешный месяц
        const prevMonthDate = new Date(vipTimeData.currentMonth + '-01T00:00:00');
        newVipCycleStartDate = prevMonthDate.toISOString().split('T')[0];
      }
    } else {
      newVipCycleStartDate = null;
    }

    const newData: VIPTimeData = {
      ...vipTimeData,
      currentMonth: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      qualifiedDaysThisMonth: 0,
      consecutiveQualifiedMonths: newConsecutive,
      vipCycleStartDate: newVipCycleStartDate,
    };
    
    setVipTimeData(newData);
    await saveVIPTimeData(newData);
    
    return { monthlyBonus, quarterlyBonus, consecutiveMonths: newConsecutive };
  }, [isVIP, vipTimeData, addEarnings]);

  // Функция для получения истории квалифицированных дней для расчета VIP уровня
  const getQualifiedDaysHistory = useCallback((): number[] => {
    return vipTimeData.qualifiedDaysHistory;
  }, [vipTimeData.qualifiedDaysHistory]);

  // Проверка квалификации текущего дня (для отладки)
  const checkCurrentDayQualification = useCallback(() => {
    const currentHours = getCurrentHoursOnline();
    const ridesCount = vipTimeData.ridesToday;
    const isQualified = currentHours >= MIN_HOURS_PER_DAY && ridesCount >= VIP_CONFIG.minRidesPerDay;
    
    // logs removed in production
    
    return {
      hours: currentHours,
      rides: ridesCount,
      isQualified,
      day: vipTimeData.currentDay
    };
  }, [vipTimeData, getCurrentHoursOnline]);

  return {
    vipTimeData,
    startOnlineTime,
    stopOnlineTime,
    getCurrentHoursOnline,
    resetVIPTimeData,
    registerRide,
    addManualOnlineHours,
    simulateDayChange,
    simulateMonthChange,
    getQualifiedDaysHistory,
    checkCurrentDayQualification,
    // Для тестов/отладки: форсированная проверка смены дня
    forceDayCheck: performDayCheck,
  };
};
