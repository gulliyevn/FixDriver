import { useState, useRef } from 'react';
import { Animated } from 'react-native';

export const useEarningsState = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const filterExpandAnim = useRef(new Animated.Value(0)).current;

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
