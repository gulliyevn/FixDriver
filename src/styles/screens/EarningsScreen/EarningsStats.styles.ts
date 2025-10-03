import { StyleSheet } from "react-native";
import { getCurrentColors, SHADOWS, SIZES } from "../../../constants/colors";

export const createEarningsStatsStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);
  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: SIZES.xl,
      marginHorizontal: SIZES.xl,
      marginBottom: SIZES.xs,
      borderRadius: SIZES.radius.lg,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    title: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: "600",
      color: colors.text,
      marginBottom: SIZES.lg,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    statCard: {
      width: "48%",
      backgroundColor: colors.background,
      borderRadius: SIZES.radius.md,
      padding: SIZES.lg,
      marginBottom: SIZES.md,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SIZES.sm,
    },
    statValue: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: "700",
      color: colors.text,
      marginBottom: SIZES.xs,
      textAlign: "center",
    },
    statSubtitle: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      marginBottom: SIZES.xs,
      textAlign: "center",
    },
    statTitle: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: SIZES.xs,
    },
    trendContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    trendIcon: {
      marginRight: SIZES.xs / 2,
    },
    trendText: {
      fontSize: SIZES.fontSize.xs,
      fontWeight: "600",
    },
    trendPositive: {
      color: colors.success,
    },
    trendNegative: {
      color: colors.error,
    },
  });
};
