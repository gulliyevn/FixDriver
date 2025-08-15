export interface DriverLevel {
  currentLevel: number;
  currentSubLevel: number;
  currentProgress: number;
  maxProgress: number;
  title: string;
  subLevelTitle: string;
  icon: string;
  nextReward: string;
  isRewardAvailable: boolean;
}

export interface LevelProgress {
  percentage: number;
  currentExp: number;
  expToNext: number;
  level: number;
}

// Константы для уровней
export const LEVEL_CONFIG = {
  1: { title: 'Стартер', icon: '🥉', subLevels: [40, 80, 150] },
  2: { title: 'Целеустремленный', icon: '🥈', subLevels: [220, 280, 350] },
  3: { title: 'Надежный', icon: '🥇', subLevels: [450, 550, 700] },
  4: { title: 'Чемпион', icon: '🏆', subLevels: [900, 1100, 1400] },
  5: { title: 'Суперзвезда', icon: '⭐', subLevels: [1700, 2000, 2500] },
  6: { title: 'Император', icon: '👑', subLevels: [3000, 3500, 4000] },
};

// Бонусы за подуровни
export const LEVEL_BONUSES = {
  1: [2, 3, 5],    // Стартер 1, 2, 3
  2: [8, 10, 15],  // Целеустремленный 1, 2, 3
  3: [20, 25, 35], // Надежный 1, 2, 3
  4: [50, 65, 85], // Чемпион 1, 2, 3
  5: [120, 150, 200], // Суперзвезда 1, 2, 3
  6: [300, 400, 500], // Император 1, 2, 3
};
