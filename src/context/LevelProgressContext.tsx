import React, { createContext, useContext, ReactNode } from 'react';
import { useEarningsLevel } from '../components/EarningsScreen/hooks/useEarningsLevel';

interface LevelProgressContextType {
  driverLevel: any;
  incrementProgress: () => Promise<void>;
  resetProgress: () => Promise<void>;
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
  const { driverLevel, incrementProgress, resetProgress } = useEarningsLevel();

  // Отладочная информация
  console.log('LevelProgressProvider - driverLevel:', driverLevel);

  const value: LevelProgressContextType = {
    driverLevel,
    incrementProgress,
    resetProgress,
  };

  return (
    <LevelProgressContext.Provider value={value}>
      {children}
    </LevelProgressContext.Provider>
  );
};
