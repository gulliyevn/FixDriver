import { StyleSheet } from "react-native";
import { getCurrentColors } from "../../constants/colors";

export const createFixDriveAddressInputStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    container: {
      marginTop: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 12,
    },
    addressContainer: {
      marginBottom: 12,
    },
    addressInputContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 40,
    },
    iconContainer: {
      marginRight: 12,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 8,
    },
    threeLinesContainer: {
      flexDirection: "column",
      alignItems: "center",
      marginLeft: 8,
    },
    line: {
      width: 12,
      height: 2,
      backgroundColor: colors.textSecondary,
      marginBottom: 2,
    },
    lastLine: {
      marginBottom: 0,
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 8,
    },
    mapButton: {
      position: "absolute",
      right: 10,
      top: 10,
      justifyContent: "center",
      alignItems: "center",
      width: 30,
      height: 30,
      zIndex: 1000,
    },
    additionalContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginTop: 12,
      minHeight: 150,
    },
    additionalText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
};
