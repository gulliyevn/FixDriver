import { useMemo } from 'react';
import { DriverLevel } from '../types/earningsLevel.types';

export const useEarningsLevel = () => {
  const driverLevel: DriverLevel = useMemo(() => ({
    currentLevel: 3,
    currentProgress: 18,
    maxProgress: 25,
    title: 'Опытный водитель',
    nextReward: '+25 AFc',
    isRewardAvailable: false,
  }), []);

  return {
    driverLevel,
  };
};
