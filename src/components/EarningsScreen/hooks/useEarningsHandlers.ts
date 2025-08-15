import { useCallback } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const useEarningsHandlers = (
  filterExpanded: boolean,
  setFilterExpanded: (expanded: boolean) => void,
  filterExpandAnim: Animated.Value,
  setSelectedPeriod: (period: 'today' | 'week' | 'month' | 'year') => void,
  setStatusModalVisible: (visible: boolean) => void,
  isOnline: boolean,
  setIsOnline: (online: boolean) => void
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

  const handlePeriodSelect = useCallback((period: 'today' | 'week' | 'month' | 'year') => {
    setSelectedPeriod(period);
  }, [setSelectedPeriod]);

  const handleStatusChange = useCallback(() => {
    setStatusModalVisible(true);
  }, [setStatusModalVisible]);

  const confirmStatusChange = useCallback(() => {
    setIsOnline(!isOnline);
    setStatusModalVisible(false);
  }, [isOnline, setIsOnline, setStatusModalVisible]);

  const handleBalancePress = useCallback(() => {
    try {
      // Переходим на таб профиля
      navigation.navigate('Profile' as any);
      
      setTimeout(() => {
        // Навигируем к экрану баланса внутри стека профиля
        (navigation as any).navigate('Profile', {
          screen: 'Balance'
        });
      }, 100);
    } catch (error) {
      console.warn('Balance navigation failed, falling back to Profile tab:', error);
      navigation.navigate('Profile' as any);
    }
  }, [navigation]);



  return {
    toggleFilter,
    handlePeriodSelect,
    handleStatusChange,
    confirmStatusChange,
    handleBalancePress,
  };
};
