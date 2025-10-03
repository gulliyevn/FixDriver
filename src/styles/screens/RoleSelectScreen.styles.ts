import { StyleSheet } from "react-native";
import { SIZES, SHADOWS, getCurrentColors } from "../../constants/colors";

// Создаем функцию для получения стилей с учетом темы
export const createRoleSelectScreenStyles = (isDark: boolean) => {
  const currentColors = getCurrentColors(isDark);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    spacerTop: {
      height: 40,
    },
    headerLogo: {
      alignItems: "center",
      marginBottom: 20,
    },
    logoIconWrap: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: currentColors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    logoText: {
      fontSize: 28,
      fontWeight: "700",
      color: currentColors.text,
      letterSpacing: 1,
    },
    spacerLogoBottom: {
      height: 20,
    },
    title: {
      fontSize: SIZES.fontSize.title,
      fontWeight: "700",
      color: currentColors.text,
      textAlign: "center",
      marginBottom: SIZES.xxxl,
      lineHeight: SIZES.lineHeight.title,
    },
    card: {
      backgroundColor: currentColors.surface,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.xl,
      marginBottom: SIZES.xl,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    cardHeader: {
      alignItems: "center",
      marginBottom: SIZES.lg,
    },
    cardIconWrap: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isDark ? "#1F2937" : "#F3F4F6",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SIZES.md,
    },
    cardTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: "700",
      color: currentColors.text,
      textAlign: "center",
      marginBottom: SIZES.xs,
    },
    cardSubtitle: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: "center",
      lineHeight: SIZES.lineHeight.md,
    },
    cardContent: {
      marginBottom: SIZES.xl,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SIZES.md,
    },
    featureText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.text,
      marginLeft: SIZES.sm,
      flex: 1,
      lineHeight: SIZES.lineHeight.md,
    },
    chooseBtn: {
      borderRadius: SIZES.radius.md,
      paddingVertical: SIZES.lg,
      alignItems: "center",
      minHeight: SIZES.buttonHeight.md,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    chooseBtnClient: {
      backgroundColor: currentColors.success,
    },
    chooseBtnDriver: {
      backgroundColor: currentColors.warning,
    },
    chooseBtnText: {
      color: "#FFFFFF",
      fontSize: SIZES.fontSize.lg,
      fontWeight: "600",
      lineHeight: SIZES.lineHeight.lg,
    },
    loginRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 24,
      marginBottom: 8,
    },
    loginText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      lineHeight: SIZES.lineHeight.md,
    },
    loginLink: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.primary,
      fontWeight: "600",
      marginLeft: SIZES.xs,
      lineHeight: SIZES.lineHeight.md,
    },
    spacerLoginLang: {
      height: 16,
    },
    langWrap: {
      alignItems: "center",
    },
    spacerBottom: {
      height: 20,
    },
  });
};

// Для обратной совместимости
export const RoleSelectScreenStyles = createRoleSelectScreenStyles(false);
