import { StyleSheet } from "react-native";

export const createTimeSchedulePageStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      padding: 0,
    },
    switchesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    switchLabelsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    switchLabel: {
      fontSize: 12,
      textAlign: "center",
      width: 100,
    },
    switchToggleDisabled: {
      opacity: 0.5,
    },
    saveButton: {
      paddingVertical: 12,
      marginHorizontal: 20,
      marginTop: 8,
      marginBottom: 20,
      borderRadius: 8,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
  });

// Константы для цветов контейнеров
export const CONTAINER_COLORS = {
  GREEN: "#4CAF50", // отправление
  BLUE: "#1565C0", // назначение
  YELLOW: "#FFF59D", // обратно
  GREY: "#9E9E9E", // остановки
} as const;
