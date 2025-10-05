import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export const createTimePickerModalStyles = (
  isDark: boolean,
  primaryColor?: string,
) =>
  StyleSheet.create({
    // Основной контейнер модального окна
    modalOverlay: {
      flex: 1,
      backgroundColor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
    },

    // Контейнер модального окна
    modalContainer: {
      width: Math.min(screenWidth * 0.9, 400),
      borderRadius: 16,
      padding: 20,
      backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
      shadowColor: isDark ? "#000000" : "#000000",
      shadowOffset: {
        width: 0,
        height: isDark ? 4 : 2,
      },
      shadowOpacity: isDark ? 0.5 : 0.25,
      shadowRadius: isDark ? 8 : 4,
      elevation: isDark ? 8 : 4,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? "#333333" : "transparent",
    },

    // Заголовок модального окна
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 16,
      color: isDark ? "#FFFFFF" : "#000000",
      letterSpacing: 0.5,
    },

    // Контейнер для DateTimePicker
    pickerContainer: {
      alignItems: "center",
      marginVertical: 16,
      paddingVertical: 8,
      backgroundColor: isDark ? "#2A2A2A" : "#F8F9FA",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? "#404040" : "#E9ECEF",
    },

    // Стили для DateTimePicker (iOS)
    iosPicker: {
      width: "100%",
      height: 200,
      backgroundColor: "transparent",
    },

    // Стили для DateTimePicker (Android)
    androidPicker: {
      width: "100%",
      height: 50,
      backgroundColor: "transparent",
    },

    // Контейнер кнопок
    buttonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? "#404040" : "#E9ECEF",
    },

    // Кнопка отмены
    cancelButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginRight: 8,
      borderRadius: 8,
      backgroundColor: isDark ? "#333333" : "#F8F9FA",
      borderWidth: 1,
      borderColor: isDark ? "#404040" : "#DEE2E6",
      alignItems: "center",
    },

    // Кнопка подтверждения
    confirmButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginLeft: 8,
      borderRadius: 8,
      backgroundColor: primaryColor || "#007AFF", // Используем переданный цвет или fallback
      alignItems: "center",
    },

    // Текст кнопки отмены
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: isDark ? "#CCCCCC" : "#6C757D",
    },

    // Текст кнопки подтверждения
    confirmButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },

    // Анимация появления (для iOS)
    modalAnimation: {
      transform: [{ scale: 1 }],
    },

    // Адаптивные размеры для разных экранов
    smallScreen: {
      width: Math.min(screenWidth * 0.95, 350),
      padding: 16,
    },

    largeScreen: {
      width: Math.min(screenWidth * 0.85, 450),
      padding: 24,
    },

    // Стили для темной темы - дополнительные акценты
    darkThemeAccent: {
      backgroundColor: isDark ? "#2A2A2A" : "#FFFFFF",
      borderColor: isDark ? "#404040" : "#E9ECEF",
    },

    // Стили для светлой темы - дополнительные акценты
    lightThemeAccent: {
      backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
      shadowColor: isDark ? "#000000" : "#000000",
      shadowOpacity: isDark ? 0.5 : 0.25,
    },
  });

// Дополнительные стили для разных платформ
export const platformSpecificStyles = {
  ios: {
    modalContainer: {
      borderRadius: 20,
      shadowRadius: 10,
    },
    pickerContainer: {
      borderRadius: 16,
    },
  },
  android: {
    modalContainer: {
      borderRadius: 12,
      elevation: 8,
    },
    pickerContainer: {
      borderRadius: 8,
    },
  },
};
