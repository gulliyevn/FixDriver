export interface LevelConfig {
  levelKey: string; // Ключ для перевода (например, "starter")
  subLevel: number; // Номер подуровня (1, 2, 3)
  icon: string;
  bonus: number;
  maxProgress: number;
}

export interface VIPConfig {
  levelKey: string; // "vip"
  icon: string;
  // Минимальное количество поездок в день для соответствия условиям VIP
  minRidesPerDay: number;
  monthlyBonuses: {
    days20: number; // Бонус за 20 дней
    days25: number; // Бонус за 25 дней
    days30: number; // Бонус за 30 дней
  };
  quarterlyBonuses: {
    months3: number; // Бонус за 3 месяца подряд
    months6: number; // Бонус за 6 месяцев подряд
    months12: number; // Бонус за 12 месяцев подряд
  };
  minDaysPerMonth: number; // Минимум дней в месяц для квартальных бонусов
}

export const LEVELS_CONFIG: Record<string, LevelConfig> = {
  // Уровень 1: Стартер (0-120 поездок)
  "1.1": { levelKey: "starter", subLevel: 1, icon: "🥉", bonus: 2, maxProgress: 30 },
  "1.2": { levelKey: "starter", subLevel: 2, icon: "🥉", bonus: 3, maxProgress: 40 },
  "1.3": { levelKey: "starter", subLevel: 3, icon: "🥉", bonus: 5, maxProgress: 50 },

  // Уровень 2: Целеустремленный (121-360 поездок)
  "2.1": { levelKey: "determined", subLevel: 1, icon: "🥈", bonus: 8, maxProgress: 60 },
  "2.2": { levelKey: "determined", subLevel: 2, icon: "🥈", bonus: 10, maxProgress: 80 },
  "2.3": { levelKey: "determined", subLevel: 3, icon: "🥈", bonus: 15, maxProgress: 100 },

  // Уровень 3: Надежный (361-810 поездок)
  "3.1": { levelKey: "reliable", subLevel: 1, icon: "🥇", bonus: 20, maxProgress: 120 },
  "3.2": { levelKey: "reliable", subLevel: 2, icon: "🥇", bonus: 25, maxProgress: 150 },
  "3.3": { levelKey: "reliable", subLevel: 3, icon: "🥇", bonus: 35, maxProgress: 180 },

  // Уровень 4: Чемпион (811-1560 поездок)
  "4.1": { levelKey: "champion", subLevel: 1, icon: "🏆", bonus: 50, maxProgress: 210 },
  "4.2": { levelKey: "champion", subLevel: 2, icon: "🏆", bonus: 65, maxProgress: 250 },
  "4.3": { levelKey: "champion", subLevel: 3, icon: "🏆", bonus: 85, maxProgress: 290 },

  // Уровень 5: Суперзвезда (1561-2700 поездок)
  "5.1": { levelKey: "superstar", subLevel: 1, icon: "⭐", bonus: 120, maxProgress: 330 },
  "5.2": { levelKey: "superstar", subLevel: 2, icon: "⭐", bonus: 150, maxProgress: 380 },
  "5.3": { levelKey: "superstar", subLevel: 3, icon: "⭐", bonus: 200, maxProgress: 430 },

  // Уровень 6: Император (2701-4320 поездок)
  "6.1": { levelKey: "emperor", subLevel: 1, icon: "👑", bonus: 300, maxProgress: 480 },
  "6.2": { levelKey: "emperor", subLevel: 2, icon: "👑", bonus: 400, maxProgress: 540 },
  "6.3": { levelKey: "emperor", subLevel: 3, icon: "👑", bonus: 500, maxProgress: 600 },
};

// VIP система лояльности (4320+ поездок)
export const VIP_CONFIG: VIPConfig = {
  levelKey: "vip",
  icon: "💎",
  minRidesPerDay: 3, // Минимум 3 поездки в день
  monthlyBonuses: {
    days20: 50, // +50 AFc за 20 дней онлайн в месяц
    days25: 75, // +75 AFc за 25 дней онлайн в месяц
    days30: 100, // +100 AFc за 30 дней онлайн в месяц
  },
  quarterlyBonuses: {
    months3: 200, // +200 AFc за 3 месяца подряд
    months6: 500, // +500 AFc за 6 месяцев подряд
    months12: 1000, // +1000 AFc за 12 месяцев подряд
  },
  minDaysPerMonth: 20, // Минимум 20 дней в месяц для квартальных бонусов
};

// Функция для получения конфигурации уровня по ключу
export const getLevelConfig = (level: number, subLevel: number): LevelConfig => {
  const key = `${level}.${subLevel}`;
  return LEVELS_CONFIG[key] || LEVELS_CONFIG["1.1"];
};

// Функция для получения следующего уровня
export const getNextLevel = (currentLevel: number, currentSubLevel: number): { level: number; subLevel: number } => {
  if (currentSubLevel < 3) {
    return { level: currentLevel, subLevel: currentSubLevel + 1 };
  } else if (currentLevel < 6) {
    return { level: currentLevel + 1, subLevel: 1 };
  } else {
    return { level: 6, subLevel: 3 }; // Максимальный уровень
  }
};

// Функция для проверки, является ли уровень максимальным
export const isMaxLevel = (level: number, subLevel: number): boolean => {
  return level === 6 && subLevel === 3;
};

// Функция для получения переведенного названия уровня
export const getTranslatedLevelName = (levelKey: string, subLevel: number, t: (key: string) => string): string => {
  const levelName = t(`common.levels.levelNames.${levelKey}`);
  return `${levelName} ${subLevel}`;
};

// Функция для получения переведенного названия VIP уровня
export const getTranslatedVIPName = (t: (key: string) => string): string => {
  return t(`common.levels.levelNames.vip`);
};

// Функция для проверки, достиг ли водитель VIP уровня (4320+ поездок)
export const isVIPLevel = (totalRides: number): boolean => {
  return totalRides >= 4320;
};

// Функция для расчета месячного бонуса VIP
export const calculateMonthlyVIPBonus = (daysOnline: number): number => {
  if (daysOnline >= 30) return VIP_CONFIG.monthlyBonuses.days30;
  if (daysOnline >= 25) return VIP_CONFIG.monthlyBonuses.days25;
  if (daysOnline >= 20) return VIP_CONFIG.monthlyBonuses.days20;
  return 0;
};

// Функция для расчета квартального бонуса VIP
export const calculateQuarterlyVIPBonus = (consecutiveMonths: number): number => {
  if (consecutiveMonths >= 12) return VIP_CONFIG.quarterlyBonuses.months12;
  if (consecutiveMonths >= 6) return VIP_CONFIG.quarterlyBonuses.months6;
  if (consecutiveMonths >= 3) return VIP_CONFIG.quarterlyBonuses.months3;
  return 0;
};
