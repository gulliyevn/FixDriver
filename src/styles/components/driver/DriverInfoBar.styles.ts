import { StyleSheet } from "react-native";
import { getCurrentColors, SHADOWS, SIZES } from "../../../constants/colors";

export const createDriverInfoBarStyles = (isDark: boolean) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    driverInfoBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: -SIZES.lg - 4,
      marginBottom: SIZES.xs + 6,
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.xs + 6,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
      backgroundColor: palette.surface,
      borderRadius: SIZES.radius.md,
    },
    scheduleInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: SIZES.xs,
    },
    scheduleText: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: "500",
    },
    priceInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: SIZES.xs,
    },
    priceText: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: "500",
    },
    distanceInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: SIZES.xs,
    },
    distanceText: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: "500",
    },
    timeInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: SIZES.xs,
    },
    timeText: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: "500",
    },
  });
};
