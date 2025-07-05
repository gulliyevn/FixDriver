import { StyleSheet } from 'react-native';
import { colors, SIZES, SHADOWS } from '../../constants/colors';

export const InputFieldStyles = StyleSheet.create({
  // ===== ОСНОВНОЙ КОНТЕЙНЕР =====
  container: {
    marginBottom: SIZES.lg,
  },
  
  // ===== КОНТЕЙНЕР ЛАБЕЛЯ =====
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  label: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '500',
    color: colors.light.text,
    lineHeight: SIZES.lineHeight.md,
  },
  required: {
    color: colors.light.error,
    marginLeft: SIZES.xs,
    fontSize: SIZES.fontSize.sm,
  },
  
  // ===== КОНТЕЙНЕР ИНПУТА =====
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: SIZES.radius.sm,
    backgroundColor: colors.light.surface,
    paddingHorizontal: SIZES.md,
    minHeight: SIZES.inputHeight.md,
    ...SHADOWS.light.small,
  },
  inputContainerFocused: {
    borderColor: colors.light.primary,
    borderWidth: 2,
    ...SHADOWS.light.medium,
  },
  inputContainerError: {
    borderColor: colors.light.error,
    borderWidth: 2,
  },
  inputContainerDisabled: {
    backgroundColor: colors.light.border,
    opacity: 0.6,
  },
  
  // ===== ИКОНКИ =====
  leftIcon: {
    marginRight: SIZES.sm,
    color: colors.light.textSecondary,
    width: SIZES.icon.md,
    height: SIZES.icon.md,
  },
  rightIcon: {
    marginLeft: SIZES.sm,
    color: colors.light.textSecondary,
    width: SIZES.icon.md,
    height: SIZES.icon.md,
  },
  iconPressed: {
    color: colors.light.primary,
  },
  
  // ===== ПОЛЕ ВВОДА =====
  input: {
    flex: 1,
    fontSize: SIZES.fontSize.lg,
    color: colors.light.text,
    paddingVertical: SIZES.md,
    lineHeight: SIZES.lineHeight.lg,
  },
  inputWithRightIcon: {
    paddingRight: SIZES.xl,
  },
  inputWithLeftIcon: {
    paddingLeft: SIZES.xl,
  },
  inputDisabled: {
    color: colors.light.textSecondary,
  },
  inputError: {
    color: colors.light.error,
  },
  inputFocused: {
    color: colors.light.text,
  },
  
  // ===== ОШИБКИ =====
  errorContainer: {
    marginTop: SIZES.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    fontSize: SIZES.fontSize.sm,
    color: colors.light.error,
    lineHeight: SIZES.lineHeight.sm,
  },
  errorText: {
    fontSize: SIZES.fontSize.sm,
    color: colors.light.error,
    lineHeight: SIZES.lineHeight.sm,
  },
  errorIcon: {
    marginRight: SIZES.xs,
    width: SIZES.icon.xs,
    height: SIZES.icon.xs,
  },
  
  // ===== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ =====
  inputMultiline: {
    minHeight: SIZES.inputHeight.lg,
    textAlignVertical: 'top',
    paddingTop: SIZES.md,
  },
  inputWithCounter: {
    paddingBottom: SIZES.sm,
  },
  counter: {
    fontSize: SIZES.fontSize.xs,
    color: colors.light.textSecondary,
    textAlign: 'right',
    marginTop: SIZES.xs,
  },
  counterError: {
    color: colors.light.error,
  },
  
  // ===== АНИМАЦИИ =====
  inputContainerAnimated: {
    transform: [{ scale: 1.02 }],
  },
}); 