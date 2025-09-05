import { useState, useRef, useEffect } from 'react';
import { driverStatusService } from '../../../../../data/datasources/grpc/DriverStatusService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';

export const useEarningsState = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  // Добавляем состояние для принудительного обновления UI
  const [uiUpdateTrigger, setUiUpdateTrigger] = useState(0);

  const filterExpandAnim = useRef(new Animated.Value(0)).current;

  // Инициализируем статус онлайн из AsyncStorage, чтобы не сбрасывался при рестарте
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('@driver_online_status');
        if (saved === 'true' || saved === 'false') {
          setIsOnline(saved === 'true');
        }
      } catch {}
    })();
  }, []);

  // Подписка на глобальные изменения статуса (из DriverModal)
  useEffect(() => {
    const unsub = driverStatusService.subscribe((online) => {
      setIsOnline(online);
      setUiUpdateTrigger(prev => prev + 1);
    });

    return unsub;
  }, []);

  return {
    selectedPeriod,
    setSelectedPeriod,
    filterExpanded,
    setFilterExpanded,
    isOnline,
    setIsOnline,
    statusModalVisible,
    setStatusModalVisible,
    filterExpandAnim,
    uiUpdateTrigger,
  };
};
