import { StyleSheet } from "react-native";

export const EditDriverProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  // Секции
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 16,
  },

  // Поля ввода
  inputField: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 8,
    marginLeft: 10,
  },

  // Кнопка стать водителем
  becomeDriverSection: {
    marginBottom: 24,
  },
  becomeDriverButton: {
    backgroundColor: "#003366",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  becomeDriverText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Кнопка добавления автомобиля
  addVehicleButton: {
    backgroundColor: "#3B82F6", // Цвет активной иконки заработка
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  // Кнопка сохранения
  saveButton: {
    backgroundColor: "#003366",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Стили для свайпа
  swipeActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  swipeActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 16,
  },
  swipeActionsRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 16,
  },
  swipeActionInnerLeft: {
    marginRight: 4,
  },
  swipeActionInnerRight: {
    marginLeft: 4,
  },
  swipeAction: {
    width: 100,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderRadius: 12,
  },
  swipeActionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  favoriteAction: {
    backgroundColor: "#F59E0B",
  },
  deleteAction: {
    backgroundColor: "#EF4444",
  },
});

export const getEditDriverProfileScreenColors = (isDark: boolean) => {
  const colors = isDark
    ? {
        background: "#111827",
        surface: "#1F2937",
        text: "#F9FAFB",
        textSecondary: "#9CA3AF",
        primary: "#3B82F6",
        border: "#374151",
        card: "#1F2937",
        danger: "#F87171",
      }
    : {
        background: "#ffffff",
        surface: "#f9f9f9",
        text: "#003366",
        textSecondary: "#666666",
        primary: "#083198",
        border: "#f0f0f0",
        card: "#ffffff",
        danger: "#e53935",
      };

  return {
    container: { backgroundColor: colors.background },

    sectionTitle: { color: colors.text },
    inputField: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text,
    },
    inputLabel: { color: colors.text },

    addVehicleButton: { backgroundColor: colors.primary }, // Используем primary цвет для каждой темы
  };
};
