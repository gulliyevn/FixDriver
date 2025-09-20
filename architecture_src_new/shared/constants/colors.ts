// Color constants and theme system for the application

export const lightColors = {
  // Основные цвета FixDrive
  primary: '#083198', // Основные кнопки
  secondary: '#0360bc', // Маршрутные линии
  accent: '#006ac9', // Кнопка звонков
  
  // Фоновые цвета
  background: '#fffeff', // Светлый фон приложения
  surface: '#f1f1f0', // Фон карты
  card: '#ffffff', // Дороги на карте
  tabBar: '#ffffff',
  
  // Текстовые цвета
  text: '#030304', // Тексты
  textSecondary: '#6d6565', // Точка прибытия
  textTertiary: '#1b1d1e', // Точка выезда
  
  // Границы и разделители
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Статусные цвета
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0163c2', // Активная иконка таббара
  
  // Дополнительные цвета
  cardShadow: '#000000',
  gradient: ['#083198', '#0360bc'],
  
  // Специальные цвета
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
};

export const darkColors = {
  // Основные цвета
  primary: '#083198',
  secondary: '#0360bc',
  accent: '#006ac9',
  
  // Фоновые цвета
  background: '#111827',
  surface: '#1F2937',
  card: '#1F2937',
  tabBar: '#111827',
  
  // Текстовые цвета
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  
  // Границы и разделители
  border: '#374151',
  borderLight: '#4B5563',
  
  // Статусные цвета
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  
  // Дополнительные цвета
  cardShadow: '#000000',
  gradient: ['#3B82F6', '#60A5FA'],
  
  // Специальные цвета
  overlay: 'rgba(0, 0, 0, 0.7)',
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

export const colors = {
  light: lightColors,
  dark: darkColors,
};

// Функция для получения текущих цветов
export const getCurrentColors = (isDark: boolean) => {
  return isDark ? darkColors : lightColors;
};

// ===== ОБЩИЕ КОНСТАНТЫ ДЛЯ СТИЛЕЙ =====

// Размеры
export const SIZES = {
  // Отступы
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Радиусы
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 50,
  },
  
  // Размеры шрифтов
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    title: 28,
  },
  
  // Высота строк
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
    xxl: 24,
    xxxl: 28,
    title: 32,
  },
  
  // Размеры иконок
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
  },
  
  // Высота кнопок
  buttonHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  
  // Высота инпутов
  inputHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
};

// Тени
export const SHADOWS = {
  light: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  dark: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

// Анимации
export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Z-индексы
export const Z_INDEX = {
  base: 0,
  card: 1,
  modal: 1000,
  overlay: 999,
  tooltip: 1001,
  toast: 1002,
};

// Дополнительные константы для VIP пакетов
export const VIP_COLORS = {
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  PRIMARY: '#3B82F6',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

// Константы для иконок
export const ICON_SIZES = {
  FEATURE_ICON: 14,
  CHECKMARK: 16,
  CLOSE: 12,
  SELECTED_INDICATOR: 24,
} as const;