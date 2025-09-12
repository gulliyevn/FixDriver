/**
 * Level progress context types
 * Type definitions for driver level progress management
 */

export interface LevelUpResult {
  hasLevelUp: boolean;
  bonusAmount: number;
  completedLevel: number;
  completedSubLevel: number;
}

export interface LevelProgressContextType {
  driverLevel: any;
  incrementProgress: () => Promise<LevelUpResult | undefined>;
  activateVIPLevel: () => Promise<void>;
  addRides: (count: number) => Promise<void>;
  resetProgress: () => Promise<void>;
  getTotalRidesForLevel: (level: number, subLevel: number, progress: number) => number;
  updateVIPLevel: (qualifiedDaysInPeriods: number[]) => Promise<void>;
}

export interface LevelProgressProviderProps {
  children: React.ReactNode;
}
