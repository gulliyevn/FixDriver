import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';

export const useEarningsState = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

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
  };
};
