import { StyleSheet } from "react-native";
import { getCurrentColors, SHADOWS, SIZES } from "../../../../constants/colors";

export const createHeaderStyles = (
  isDark: boolean,
  role: "client" | "driver" = "client",
) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    driverItem: {
      flexDirection: "column",
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.sm,
      borderRadius: SIZES.radius.lg + 2,
      backgroundColor: palette.surface,
      ...(role === "driver" && {
        borderWidth: 1,
        borderColor: palette.border,
      }),
      ...(role === "driver" &&
        (isDark ? SHADOWS.dark.medium : SHADOWS.light.medium)),
    },
    driverHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: -SIZES.sm,
      marginBottom: SIZES.lg + 6,
      paddingTop: 0,
      paddingBottom: SIZES.md + 6,
    },
    driverHeaderContainer: {
      position: "relative",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: palette.surface,
      borderRadius: 50,
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.sm,
      ...(role === "driver" && {
        borderWidth: 1,
        borderColor: palette.border,
      }),
      ...(role === "client" && {
        width: "110%",
        borderRadius: SIZES.radius.lg,
        minHeight: 0,
        paddingHorizontal: SIZES.xxl,
        paddingVertical: 0,
        marginVertical: -SIZES.sm,
        alignSelf: "center",
      }),
      minHeight: 70,
      ...(role === "driver" &&
        (isDark ? SHADOWS.dark.small : SHADOWS.light.small)),
    },
    avatarAndInfoRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      zIndex: 1,
      ...(role === "client" && {
        justifyContent: "flex-start",
        marginLeft: -SIZES.md,
      }),
    },
    driverMainInfo: {
      flex: 1,
      marginLeft: SIZES.md,
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: SIZES.xs,
    },
    driverName: {
      fontSize: SIZES.fontSize.md,
      fontWeight: "600",
      color: palette.text,
      flexShrink: 1,
      ...(role === "client" && {
        fontSize: SIZES.fontSize.lg,
      }),
    },
    premiumIcon: {
      marginLeft: SIZES.xs,
    },
    vehicleExpandRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 2,
    },
    vehicleInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    vehicleInfo: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: "500",
    },
    childIcon: {
      marginRight: SIZES.xs,
    },
  });
};
