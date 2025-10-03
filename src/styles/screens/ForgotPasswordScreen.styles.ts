import { StyleSheet } from "react-native";
import { SIZES, SHADOWS, getCurrentColors } from "../../constants/colors";

// Создаем функцию для получения стилей с учетом темы
export const createForgotPasswordScreenStyles = (isDark: boolean) => {
  const currentColors = getCurrentColors(isDark);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    content: {
      flex: 1,
      padding: SIZES.xl,
      justifyContent: "center",
    },
    header: {
      alignItems: "center",
      marginBottom: SIZES.xxxl,
    },
    title: {
      fontSize: SIZES.fontSize.title,
      fontWeight: "700",
      color: currentColors.text,
      marginBottom: SIZES.sm,
      textAlign: "center",
      lineHeight: SIZES.lineHeight.title,
    },
    subtitle: {
      fontSize: SIZES.fontSize.lg,
      color: currentColors.textSecondary,
      textAlign: "center",
      lineHeight: SIZES.lineHeight.lg,
    },
    form: {
      marginBottom: SIZES.xxl,
    },
    inputContainer: {
      marginBottom: SIZES.xl,
    },
    label: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: "600",
      color: currentColors.text,
      marginBottom: SIZES.sm,
      lineHeight: SIZES.lineHeight.lg,
    },
    input: {
      marginBottom: SIZES.lg,
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.md,
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      fontSize: SIZES.fontSize.lg,
      color: currentColors.text,
      borderWidth: 1,
      borderColor: currentColors.border,
      minHeight: SIZES.inputHeight.md,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    inputFocused: {
      borderColor: currentColors.primary,
      borderWidth: 2,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    inputError: {
      borderColor: currentColors.error,
      borderWidth: 2,
    },
    errorText: {
      color: currentColors.error,
      fontSize: SIZES.fontSize.md,
      marginTop: SIZES.xs,
      lineHeight: SIZES.lineHeight.md,
    },
    submitButton: {
      marginBottom: SIZES.lg,
      backgroundColor: currentColors.primary,
      borderRadius: SIZES.radius.md,
      paddingVertical: SIZES.lg,
      alignItems: "center",
      minHeight: SIZES.buttonHeight.md,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    submitButtonText: {
      color: currentColors.surface,
      fontSize: SIZES.fontSize.lg,
      fontWeight: "600",
      lineHeight: SIZES.lineHeight.lg,
    },
    submitButtonDisabled: {
      backgroundColor: currentColors.border,
      opacity: 0.6,
    },
    backButton: {
      alignItems: "center",
      marginTop: SIZES.xl,
    },
    backButtonText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.primary,
      textDecorationLine: "underline",
      lineHeight: SIZES.lineHeight.md,
    },
    successContainer: {
      alignItems: "center",
      marginBottom: SIZES.xxl,
    },
    successIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: currentColors.success,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SIZES.lg,
    },
    successTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: "700",
      color: currentColors.text,
      marginBottom: SIZES.sm,
      textAlign: "center",
    },
    successText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: "center",
      lineHeight: SIZES.lineHeight.md,
    },
  });
};

// Для обратной совместимости
export const ForgotPasswordScreenStyles =
  createForgotPasswordScreenStyles(false);
