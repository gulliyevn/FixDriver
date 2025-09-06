/**
 * Настройка тестовой среды для компонентов расписания
 */

// Общие моки для всех тестов
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Мок для Expo векторных иконок
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

// Мок для React Native компонентов
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
      sequence: jest.fn(() => ({
        start: jest.fn(),
      })),
      Value: jest.fn(() => ({
        setValue: jest.fn(),
      })),
    },
    Easing: {
      inOut: jest.fn(() => jest.fn()),
      ease: jest.fn(),
    },
  };
});

// Мок для констант времени
jest.mock('../constants', () => ({
  TIME_PICKER_COLORS: {
    MONDAY: '#FF6B6B',
    TUESDAY: '#4ECDC4',
    WEDNESDAY: '#45B7D1',
    THURSDAY: '#96CEB4',
    FRIDAY: '#FECA57',
    SATURDAY: '#FF9FF3',
    SUNDAY: '#54A0FF',
    THERE: '#34C759',
    BACK: '#FF3B30',
    WEEKDAYS: '#007AFF',
    WEEKEND: '#FF9500',
  },
  ANIMATION_CONFIG: {
    SCALE: 0.95,
    DURATION: 100,
  },
}));

// Глобальные утилиты для тестов
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Хелперы для тестов
export const createMockProps = (overrides = {}) => ({
  t: (key: string) => key,
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#E5E5E5',
  },
  isDark: false,
  ...overrides,
});

export const createMockWeekDays = () => [
  { key: 'mon', label: 'Понедельник' },
  { key: 'tue', label: 'Вторник' },
  { key: 'wed', label: 'Среда' },
  { key: 'thu', label: 'Четверг' },
  { key: 'fri', label: 'Пятница' },
  { key: 'sat', label: 'Суббота' },
  { key: 'sun', label: 'Воскресенье' },
];

export const createMockScheduleData = () => ({
  selectedDays: ['mon', 'tue', 'wed'],
  selectedTime: '09:00',
  returnTime: '18:00',
  isReturnTrip: true,
  customizedDays: {
    tue: { there: '10:00', back: '19:00' },
    wed: { there: '11:00', back: '20:00' },
  },
  timestamp: '2024-01-01T12:00:00.000Z',
});

// Утилита для ожидания async операций
export const waitForAsync = () => new Promise(resolve => setImmediate(resolve));
