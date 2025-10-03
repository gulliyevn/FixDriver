import { StyleSheet } from "react-native";
import { SIZES, SHADOWS, getCurrentColors } from "../../constants/colors";

// Создаем функцию для получения стилей с учетом темы
export const createDriverRegisterScreenStyles = (isDark: boolean) => {
  const currentColors = getCurrentColors(isDark);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: SIZES.xl,
      paddingBottom: 40,
    },
    header: {
      alignItems: "center",
      marginBottom: SIZES.xl,
      position: "relative",
    },
    backButton: {
      position: "absolute",
      left: -24,
      top: 0,
      padding: 8,
      zIndex: 2,
    },
    title: {
      fontSize: SIZES.fontSize.title,
      fontWeight: "700",
      color: currentColors.primary,
      marginBottom: SIZES.sm,
      textAlign: "center",
    },
    subtitle: {
      fontSize: SIZES.fontSize.lg,
      color: currentColors.textSecondary,
      textAlign: "center",
      marginBottom: SIZES.lg,
    },
    form: {
      marginTop: 0,
    },
    inputContainer: {
      marginBottom: SIZES.lg,
    },
    label: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: "600",
      color: currentColors.text,
      marginBottom: SIZES.sm,
    },
    requiredLabel: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: "600",
      color: currentColors.text,
      marginBottom: SIZES.sm,
    },
    requiredStar: {
      color: currentColors.error,
      fontWeight: "bold",
    },
    infoContainer: {
      backgroundColor: isDark ? "#1F2937" : "#FEF3C7",
      borderRadius: SIZES.radius.sm,
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.sm,
      marginBottom: SIZES.lg,
      borderWidth: 1,
      borderColor: isDark ? "#374151" : "#F59E0B",
    },
    infoText: {
      fontSize: SIZES.fontSize.sm,
      color: isDark ? "#FCD34D" : "#92400E",
      textAlign: "center",
    },
    input: {
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.md,
      borderWidth: 1,
      borderColor: currentColors.border,
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      fontSize: SIZES.fontSize.lg,
      color: currentColors.text,
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
      fontSize: SIZES.fontSize.sm,
      marginTop: SIZES.xs,
    },
    registerButton: {
      marginTop: SIZES.lg,
      marginBottom: SIZES.sm,
      borderRadius: SIZES.radius.md,
      backgroundColor: currentColors.primary,
      paddingVertical: SIZES.lg,
      alignItems: "center",
      minHeight: SIZES.buttonHeight.md,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    registerButtonText: {
      color: "#fff",
      fontSize: SIZES.fontSize.xl,
      fontWeight: "700",
    },
    registerButtonDisabled: {
      backgroundColor: currentColors.border,
      opacity: 0.6,
    },
    loginLink: {
      color: currentColors.primary,
      textDecorationLine: "underline",
      fontWeight: "600",
      fontSize: SIZES.fontSize.lg,
      textAlign: "center",
      marginTop: SIZES.xl,
    },
    loginRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-end",
      marginTop: SIZES.sm,
    },
    alreadyRegisteredText: {
      color: currentColors.textSecondary,
      fontSize: SIZES.fontSize.md,
      fontWeight: "400",
      paddingRight: 2,
    },
    loginLinkSmall: {
      color: currentColors.primary,
      fontSize: SIZES.fontSize.md,
      fontWeight: "700",
      textDecorationLine: "underline",
    },
    agreeText: {
      color: currentColors.text,
      fontSize: SIZES.fontSize.sm,
      flex: 1,
      flexWrap: "wrap",
    },
    link: {
      color: currentColors.primary,
      textDecorationLine: "underline",
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: currentColors.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.xl,
      width: "85%",
      maxWidth: 400,
      alignItems: "center",
      shadowColor: currentColors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.2,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    modalTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: "700",
      color: currentColors.primary,
      marginBottom: SIZES.md,
      textAlign: "center",
    },
    modalText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.text,
      marginBottom: SIZES.lg,
      textAlign: "left",
    },
    modalCloseBtn: {
      marginTop: SIZES.lg,
      backgroundColor: currentColors.primary,
      borderRadius: SIZES.radius.sm,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.xl,
    },
    modalCloseText: {
      color: currentColors.surface,
      fontSize: SIZES.fontSize.lg,
      fontWeight: "700",
    },
    uploadButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.md,
      borderWidth: 2,
      borderColor: currentColors.border,
      borderStyle: "dashed",
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.md,
      marginTop: SIZES.xs,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    uploadButtonDisabled: {
      opacity: 0.6,
      backgroundColor: currentColors.background,
    },
    uploadButtonText: {
      color: currentColors.primary,
      fontSize: SIZES.fontSize.md,
      fontWeight: "600",
      marginLeft: SIZES.sm,
    },
    uploadButtonIcon: {
      color: currentColors.primary,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SIZES.sm,
      flexWrap: "wrap",
      flex: 1,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: currentColors.border,
      backgroundColor: currentColors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginRight: SIZES.sm,
    },
    checkboxChecked: {
      borderColor: currentColors.primary,
      backgroundColor: currentColors.primary,
    },
  });
};

// Для обратной совместимости
export const DriverRegisterScreenStyles =
  createDriverRegisterScreenStyles(false);

// Функция для получения цвета плейсхолдера в зависимости от темы
export const getPlaceholderColor = (isDark: boolean) => {
  return isDark ? "#9CA3AF" : "#374151";
};

// Для обратной совместимости
export const PLACEHOLDER_COLOR = "#374151";
