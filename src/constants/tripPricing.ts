// Константы для расчета стоимости поездок водителя
export const TRIP_PRICING = {
  // Базовая стоимость поездки (в AFc)
  BASE_PRICE: 8,

  // Дополнительная стоимость за километр
  PRICE_PER_KM: 1.5,

  // Дополнительная стоимость за минуту
  PRICE_PER_MINUTE: 0.2,

  // Минимальная стоимость поездки
  MIN_PRICE: 5,

  // Максимальная стоимость поездки (без учета VIP)
  MAX_PRICE: 25,

  // Множители для разных уровней водителя
  LEVEL_MULTIPLIERS: {
    1: 1.0, // Стартер - базовая ставка
    2: 1.1, // Целеустремленный - +10%
    3: 1.2, // Надежный - +20%
    4: 1.3, // Чемпион - +30%
    5: 1.4, // Суперзвезда - +40%
    6: 1.5, // Император - +50%
    7: 2.0, // VIP - +100%
  },

  // Бонусы за рейтинг
  RATING_BONUSES: {
    4.5: 0.05, // +5% за рейтинг 4.5+
    4.7: 0.1, // +10% за рейтинг 4.7+
    4.9: 0.15, // +15% за рейтинг 4.9+
    5.0: 0.2, // +20% за рейтинг 5.0
  },

  // Временные бонусы
  TIME_BONUSES: {
    PEAK_HOURS: 0.15, // +15% в часы пик (7-9, 17-19)
    NIGHT_HOURS: 0.25, // +25% ночью (22-6)
    WEEKEND: 0.1, // +10% в выходные
  },
};

// Функция для расчета стоимости поездки
export const calculateTripPrice = (params: {
  distance: number; // расстояние в км
  duration: number; // время в минутах
  driverLevel: number; // уровень водителя
  rating: number; // рейтинг водителя
  isPeakHours?: boolean; // часы пик
  isNightHours?: boolean; // ночные часы
  isWeekend?: boolean; // выходные
}): number => {
  const {
    distance,
    duration,
    driverLevel,
    rating,
    isPeakHours,
    isNightHours,
    isWeekend,
  } = params;

  // Базовая стоимость
  let basePrice = TRIP_PRICING.BASE_PRICE;
  basePrice += distance * TRIP_PRICING.PRICE_PER_KM;
  basePrice += duration * TRIP_PRICING.PRICE_PER_MINUTE;

  // Применяем множитель уровня
  const levelMultiplier =
    TRIP_PRICING.LEVEL_MULTIPLIERS[
      driverLevel as keyof typeof TRIP_PRICING.LEVEL_MULTIPLIERS
    ] || 1.0;
  let finalPrice = basePrice * levelMultiplier;

  // Применяем бонус за рейтинг
  if (rating >= 5.0) {
    finalPrice *= 1 + TRIP_PRICING.RATING_BONUSES[5.0];
  } else if (rating >= 4.9) {
    finalPrice *= 1 + TRIP_PRICING.RATING_BONUSES[4.9];
  } else if (rating >= 4.7) {
    finalPrice *= 1 + TRIP_PRICING.RATING_BONUSES[4.7];
  } else if (rating >= 4.5) {
    finalPrice *= 1 + TRIP_PRICING.RATING_BONUSES[4.5];
  }

  // Применяем временные бонусы
  if (isPeakHours) {
    finalPrice *= 1 + TRIP_PRICING.TIME_BONUSES.PEAK_HOURS;
  }
  if (isNightHours) {
    finalPrice *= 1 + TRIP_PRICING.TIME_BONUSES.NIGHT_HOURS;
  }
  if (isWeekend) {
    finalPrice *= 1 + TRIP_PRICING.TIME_BONUSES.WEEKEND;
  }

  // Ограничиваем минимальную и максимальную стоимость
  finalPrice = Math.max(TRIP_PRICING.MIN_PRICE, finalPrice);
  finalPrice = Math.min(TRIP_PRICING.MAX_PRICE, finalPrice);

  // Возвращаем целую часть цены
  return Math.floor(finalPrice);
};

// Функция для генерации случайной поездки (для тестирования)
export const generateRandomTrip = (
  driverLevel: number,
  rating: number = 4.8,
): {
  distance: number;
  duration: number;
  price: number;
  isPeakHours: boolean;
  isNightHours: boolean;
  isWeekend: boolean;
} => {
  // Случайное расстояние от 2 до 15 км
  const distance = Math.random() * 13 + 2;

  // Случайное время от 10 до 45 минут
  const duration = Math.random() * 35 + 10;

  // Случайное время дня
  const hour = Math.floor(Math.random() * 24);
  const isPeakHours = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  const isNightHours = hour >= 22 || hour <= 6;

  // Случайный день недели (0 = воскресенье, 6 = суббота)
  const dayOfWeek = Math.floor(Math.random() * 7);
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const price = calculateTripPrice({
    distance,
    duration,
    driverLevel,
    rating,
    isPeakHours,
    isNightHours,
    isWeekend,
  });

  return {
    distance: Math.round(distance * 10) / 10,
    duration: Math.round(duration),
    price: Math.floor(price), // Показываем только целую часть цены
    isPeakHours,
    isNightHours,
    isWeekend,
  };
};
