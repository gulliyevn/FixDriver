import { StyleSheet } from 'react-native';
import { colors, SIZES, SHADOWS } from '../../constants/colors';

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