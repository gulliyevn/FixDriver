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
  buttonPrimary: {
    backgroundColor: colors.light.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.light.secondary,
  },
  buttonSuccess: {
    backgroundColor: colors.light.success,
  },
  buttonWarning: {
    backgroundColor: colors.light.warning,
  },
  buttonError: {
    backgroundColor: colors.light.error,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.light.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  
  // ===== РАЗМЕРЫ КНОПОК =====
  buttonSmall: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.lg,
    minHeight: SIZES.buttonHeight.sm,
  },
  buttonLarge: {
    paddingVertical: SIZES.xl,
    paddingHorizontal: SIZES.xxxl,
    minHeight: SIZES.buttonHeight.lg,
  },
  
  // ===== СОСТОЯНИЯ КНОПКИ =====
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLoading: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  
  // ===== СТИЛИ ТЕКСТА =====
  text: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  textPrimary: {
    color: colors.light.surface,
  },
  textSecondary: {
    color: colors.light.text,
  },
  textSuccess: {
    color: colors.light.surface,
  },
  textWarning: {
    color: colors.light.surface,
  },
  textError: {
    color: colors.light.surface,
  },
  textOutline: {
    color: colors.light.primary,
  },
  textGhost: {
    color: colors.light.primary,
  },
  textSmall: {
    fontSize: SIZES.fontSize.md,
  },
  textLarge: {
    fontSize: SIZES.fontSize.xl,
  },
  
  // ===== СТИЛИ ИКОНОК =====
  icon: {
    marginRight: SIZES.sm,
  },
  iconRight: {
    marginRight: 0,
    marginLeft: SIZES.sm,
  },
  iconSmall: {
    width: SIZES.icon.sm,
    height: SIZES.icon.sm,
  },
  iconMedium: {
    width: SIZES.icon.md,
    height: SIZES.icon.md,
  },
  iconLarge: {
    width: SIZES.icon.lg,
    height: SIZES.icon.lg,
  },
  
  // ===== СТИЛИ ЗАГРУЗКИ =====
  loadingContainer: {
    marginRight: SIZES.sm,
  },
  loadingText: {
    marginLeft: SIZES.sm,
  },
  
  // ===== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ =====
  buttonFullWidth: {
    width: '100%',
  },
  buttonRounded: {
    borderRadius: SIZES.radius.round,
  },
  buttonWithShadow: {
    ...SHADOWS.light.medium,
  },
}); 