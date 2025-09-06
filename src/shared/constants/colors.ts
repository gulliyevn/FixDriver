// Color constants and theme system for the application

export const lightColors = {
  // Main FixDrive colors
  primary: '#083198', // Main buttons
  secondary: '#0360bc', // Route lines
  accent: '#006ac9', // Call buttons
  
  // Background colors
  background: '#fffeff', // Light app background
  surface: '#f1f1f0', // Map background
  card: '#ffffff', // Roads on map
  tabBar: '#ffffff',
  
  // Text colors
  text: '#030304', // Texts
  textSecondary: '#6d6565', // Arrival point
  textTertiary: '#1b1d1e', // Departure point
  
  // Borders and dividers
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0163c2', // Active tab bar icon
  
  // Additional colors
  cardShadow: '#000000',
  gradient: ['#083198', '#0360bc'],
  
  // Special colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
};

export const darkColors = {
  // Main colors
  primary: '#3B82F6',
  secondary: '#60A5FA',
  accent: '#22D3EE',
  
  // Background colors
  background: '#111827',
  surface: '#1F2937',
  card: '#1F2937',
  tabBar: '#111827',
  
  // Text colors
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  
  // Borders and dividers
  border: '#374151',
  borderLight: '#4B5563',
  
  // Status colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  
  // Additional colors
  cardShadow: '#000000',
  gradient: ['#3B82F6', '#60A5FA'],
  
  // Special colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  backdrop: 'rgba(0, 0, 0, 0.5)',
};

export const colors = {
  light: lightColors,
  dark: darkColors,
};

// Function for getting current colors
export const getCurrentColors = (isDark: boolean) => {
  return isDark ? darkColors : lightColors;
};

// ===== COMMON STYLE CONSTANTS =====

// Sizes
export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Border radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 50,
  },
  
  // Font sizes
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
  
  // Line heights
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
  
  // Icon sizes
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
    xxl: 32,
  },
  
  // Button heights
  buttonHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  
  // Input heights
  inputHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
};

// Shadows
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

// Animations
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

// Z-indexes
export const Z_INDEX = {
  base: 0,
  card: 1,
  modal: 1000,
  overlay: 999,
  tooltip: 1001,
  toast: 1002,
};

// Additional constants for VIP packages
export const VIP_COLORS = {
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  PRIMARY: '#3B82F6',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

// Constants for icons
export const ICON_SIZES = {
  FEATURE_ICON: 14,
  CHECKMARK: 16,
  CLOSE: 12,
  SELECTED_INDICATOR: 24,
} as const;