// Правильный тестовый скрипт согласно документации
console.log('🧪 ПРАВИЛЬНОЕ ТЕСТИРОВАНИЕ СОГЛАСНО ДОКУМЕНТАЦИИ\n');

// Конфигурация уровней согласно GAMIFICATION_SYSTEM.md
const LEVELS_CONFIG = {
  "1.1": { levelKey: "starter", subLevel: 1, icon: "🥉", bonus: 2, maxProgress: 30 },
  "1.2": { levelKey: "starter", subLevel: 2, icon: "🥉", bonus: 3, maxProgress: 40 },
  "1.3": { levelKey: "starter", subLevel: 3, icon: "🥉", bonus: 5, maxProgress: 50 },
  "2.1": { levelKey: "determined", subLevel: 1, icon: "🥈", bonus: 8, maxProgress: 60 },
  "2.2": { levelKey: "determined", subLevel: 2, icon: "🥈", bonus: 10, maxProgress: 80 },
  "2.3": { levelKey: "determined", subLevel: 3, icon: "🥈", bonus: 15, maxProgress: 100 },
  "3.1": { levelKey: "reliable", subLevel: 1, icon: "🥇", bonus: 20, maxProgress: 120 },
  "3.2": { levelKey: "reliable", subLevel: 2, icon: "🥇", bonus: 25, maxProgress: 150 },
  "3.3": { levelKey: "reliable", subLevel: 3, icon: "🥇", bonus: 35, maxProgress: 180 },
  "4.1": { levelKey: "champion", subLevel: 1, icon: "🏆", bonus: 50, maxProgress: 210 },
  "4.2": { levelKey: "champion", subLevel: 2, icon: "🏆", bonus: 65, maxProgress: 250 },
  "4.3": { levelKey: "champion", subLevel: 3, icon: "🏆", bonus: 85, maxProgress: 290 },
  "5.1": { levelKey: "superstar", subLevel: 1, icon: "⭐", bonus: 120, maxProgress: 330 },
  "5.2": { levelKey: "superstar", subLevel: 2, icon: "⭐", bonus: 150, maxProgress: 380 },
  "5.3": { levelKey: "superstar", subLevel: 3, icon: "⭐", bonus: 200, maxProgress: 430 },
  "6.1": { levelKey: "emperor", subLevel: 1, icon: "👑", bonus: 300, maxProgress: 480 },
  "6.2": { levelKey: "emperor", subLevel: 2, icon: "👑", bonus: 400, maxProgress: 540 },
  "6.3": { levelKey: "emperor", subLevel: 3, icon: "👑", bonus: 500, maxProgress: 600 },
};

const VIP_CONFIG = {
  levelKey: "vip",
  icon: "💎",
  minRidesPerDay: 3,
  monthlyBonuses: { days20: 50, days25: 75, days30: 100 },
  quarterlyBonuses: { months3: 200, months6: 500, months12: 1000 },
  minDaysPerMonth: 20,
};

// Функции
const getLevelConfig = (level, subLevel) => {
  const key = `${level}.${subLevel}`;
  return LEVELS_CONFIG[key] || LEVELS_CONFIG["1.1"];
};

const isVIPLevel = (totalRides) => {
  return totalRides >= 4320;
};

// Функция для расчета уровня и подуровня (копия из useEarningsLevel)
const calculateLevelAndSubLevel = (totalRides) => {
  // Проверяем VIP статус (4320+ поездок)
  if (isVIPLevel(totalRides)) {
    return {
      level: 7, // VIP уровень
      subLevel: 1,
      maxProgress: VIP_CONFIG.minDaysPerMonth,
      title: 'vip',
      subLevelTitle: 'VIP 1',
      icon: VIP_CONFIG.icon,
      nextReward: VIP_CONFIG.monthlyBonuses.days20.toString(),
    };
  }
  
  // Определяем уровень и подуровень по общему количеству поездок
  let accumulatedRides = 0;
  
  for (let level = 1; level <= 6; level++) {
    for (let subLevel = 1; subLevel <= 3; subLevel++) {
      const config = getLevelConfig(level, subLevel);
      const ridesInThisSubLevel = config.maxProgress;
      
      if (totalRides < accumulatedRides + ridesInThisSubLevel) {
        // Нашли нужный подуровень
        const progressInSubLevel = totalRides - accumulatedRides;
        
        return {
          level,
          subLevel,
          maxProgress: ridesInThisSubLevel,
          title: config.levelKey,
          subLevelTitle: `${config.levelKey} ${subLevel}`,
          icon: config.icon,
          nextReward: config.bonus.toString(),
        };
      }
      
      accumulatedRides += ridesInThisSubLevel;
    }
  }
  
  // Если превысил максимальный уровень
  const maxConfig = getLevelConfig(6, 3);
  return {
    level: 6,
    subLevel: 3,
    maxProgress: maxConfig.maxProgress,
    title: maxConfig.levelKey,
    subLevelTitle: `${maxConfig.levelKey} 3`,
    icon: maxConfig.icon,
    nextReward: maxConfig.bonus.toString(),
  };
};

// Функция для расчета прогресса в текущем подуровне
const calculateProgressInSubLevel = (totalRides, level, subLevel) => {
  let accumulatedRides = 0;
  
  // Суммируем поездки до текущего подуровня
  for (let l = 1; l < level; l++) {
    for (let s = 1; s <= 3; s++) {
      const config = getLevelConfig(l, s);
      accumulatedRides += config.maxProgress;
    }
  }
  
  for (let s = 1; s < subLevel; s++) {
    const config = getLevelConfig(level, s);
    accumulatedRides += config.maxProgress;
  }
  
  return totalRides - accumulatedRides;
};

console.log('📊 КОНФИГУРАЦИЯ УРОВНЕЙ СОГЛАСНО ДОКУМЕНТАЦИИ:');
Object.entries(LEVELS_CONFIG).forEach(([key, config]) => {
  console.log(`${key}: ${config.maxProgress} поездок, бонус ${config.bonus} AFc`);
});

console.log('\n🎯 ПРОВЕРКА СООТВЕТСТВИЯ ДОКУМЕНТАЦИИ:');
console.log('='.repeat(50));

// Проверяем соответствие документации
const documentationTests = [
  { rides: 0, expected: '1.1', description: 'Стартер 1 (0-30)' },
  { rides: 30, expected: '1.2', description: 'Стартер 2 (31-70)' },
  { rides: 70, expected: '1.3', description: 'Стартер 3 (71-120)' },
  { rides: 120, expected: '2.1', description: 'Целеустремленный 1 (121-180)' },
  { rides: 180, expected: '2.2', description: 'Целеустремленный 2 (181-260)' },
  { rides: 260, expected: '2.3', description: 'Целеустремленный 3 (261-360)' },
  { rides: 360, expected: '3.1', description: 'Надежный 1 (361-480)' },
  { rides: 480, expected: '3.2', description: 'Надежный 2 (481-630)' },
  { rides: 630, expected: '3.3', description: 'Надежный 3 (631-810)' },
  { rides: 810, expected: '4.1', description: 'Чемпион 1 (811-1020)' },
  { rides: 1020, expected: '4.2', description: 'Чемпион 2 (1021-1270)' },
  { rides: 1270, expected: '4.3', description: 'Чемпион 3 (1271-1560)' },
  { rides: 1560, expected: '5.1', description: 'Суперзвезда 1 (1561-1890)' },
  { rides: 1890, expected: '5.2', description: 'Суперзвезда 2 (1891-2270)' },
  { rides: 2270, expected: '5.3', description: 'Суперзвезда 3 (2271-2700)' },
  { rides: 2700, expected: '6.1', description: 'Император 1 (2701-3180)' },
  { rides: 3180, expected: '6.2', description: 'Император 2 (3181-3720)' },
  { rides: 3720, expected: '6.3', description: 'Император 3 (3721-4320)' },
  { rides: 4320, expected: 'VIP', description: 'VIP активация (4320+)' },
];

documentationTests.forEach(test => {
  const result = calculateLevelAndSubLevel(test.rides);
  const actual = result.level === 7 ? 'VIP' : `${result.level}.${result.subLevel}`;
  const status = actual === test.expected ? '✅' : '❌';
  console.log(`${status} ${test.description}: ${test.rides} поездок → ${actual} (ожидалось ${test.expected})`);
});

console.log('\n🎯 ДЕТАЛЬНАЯ ПРОВЕРКА ПЕРЕХОДОВ:');
console.log('='.repeat(50));

// Детальная проверка переходов
for (let rides = 0; rides <= 300; rides += 10) {
  const result = calculateLevelAndSubLevel(rides);
  const progress = calculateProgressInSubLevel(rides, result.level, result.subLevel);
  const levelName = result.level === 7 ? 'VIP' : `${result.level}.${result.subLevel}`;
  console.log(`${rides.toString().padStart(3)} поездок → ${levelName}, прогресс ${progress}/${result.maxProgress}`);
}

console.log('\n✅ ПРАВИЛЬНОЕ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
