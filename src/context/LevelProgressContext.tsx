import React, { createContext, useContext, ReactNode } from "react";
import { useEarningsLevel } from "../components/EarningsScreen/hooks/useEarningsLevel";
import type { DriverLevel } from "../components/EarningsScreen/hooks/useEarningsLevel";

interface LevelUpResult {
  hasLevelUp: boolean;
  bonusAmount: number;
  completedLevel: number;
  completedSubLevel: number;
}

interface LevelProgressContextType {
  driverLevel: DriverLevel;
  incrementProgress: () => Promise<LevelUpResult | undefined>;
  activateVIPLevel: () => Promise<void>;
  addRides: (count: number) => Promise<void>;
  resetProgress: () => Promise<void>;
  getTotalRidesForLevel: (
    level: number,
    subLevel: number,
    progress: number,
  ) => number;
  updateVIPLevel: (qualifiedDaysInPeriods: number[]) => Promise<void>;
  getCurrentLevel: () => { level: number; subLevel: number };
  getProgressPercentage: () => number;
}

const LevelProgressContext = createContext<
  LevelProgressContextType | undefined
>(undefined);

export const useLevelProgress = (): LevelProgressContextType => {
  const context = useContext(LevelProgressContext);
  if (!context) {
    console.error(
      "useLevelProgress must be used within a LevelProgressProvider",
    );
    return {
      driverLevel: {
        currentLevel: 1,
        currentSubLevel: 1,
        currentProgress: 0,
        maxProgress: 10,
        title: "level1",
        subLevelTitle: "level1 1",
        icon: "default",
        nextReward: "0",
        isRewardAvailable: false,
        isVIP: false,
        vipDaysOnline: 0,
        vipDaysRequired: 20,
        vipLevel: 1,
      },
      incrementProgress: async () => undefined,
      activateVIPLevel: async () => {},
      addRides: async () => {},
      resetProgress: async () => {},
      getTotalRidesForLevel: () => 0,
      updateVIPLevel: async () => {},
      getCurrentLevel: () => ({ level: 0, subLevel: 0 }),
      getProgressPercentage: () => 0,
    };
  }
  return context;
};

interface LevelProgressProviderProps {
  children: ReactNode;
}

export const LevelProgressProvider: React.FC<LevelProgressProviderProps> = ({
  children,
}) => {
  const {
    driverLevel,
    incrementProgress,
    activateVIPLevel,
    addRides,
    resetProgress,
    getTotalRidesForLevel,
    updateVIPLevel,
  } = useEarningsLevel();

  const value: LevelProgressContextType = {
    driverLevel,
    incrementProgress,
    activateVIPLevel,
    addRides,
    resetProgress,
    getTotalRidesForLevel,
    updateVIPLevel,
    getCurrentLevel: () => ({ level: 0, subLevel: 0 }),
    getProgressPercentage: () => 0,
  };

  return (
    <LevelProgressContext.Provider value={value}>
      {children}
    </LevelProgressContext.Provider>
  );
};
