import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VIP_TIME_KEY = '@driver_vip_time_tracking';

interface VIPTimeData {
  currentDay: string; // YYYY-MM-DD
  currentMonth: string; // YYYY-MM
  hoursOnline: number;
  daysOnline: number;
  lastOnlineTime: number | null;
  isCurrentlyOnline: boolean;
}

const MIN_HOURS_PER_DAY = 10;

export const useVIPTimeTracking = (isVIP: boolean) => {
  const [vipTimeData, setVipTimeData] = useState<VIPTimeData>({
    currentDay: new Date().toISOString().split('T')[0],
    currentMonth: new Date().toISOString().slice(0, 7),
    hoursOnline: 0,
    daysOnline: 0,
    lastOnlineTime: null,
    isCurrentlyOnline: false,
  });



  // Загружаем данные при инициализации
  useEffect(() => {
    if (isVIP) {
      loadVIPTimeData();
    } else {
      // Сбрасываем данные при отключении VIP
      setVipTimeData({
        currentDay: new Date().toISOString().split('T')[0],
        currentMonth: new Date().toISOString().slice(0, 7),
        hoursOnline: 0,
        daysOnline: 0,
        lastOnlineTime: null,
        isCurrentlyOnline: false,
      });
    }
  }, [isVIP]);

  // Проверяем смену дня каждый час
  useEffect(() => {
    if (!isVIP) return;

    const checkDayChange = () => {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      if (today !== vipTimeData.currentDay) {
        // Новый день - сбрасываем часы
        const newData = {
          ...vipTimeData,
          currentDay: today,
          hoursOnline: 0,
          lastOnlineTime: null,
        };
        
        // Если предыдущий день был активным (>= 10 часов), увеличиваем дни
        if (vipTimeData.hoursOnline >= MIN_HOURS_PER_DAY) {
          newData.daysOnline += 1;
        }
        
        setVipTimeData(newData);
        saveVIPTimeData(newData);
      }
      
      if (currentMonth !== vipTimeData.currentMonth) {
        // Новый месяц - сбрасываем дни
        const newData = {
          ...vipTimeData,
          currentMonth,
          daysOnline: 0,
        };
        setVipTimeData(newData);
        saveVIPTimeData(newData);
      }
    };

    const interval = setInterval(checkDayChange, 60000); // Проверяем каждую минуту
    return () => clearInterval(interval);
  }, [isVIP, vipTimeData]);

  const loadVIPTimeData = async () => {
    try {
      // Принудительно сбрасываем VIP время при запуске (для тестирования)
      await AsyncStorage.removeItem(VIP_TIME_KEY);
      const initialData: VIPTimeData = {
        currentDay: new Date().toISOString().split('T')[0],
        currentMonth: new Date().toISOString().slice(0, 7),
        hoursOnline: 0,
        daysOnline: 0,
        lastOnlineTime: null,
        isCurrentlyOnline: false,
      };
      setVipTimeData(initialData);
      console.log('⏰ VIP время сброшено при запуске');
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
    if (!isVIP) return;
    
    const now = Date.now();
    const newData = {
      ...vipTimeData,
      isCurrentlyOnline: true,
      lastOnlineTime: now,
    };
    
    setVipTimeData(newData);
    saveVIPTimeData(newData);
    console.log('VIP: Начало времени онлайн');
  }, [isVIP, vipTimeData]);

  const stopOnlineTime = useCallback(() => {
    if (!isVIP || !vipTimeData.isCurrentlyOnline || !vipTimeData.lastOnlineTime) return;
    
    const now = Date.now();
    const hoursDiff = (now - vipTimeData.lastOnlineTime) / (1000 * 60 * 60);
    
    const newData = {
      ...vipTimeData,
      isCurrentlyOnline: false,
      hoursOnline: vipTimeData.hoursOnline + hoursDiff,
      lastOnlineTime: null,
    };
    
    setVipTimeData(newData);
    saveVIPTimeData(newData);
    console.log(`VIP: Остановка времени онлайн. Добавлено часов: ${hoursDiff.toFixed(2)}`);
  }, [isVIP, vipTimeData]);

  const getCurrentHoursOnline = useCallback(() => {
    if (!isVIP || !vipTimeData.isCurrentlyOnline || !vipTimeData.lastOnlineTime) {
      return vipTimeData.hoursOnline;
    }
    
    const now = Date.now();
    const currentSessionHours = (now - vipTimeData.lastOnlineTime) / (1000 * 60 * 60);
    return vipTimeData.hoursOnline + currentSessionHours;
  }, [isVIP, vipTimeData]);

  const resetVIPTimeData = useCallback(async () => {
    const resetData: VIPTimeData = {
      currentDay: new Date().toISOString().split('T')[0],
      currentMonth: new Date().toISOString().slice(0, 7),
      hoursOnline: 0,
      daysOnline: 0,
      lastOnlineTime: null,
      isCurrentlyOnline: false,
    };
    
    setVipTimeData(resetData);
    await saveVIPTimeData(resetData);
    console.log('VIP: Данные времени сброшены');
  }, []);

  return {
    vipTimeData,
    startOnlineTime,
    stopOnlineTime,
    getCurrentHoursOnline,
    resetVIPTimeData,
  };
};
