// Тестовый скрипт для проверки всех сценариев уровней и VIP
console.log('🧪 ТЕСТИРОВАНИЕ СЦЕНАРИЕВ УРОВНЕЙ И VIP\n');

// Конфигурация уровней (копия из levels.config.ts)
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

// Функция для получения общего количества поездок
const getTotalRidesForLevel = (level, subLevel, progress) => {
  let totalRides = 0;
  
  // Суммируем поездки из предыдущих уровней
  for (let l = 1; l < level; l++) {
    for (let s = 1; s <= 3; s++) {
      const config = getLevelConfig(l, s);
      totalRides += config.maxProgress;
    }
  }
  
  // Добавляем поездки из предыдущих подуровней текущего уровня
  for (let s = 1; s < subLevel; s++) {
    const config = getLevelConfig(level, s);
    totalRides += config.maxProgress;
  }
  
  // Добавляем прогресс в текущем подуровне
  totalRides += progress;
  
  return totalRides;
};

console.log('📊 КОНФИГУРАЦИЯ УРОВНЕЙ:');
Object.entries(LEVELS_CONFIG).forEach(([key, config]) => {
  console.log(`${key}: ${config.maxProgress} поездок, бонус ${config.bonus} AFc`);
});

console.log('\n🎯 СЦЕНАРИЙ 1: Продвижение по подуровням уровня 1');
console.log('='.repeat(50));

// Тестируем переходы в уровне 1
const level1Tests = [0, 29, 30, 69, 70, 119, 120];
level1Tests.forEach(rides => {
  const result = calculateLevelAndSubLevel(rides);
  const progress = rides < 30 ? rides : rides < 70 ? rides - 30 : rides - 70;
  console.log(`${rides.toString().padStart(3)} поездок: Уровень ${result.level}.${result.subLevel}, прогресс ${progress}/${result.maxProgress}`);
});

console.log('\n🎯 СЦЕНАРИЙ 2: Переход на уровень 2');
console.log('='.repeat(50));

// Тестируем переход на уровень 2
const level2Tests = [120, 121, 179, 180, 239, 240];
level2Tests.forEach(rides => {
  const result = calculateLevelAndSubLevel(rides);
  const progress = rides < 180 ? rides - 120 : rides < 240 ? rides - 180 : rides - 240;
  console.log(`${rides.toString().padStart(3)} поездок: Уровень ${result.level}.${result.subLevel}, прогресс ${progress}/${result.maxProgress}`);
});

console.log('\n🎯 СЦЕНАРИЙ 3: VIP активация');
console.log('='.repeat(50));

// Тестируем VIP активацию
const vipTests = [4319, 4320, 4321, 5000];
vipTests.forEach(rides => {
  const result = calculateLevelAndSubLevel(rides);
  console.log(`${rides.toString().padStart(4)} поездок: ${result.level === 7 ? 'VIP АКТИВИРОВАН' : `Уровень ${result.level}.${result.subLevel}`}`);
});

console.log('\n🎯 СЦЕНАРИЙ 4: Проверка бонусов при переходах');
console.log('='.repeat(50));

// Проверяем бонусы при переходах
const bonusTests = [
  { rides: 29, expectedBonus: 2, description: 'Завершение 1.1' },
  { rides: 69, expectedBonus: 3, description: 'Завершение 1.2' },
  { rides: 119, expectedBonus: 5, description: 'Завершение 1.3' },
  { rides: 179, expectedBonus: 8, description: 'Завершение 2.1' },
];

bonusTests.forEach(test => {
  const result = calculateLevelAndSubLevel(test.rides);
  const config = getLevelConfig(result.level, result.subLevel);
  console.log(`${test.description}: ${test.rides} поездок → бонус ${config.bonus} AFc (ожидалось ${test.expectedBonus})`);
});

console.log('\n🎯 СЦЕНАРИЙ 5: Проверка функции getTotalRidesForLevel');
console.log('='.repeat(50));

// Проверяем функцию getTotalRidesForLevel
const totalRidesTests = [
  { level: 1, subLevel: 1, progress: 15, expected: 15 },
  { level: 1, subLevel: 2, progress: 20, expected: 50 },
  { level: 2, subLevel: 1, progress: 30, expected: 150 },
];

totalRidesTests.forEach(test => {
  const total = getTotalRidesForLevel(test.level, test.subLevel, test.progress);
  console.log(`Уровень ${test.level}.${test.subLevel}, прогресс ${test.progress}: ${total} поездок (ожидалось ${test.expected})`);
});

console.log('\n🎯 СЦЕНАРИЙ 6: Детальная проверка переходов');
console.log('='.repeat(50));

// Детальная проверка переходов
for (let rides = 0; rides <= 150; rides += 10) {
  const result = calculateLevelAndSubLevel(rides);
  const total = getTotalRidesForLevel(result.level, result.subLevel, 0);
  console.log(`${rides.toString().padStart(3)} поездок → Уровень ${result.level}.${result.subLevel} (начинается с ${total} поездок)`);
}

console.log('\n✅ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО');
