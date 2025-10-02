import React, { createContext, useContext, ReactNode } from 'react';
import { useEarningsLevel } from '../components/EarningsScreen/hooks/useEarningsLevel';

interface LevelUpResult {
  hasLevelUp: boolean;
  bonusAmount: number;
  completedLevel: number;
  completedSubLevel: number;
}

interface LevelProgressContextType {
  driverLevel: any;
  incrementProgress: () => Promise<LevelUpResult | undefined>;
  activateVIPLevel: () => Promise<void>;
  addRides: (count: number) => Promise<void>;
  resetProgress: () => Promise<void>;
  getTotalRidesForLevel: (level: number, subLevel: number, progress: number) => number;
  updateVIPLevel: (qualifiedDaysInPeriods: number[]) => Promise<void>;
}

const LevelProgressContext = createContext<LevelProgressContextType | undefined>(undefined);

export const useLevelProgress = (): LevelProgressContextType => {
  const context = useContext(LevelProgressContext);
  if (!context) {
    console.error('useLevelProgress must be used within a LevelProgressProvider'); return;
  }
  return context;
};

interface LevelProgressProviderProps {
  children: ReactNode;
}

export const LevelProgressProvider: React.FC<LevelProgressProviderProps> = ({ children }) => {
  const { driverLevel, incrementProgress, activateVIPLevel, addRides, resetProgress, getTotalRidesForLevel, updateVIPLevel } = useEarningsLevel();

  const value: LevelProgressContextType = {
    driverLevel,
    incrementProgress,
    activateVIPLevel,
    addRides,
    resetProgress,
    getTotalRidesForLevel,
    updateVIPLevel,
  };

  return (
    <LevelProgressContext.Provider value={value}>
      {children}
    </LevelProgressContext.Provider>
  );
};
