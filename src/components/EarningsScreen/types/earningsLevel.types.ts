export interface DriverLevel {
  currentLevel: number;
  currentProgress: number;
  maxProgress: number;
  title: string;
  nextReward: string;
  isRewardAvailable: boolean;
}

export interface LevelProgress {
  percentage: number;
  currentExp: number;
  expToNext: number;
  level: number;
}
