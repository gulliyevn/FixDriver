export const lightColors = {
  // Основные цвета
  primary: '#1E3A8A',
  secondary: '#3B82F6',
  accent: '#06B6D4',
  
  // Фоновые цвета
  background: '#FFFFFF',
  surface: '#F8FAFC',
  card: '#FFFFFF',
  tabBar: '#FFFFFF',
  
  // Текстовые цвета
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Границы и разделители
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Статусные цвета
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Дополнительные цвета
  cardShadow: '#000000',
  gradient: ['#1E3A8A', '#3B82F6'],
  
  // Специальные цвета
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
};

export const darkColors = {
  // Основные цвета
  primary: '#3B82F6',
  secondary: '#60A5FA',
  accent: '#22D3EE',
  
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
