import React, { createContext, useContext, useState, ReactNode } from 'react';
import MockServices from '../../shared/mocks/MockServices';

interface DriverLevel {
  level: number;
  experience: number;
  isVIP: boolean;
  nextLevelExperience: number;
  vipStartDate?: string;
}

interface LevelProgressContextType {
  driverLevel: DriverLevel | null;
  incrementProgress: (amount: number) => void;
  resetProgress: () => void;
  updateVIPLevel: (qualifiedDaysInPeriods: number[]) => Promise<void>;
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
    nextLevelExperience: 1500
  });

  const incrementProgress = (amount: number) => {
    setDriverLevel(prev => {
      if (!prev) return prev;
      
      const newExperience = prev.experience + amount;
      const newLevel = Math.floor(newExperience / 300) + 1;
      const nextLevelExp = newLevel * 300;
      
      return {
        ...prev,
        level: newLevel,
        experience: newExperience,
        nextLevelExperience: nextLevelExp
      };
    });
  };

  const resetProgress = () => {
    setDriverLevel({
      level: 1,
      experience: 0,
      isVIP: false,
      nextLevelExperience: 300
    });
  };

  const updateVIPLevel = async (qualifiedDaysInPeriods: number[]) => {
    // TODO: Implement VIP level update logic
    // This is a placeholder implementation
    console.log('updateVIPLevel called with:', qualifiedDaysInPeriods);
  };

  return (
    <LevelProgressContext.Provider value={{ driverLevel, incrementProgress, resetProgress, updateVIPLevel }}>
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
