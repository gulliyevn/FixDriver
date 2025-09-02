import { getAdaptiveSize, getAdaptiveSpacing, isTablet, isSmallDevice, isLargeDevice } from '../utils/deviceUtils';

// Adaptive SIZES
export const SIZES = {
  // Font sizes
  fontSize: {
    title: getAdaptiveSize(28, 32),
    xl: getAdaptiveSize(22, 26),
    lg: getAdaptiveSize(18, 22),
    md: getAdaptiveSize(16, 18),
    sm: getAdaptiveSize(14, 16),
    xs: getAdaptiveSize(12, 14),
  },
  
  // Line heights
  lineHeight: {
    title: getAdaptiveSize(36, 40),
    lg: getAdaptiveSize(26, 30),
    md: getAdaptiveSize(22, 24),
  },
  
  // Border radius
  radius: {
    lg: getAdaptiveSize(20, 24),
    md: getAdaptiveSize(16, 20),
    sm: getAdaptiveSize(12, 16),
  },
  
  // Spacing
  xs: getAdaptiveSpacing(8, 12),
  sm: getAdaptiveSpacing(12, 16),
  md: getAdaptiveSpacing(16, 20),
  lg: getAdaptiveSpacing(20, 24),
  xl: getAdaptiveSpacing(24, 32),
  xxl: getAdaptiveSpacing(28, 36),
  xxxl: getAdaptiveSpacing(32, 40),
  
  // Button heights
  buttonHeight: {
    sm: getAdaptiveSize(36, 44),
    md: getAdaptiveSize(48, 56),
    lg: getAdaptiveSize(56, 64),
  },
  
  // Input heights
  inputHeight: {
    sm: getAdaptiveSize(40, 48),
    md: getAdaptiveSize(56, 64),
    lg: getAdaptiveSize(64, 72),
  },
  
  // Container sizes
  container: {
    maxWidth: isTablet ? 600 : '100%',
    paddingHorizontal: getAdaptiveSpacing(20, 40),
    paddingVertical: getAdaptiveSpacing(20, 30),
  },
  
  // Card sizes
  card: {
    borderRadius: getAdaptiveSize(16, 20),
    padding: getAdaptiveSpacing(20, 30),
    marginBottom: getAdaptiveSpacing(20, 30),
  },
};

// Adaptive SHADOWS
export const SHADOWS = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: getAdaptiveSize(8, 12),
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: getAdaptiveSize(16, 20),
      elevation: 6,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: getAdaptiveSize(24, 32),
      elevation: 12,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: getAdaptiveSize(8, 12),
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: getAdaptiveSize(16, 20),
      elevation: 6,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: getAdaptiveSize(24, 32),
      elevation: 12,
    },
  },
};

// Adaptive COLORS (with dark mode support)
export const colors = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',
    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#DC2626',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    inputBackground: '#F8FAFC',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    primaryDark: '#2563EB',
    success: '#10B981',
    successLight: '#34D399',
    successDark: '#059669',
    error: '#EF4444',
    errorLight: '#F87171',
    errorDark: '#DC2626',
    warning: '#F59E0B',
    warningLight: '#FBBF24',
    warningDark: '#D97706',
    border: '#334155',
    borderLight: '#475569',
    inputBackground: '#1E293B',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

// Get current colors based on theme
export const getColors = (isDark: boolean = false) => {
  return isDark ? colors.dark : colors.light;
};

// Adaptive animations
export const ANIMATIONS = {
  duration: {
    fast: 150,
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

// Responsive breakpoints
export const BREAKPOINTS = {
  phone: 768,
  tablet: 1024,
  desktop: 1200,
};

// Device specific adjustments
export const DEVICE_ADJUSTMENTS = {
  // Small devices (iPhone SE, etc.)
  small: {
    fontSize: {
      title: 24,
      xl: 20,
      lg: 16,
      md: 14,
      sm: 12,
      xs: 10,
    },
    spacing: {
      xs: 6,
      sm: 10,
      md: 14,
      lg: 18,
      xl: 22,
      xxl: 26,
      xxxl: 30,
    },
  },
  // Large devices (iPhone Pro Max, etc.)
  large: {
    fontSize: {
      title: 32,
      xl: 26,
      lg: 22,
      md: 18,
      sm: 16,
      xs: 14,
    },
    spacing: {
      xs: 10,
      sm: 14,
      md: 18,
      lg: 24,
      xl: 30,
      xxl: 36,
      xxxl: 42,
    },
  },
};

// Get device specific adjustments
export const getDeviceAdjustments = () => {
  if (isSmallDevice) return DEVICE_ADJUSTMENTS.small;
  if (isLargeDevice) return DEVICE_ADJUSTMENTS.large;
  return null;
};
