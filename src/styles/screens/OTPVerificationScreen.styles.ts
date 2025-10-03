import { StyleSheet } from "react-native";
import { SIZES, SHADOWS, getCurrentColors } from "../../constants/colors";

// Создаем функцию для получения стилей с учетом темы
export const createOTPVerificationScreenStyles = (isDark: boolean) => {
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
    emailText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.primary,
      fontWeight: "600",
      textAlign: "center",
      marginTop: SIZES.sm,
    },
    otpContainer: {
      marginBottom: SIZES.xxl,
    },
    otpInputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: SIZES.xl,
    },
    otpInput: {
      width: 50,
      height: 50,
      borderWidth: 2,
      borderColor: currentColors.border,
      borderRadius: SIZES.radius.md,
      textAlign: "center",
      fontSize: SIZES.fontSize.xl,
      fontWeight: "700",
      color: currentColors.text,
      backgroundColor: currentColors.surface,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    otpInputFocused: {
      borderColor: currentColors.primary,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    otpInputError: {
      borderColor: currentColors.error,
    },
    errorText: {
      color: currentColors.error,
      fontSize: SIZES.fontSize.md,
      textAlign: "center",
      marginTop: SIZES.sm,
      lineHeight: SIZES.lineHeight.md,
    },
    verifyButton: {
      marginBottom: SIZES.lg,
      backgroundColor: currentColors.primary,
      borderRadius: SIZES.radius.md,
      paddingVertical: SIZES.lg,
      alignItems: "center",
      minHeight: SIZES.buttonHeight.md,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    verifyButtonText: {
      color: currentColors.surface,
      fontSize: SIZES.fontSize.lg,
      fontWeight: "600",
      lineHeight: SIZES.lineHeight.lg,
    },
    verifyButtonDisabled: {
      backgroundColor: currentColors.border,
      opacity: 0.6,
    },
    resendContainer: {
      alignItems: "center",
      marginTop: SIZES.xl,
    },
    resendText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: "center",
      lineHeight: SIZES.lineHeight.md,
    },
    resendButton: {
      marginTop: SIZES.sm,
    },
    resendButtonText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.primary,
      fontWeight: "600",
      textDecorationLine: "underline",
      lineHeight: SIZES.lineHeight.md,
    },
    resendButtonDisabled: {
      color: currentColors.border,
      textDecorationLine: "none",
    },
    timerText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: "center",
      marginTop: SIZES.sm,
      lineHeight: SIZES.lineHeight.md,
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
  });
};

// Для обратной совместимости
export const OTPVerificationScreenStyles =
  createOTPVerificationScreenStyles(false);
