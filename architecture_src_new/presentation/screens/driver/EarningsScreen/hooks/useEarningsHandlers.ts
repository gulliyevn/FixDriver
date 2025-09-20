import { useCallback } from 'react';
import { driverStatusService } from '../../../../../data/datasources/grpc/DriverStatusService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useEarningsHandlers = (
  filterExpanded: boolean,
  setFilterExpanded: (expanded: boolean) => void,
  filterExpandAnim: Animated.Value,
  setSelectedPeriod: (period: 'today' | 'week' | 'month' | 'year') => void,
  setStatusModalVisible: (visible: boolean) => void,
  isOnline: boolean,
  setIsOnline: (online: boolean) => void,
  startOnlineTime?: () => void,
  stopOnlineTime?: () => void
) => {
  const navigation = useNavigation<any>();

  const toggleFilter = useCallback(() => {
    const toValue = filterExpanded ? 0 : 1;
    setFilterExpanded(!filterExpanded);
    
    Animated.timing(filterExpandAnim, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [filterExpanded, filterExpandAnim, setFilterExpanded]);

  const handlePeriodChange = useCallback((period: 'today' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
  }, [setSelectedPeriod]);

  const handleStatusToggle = useCallback(async () => {
    try {
      const newStatus = !isOnline;
      await driverStatusService.setOnlineStatus('driver_id', newStatus);
      setIsOnline(newStatus);
      
      // Сохраняем статус в AsyncStorage
      await AsyncStorage.setItem('@driver_online_status', newStatus.toString());
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  }, [isOnline, setIsOnline]);

  const handleStatusModalToggle = useCallback(() => {
    setStatusModalVisible(true);
  }, [setStatusModalVisible]);

  const handleFilterToggle = useCallback(() => {
    toggleFilter();
  }, [toggleFilter]);

  const confirmStatusChange = useCallback(async () => {
    try {
      const newStatus = !isOnline;
      await driverStatusService.setOnlineStatus('driver_id', newStatus);
      setIsOnline(newStatus);
      
      // Сохраняем статус в AsyncStorage
      await AsyncStorage.setItem('@driver_online_status', newStatus.toString());
      
      // Вызываем соответствующие функции времени
      if (newStatus && startOnlineTime) {
        startOnlineTime();
      } else if (!newStatus && stopOnlineTime) {
        stopOnlineTime();
      }
    } catch (error) {
      console.error('Error confirming status change:', error);
    }
  }, [isOnline, setIsOnline, startOnlineTime, stopOnlineTime]);

  return {
    handlePeriodChange,
    handleStatusToggle,
    handleFilterToggle,
    handleStatusModalToggle,
    confirmStatusChange,
  };
};
