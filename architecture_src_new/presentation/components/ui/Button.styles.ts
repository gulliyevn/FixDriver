import { StyleSheet } from 'react-native';

// Временные константы (потом перенесем в shared/constants)
const SIZES = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxxl: 48,
  radius: {
    md: 12,
    round: 50,
  },
  fontSize: {
    md: 14,
    lg: 16,
    xl: 18,
  },
  buttonHeight: {
    sm: 36,
    md: 48,
    lg: 56,
  },
};

const SHADOWS = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6.27,
      elevation: 10,
    },
  },
};

// Временные цвета (потом перенесем в shared/constants)
const colors = {
  light: {
    primary: '#3B82F6',
    secondary: '#F3F4F6',
    surface: '#FFFFFF',
    text: '#1F2937',
    textTertiary: '#9CA3AF',
    error: '#EF4444',
  },
  dark: {
    primary: '#3B82F6',
    secondary: '#374151',
    surface: '#1F2937',
    text: '#F9FAFB',
    textTertiary: '#6B7280',
    error: '#EF4444',
  },
};

export const ButtonStyles = StyleSheet.create({
  // ===== ОСНОВНЫЕ СТИЛИ КНОПКИ =====
  button: {
    borderRadius: SIZES.radius.md,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: SIZES.buttonHeight.md,
    ...SHADOWS.light.small,
  },
  
  // ===== ВАРИАНТЫ КНОПОК =====
  primary: {
    backgroundColor: colors.light.primary,
  },
  secondary: {
    backgroundColor: colors.light.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.light.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.light.error,
  },
  
  // ===== РАЗМЕРЫ КНОПОК =====
  small: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    minHeight: SIZES.buttonHeight.sm,
  },
  medium: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.xl,
    minHeight: SIZES.buttonHeight.md,
  },
  large: {
    paddingVertical: SIZES.xl,
    paddingHorizontal: SIZES.xxxl,
    minHeight: SIZES.buttonHeight.lg,
  },
  
  // ===== СОСТОЯНИЯ КНОПКИ =====
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.7,
  },
  fullWidth: {
    width: '100%',
  },
  
  // ===== СТИЛИ ТЕКСТА =====
  text: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.light.surface,
  },
  secondaryText: {
    color: colors.light.text,
  },
  outlineText: {
    color: colors.light.primary,
  },
  ghostText: {
    color: colors.light.primary,
  },
  dangerText: {
    color: colors.light.surface,
  },
  smallText: {
    fontSize: SIZES.fontSize.md,
  },
  mediumText: {
    fontSize: SIZES.fontSize.lg,
  },
  largeText: {
    fontSize: SIZES.fontSize.xl,
  },
  disabledText: {
    color: colors.light.textTertiary,
  },
  
  // ===== СТИЛИ ИКОНОК =====
  icon: {
    marginRight: SIZES.sm,
  },
  iconRight: {
    marginRight: 0,
    marginLeft: SIZES.sm,
  },
  
  // ===== СТИЛИ ЗАГРУЗКИ =====
  loader: {
    marginRight: SIZES.sm,
  },
  
  // ===== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ =====
  buttonRounded: {
    borderRadius: SIZES.radius.round,
  },
  buttonWithShadow: {
    ...SHADOWS.light.medium,
  },
});
