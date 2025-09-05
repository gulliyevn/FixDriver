import { getLevelConfig, getTranslatedLevelName, LEVELS_CONFIG, VIP_CONFIG } from '../types/levels.config';
import { LEVEL_RIDE_RANGES, SUBLEVEL_RIDE_RANGES } from '../constants/earningsConstants';

// Level display utilities
export const getLevelDisplayName = (driverLevel: any, t: (key: string) => string): string => {
  if (driverLevel.currentLevel >= 7) {
    const vipLabel = 'VIP';
    const vipLevel = driverLevel.vipLevel || 1;
    return `${vipLabel} ${vipLevel}`;
  }
  
  const config = getLevelConfig(driverLevel.currentLevel, driverLevel.currentSubLevel);
  return getTranslatedLevelName(config.levelKey, config.subLevel, t);
};

export const getLevelIcon = (driverLevel: any): string => {
  return driverLevel.icon;
};

// VIP bonus calculation utilities
export const calculateVIPBonus = (
  driverLevel: any,
  vipQualifiedDays: number,
  vipRidesToday: number,
  vipCurrentHours: number,
  getQualifiedDaysHistory: () => number[]
) => {
  const isQualifiedToday = driverLevel.isVIP && vipCurrentHours >= 10 && vipRidesToday >= 3;
  const displayQualifiedDays = driverLevel.isVIP
    ? vipQualifiedDays + (isQualifiedToday ? 1 : 0)
    : 0;

  // Monthly bonus preview - exact logic from old version
  const baseMonthlyPreview = driverLevel.isVIP
    ? (displayQualifiedDays < 20 ? 0
      : displayQualifiedDays <= 25 ? VIP_CONFIG.monthlyBonuses.days20
      : displayQualifiedDays <= 29 ? VIP_CONFIG.monthlyBonuses.days25
      : VIP_CONFIG.monthlyBonuses.days30)
    : 0;

  // Quarterly bonus preview - exact logic from old version
  let quarterlyPreview = 0;
  if (driverLevel.isVIP) {
    const history = getQualifiedDaysHistory?.() || [];
    // Count consecutive successful periods from the end of history
    let trailingQualified = 0;
    for (let i = history.length - 1; i >= 0; i -= 1) {
      if (history[i] >= VIP_CONFIG.minDaysPerMonth) trailingQualified += 1;
      else break;
    }

    const qualifiesCurrent = displayQualifiedDays >= VIP_CONFIG.minDaysPerMonth;
    const effectiveConsecutive = trailingQualified + (qualifiesCurrent ? 1 : 0);

    if (qualifiesCurrent) {
      if (effectiveConsecutive === 3) quarterlyPreview = VIP_CONFIG.quarterlyBonuses.months3;
      else if (effectiveConsecutive === 6) quarterlyPreview = VIP_CONFIG.quarterlyBonuses.months6;
      else if (effectiveConsecutive === 12) quarterlyPreview = VIP_CONFIG.quarterlyBonuses.months12;
    }
  }

  const vipMonthlyPreviewBonus = baseMonthlyPreview + quarterlyPreview;

  return {
    isQualifiedToday,
    displayQualifiedDays,
    baseMonthlyPreview,
    quarterlyPreview,
    totalBonus: vipMonthlyPreviewBonus,
  };
};

// Level modal content generation
export const generateLevelModalContent = (t: (key: string) => string, levelTranslations: any): string => {
  let content = '';
  
  for (let level = 1; level <= 6; level++) {
    const levelConfigs = [
      LEVELS_CONFIG[`${level}.1`],
      LEVELS_CONFIG[`${level}.2`],
      LEVELS_CONFIG[`${level}.3`]
    ];
    
    if (levelConfigs[0]) {
      const levelName = getTranslatedLevelName(levelConfigs[0].levelKey, 1, t).split(' ')[0];
      const icon = levelConfigs[0].icon;
      
      const range = LEVEL_RIDE_RANGES[level as keyof typeof LEVEL_RIDE_RANGES];
      content += `${icon} ${levelName} (${range.start}-${range.end} rides)\n`;
      
      // Add sublevels with correct ranges
      levelConfigs.forEach((config, index) => {
        const subLevelRange = SUBLEVEL_RIDE_RANGES[level as keyof typeof SUBLEVEL_RIDE_RANGES][(index + 1) as keyof typeof SUBLEVEL_RIDE_RANGES[1]];
        content += `• ${getTranslatedLevelName(config.levelKey, config.subLevel, t)} (${subLevelRange.start}-${subLevelRange.end}) +${config.bonus} AFc\n`;
      });
      
      content += '\n';
    }
  }
  
  // Add VIP system with translations
  const vipTranslations = levelTranslations.vip;
  content += `${VIP_CONFIG.icon} ${vipTranslations.title} (${vipTranslations.subtitle})\n\n`;
  content += `${vipTranslations.monthlyTitle}\n`;
  content += `• 20 ${vipTranslations.daysOnline} +${VIP_CONFIG.monthlyBonuses.days20} AFc\n`;
  content += `• 25 ${vipTranslations.daysOnline} +${VIP_CONFIG.monthlyBonuses.days25} AFc\n`;
  content += `• 30 ${vipTranslations.daysOnline} +${VIP_CONFIG.monthlyBonuses.days30} AFc\n\n`;
  content += `${vipTranslations.quarterlyTitle}\n`;
  content += `• 3 ${vipTranslations.monthsInRow} +${VIP_CONFIG.quarterlyBonuses.months3} AFc\n`;
  content += `• 6 ${vipTranslations.monthsInRow} +${VIP_CONFIG.quarterlyBonuses.months6} AFc\n`;
  content += `• 12 ${vipTranslations.monthsInRow} +${VIP_CONFIG.quarterlyBonuses.months12} AFc\n\n`;
  content += vipTranslations.additionalNote;
  
  return content;
};
