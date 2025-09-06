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
