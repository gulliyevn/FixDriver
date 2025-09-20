import React, { createContext, useContext, useState, ReactNode } from 'react';
import MockServices from '../../shared/mocks/MockServices';

interface DriverLevel {
  level: number;
  experience: number;
  isVIP: boolean;
  nextLevelExperience: number;
  vipStartDate?: string;
  currentProgress: number;
  maxProgress: number;
  subLevelTitle: string;
  currentLevel: number;
  currentSubLevel: number;
  vipLevel?: number;
}

interface LevelProgressContextType {
  driverLevel: DriverLevel | null;
  incrementProgress: (amount: number) => void;
  resetProgress: () => void;
  updateVIPLevel: (qualifiedDaysInPeriods: number[]) => Promise<void>;
  activateVIPLevel: () => void;
}

const LevelProgressContext = createContext<LevelProgressContextType | undefined>(undefined);

interface LevelProgressProviderProps {
  children: ReactNode;
}

export const LevelProgressProvider: React.FC<LevelProgressProviderProps> = ({ children }) => {
  const [driverLevel, setDriverLevel] = useState<DriverLevel | null>({
    level: 5,
    experience: 1250,
    isVIP: true,
    nextLevelExperience: 1500,
    currentProgress: 15,
    maxProgress: 20,
    subLevelTitle: 'VIP Driver',
    currentLevel: 5,
    currentSubLevel: 1,
    vipLevel: 1
  });

  const incrementProgress = (amount: number) => {
    setDriverLevel(prev => {
      if (!prev) return prev;
      
      const newExperience = prev.experience + amount;
      const newLevel = Math.floor(newExperience / 300) + 1;
      const nextLevelExp = newLevel * 300;
      const newCurrentProgress = Math.min(prev.currentProgress + 1, prev.maxProgress);
      
      return {
        ...prev,
        level: newLevel,
        experience: newExperience,
        nextLevelExperience: nextLevelExp,
        currentProgress: newCurrentProgress,
        subLevelTitle: prev.isVIP ? 'VIP Driver' : `Level ${newLevel} Driver`,
        currentLevel: newLevel,
        currentSubLevel: prev.currentSubLevel,
        vipLevel: prev.isVIP ? (prev.vipLevel || 1) : undefined
      };
    });
  };

  const resetProgress = () => {
    setDriverLevel({
      level: 1,
      experience: 0,
      isVIP: false,
      nextLevelExperience: 300,
      currentProgress: 0,
      maxProgress: 10,
      subLevelTitle: 'Level 1 Driver',
      currentLevel: 1,
      currentSubLevel: 1,
      vipLevel: undefined
    });
  };

  const updateVIPLevel = async (qualifiedDaysInPeriods: number[]) => {
    // TODO: Implement VIP level update logic
    // This is a placeholder implementation
    console.log('updateVIPLevel called with:', qualifiedDaysInPeriods);
  };

  const activateVIPLevel = () => {
    setDriverLevel(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        isVIP: true,
        vipLevel: 1,
        vipStartDate: new Date().toISOString()
      };
    });
  };

  return (
    <LevelProgressContext.Provider value={{ driverLevel, incrementProgress, resetProgress, updateVIPLevel, activateVIPLevel }}>
      {children}
    </LevelProgressContext.Provider>
  );
};

export const useLevelProgress = (): LevelProgressContextType => {
  const context = useContext(LevelProgressContext);
  if (context === undefined) {
    throw new Error('useLevelProgress must be used within a LevelProgressProvider');
  }
  return context;
};
