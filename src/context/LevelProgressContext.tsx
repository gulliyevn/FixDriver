import React, { createContext, useContext, ReactNode } from 'react';
import { useEarningsLevel } from '../components/EarningsScreen/hooks/useEarningsLevel';

interface LevelProgressContextType {
  driverLevel: any;
  incrementProgress: () => Promise<void>;
  addRides: (count: number) => Promise<void>;
  resetProgress: () => Promise<void>;
  testVIPStatus: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const LevelProgressContext = createContext<LevelProgressContextType | undefined>(undefined);

export const useLevelProgress = (): LevelProgressContextType => {
  const context = useContext(LevelProgressContext);
  if (!context) {
    throw new Error('useLevelProgress must be used within a LevelProgressProvider');
  }
  return context;
};

interface LevelProgressProviderProps {
  children: ReactNode;
}

export const LevelProgressProvider: React.FC<LevelProgressProviderProps> = ({ children }) => {
  const { driverLevel, incrementProgress, addRides, resetProgress, testVIPStatus, clearAllData } = useEarningsLevel();

  const value: LevelProgressContextType = {
    driverLevel,
    incrementProgress,
    addRides,
    resetProgress,
    testVIPStatus,
    clearAllData,
  };

  return (
    <LevelProgressContext.Provider value={value}>
      {children}
    </LevelProgressContext.Provider>
  );
};
