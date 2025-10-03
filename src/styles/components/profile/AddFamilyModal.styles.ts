import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 375;

export const AddFamilyModalStyles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 1000,
    elevation: 5,
    paddingTop: isTablet ? 60 : 80, // Меньший отступ сверху для планшетов
  },
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: isTablet ? 10 : 20, // Меньший отступ для планшетов
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: isTablet ? 24 : 20, // Больше padding для планшетов
    margin: isTablet ? 20 : 40, // Меньше margin для планшетов
    // Адаптивная ширина: на 30px шире и адаптивная к устройствам
    width: isTablet
      ? Math.min(screenWidth - 80, 500) // Для планшетов: максимум 500px, но не больше экрана минус отступы
      : isSmallScreen
        ? screenWidth - 20 // Для маленьких экранов: почти на всю ширину
        : screenWidth - 40, // Для средних экранов: стандартная ширина
    maxHeight: screenHeight * 0.8, // Максимум 80% высоты экрана
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: isTablet ? 20 : 18, // Больше для планшетов
    fontWeight: "600",
    color: "#003366",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInputContainer: {
    marginBottom: 16,
  },
  typeInputContainer: {
    position: "relative",
  },
  modalInputLabel: {
    fontSize: isTablet ? 16 : 14, // Больше для планшетов
    fontWeight: "500",
    color: "#003366",
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: isTablet ? 16 : 12, // Больше padding для планшетов
    fontSize: isTablet ? 18 : 16, // Больше для планшетов
    backgroundColor: "#fff",
  },
  modalSelectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: isTablet ? 16 : 12, // Больше padding для планшетов
    backgroundColor: "#fff",
  },
  modalSelectText: {
    fontSize: isTablet ? 18 : 16, // Больше для планшетов
    color: "#003366",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
    gap: isTablet ? 16 : 12, // Больше gap для планшетов
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: isTablet ? 16 : 12, // Больше padding для планшетов
    paddingHorizontal: isTablet ? 20 : 16, // Больше padding для планшетов
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelButtonText: {
    fontSize: isTablet ? 18 : 16, // Больше для планшетов
    color: "#666",
    fontWeight: "500",
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#003366",
    paddingVertical: isTablet ? 16 : 12, // Больше padding для планшетов
    paddingHorizontal: isTablet ? 20 : 16, // Больше padding для планшетов
    borderRadius: 8,
    alignItems: "center",
  },
  modalSaveButtonText: {
    fontSize: isTablet ? 18 : 16, // Больше для планшетов
    color: "#fff",
    fontWeight: "500",
  },
  modalSaveButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  modalSaveButtonTextDisabled: {
    color: "#999999",
  },
  typeDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: isTablet ? 250 : 200, // Больше высота для планшетов
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 1000,
  },
  typeDropdownScroll: {
    maxHeight: isTablet ? 250 : 200, // Больше высота для планшетов
  },
  typeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: isTablet ? 16 : 12, // Больше padding для планшетов
    paddingHorizontal: isTablet ? 20 : 16, // Больше padding для планшетов
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  typeOptionSelected: {
    backgroundColor: "#f8f9fa",
  },
  typeOptionLast: {
    borderBottomWidth: 0,
  },
  typeOptionText: {
    fontSize: isTablet ? 18 : 16, // Больше для планшетов
    color: "#003366",
  },
  typeOptionTextSelected: {
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
    marginLeft: 4,
  },
});

export const getAddFamilyModalColors = (isDark: boolean) => {
  const colors = isDark
    ? {
        background: "#111827",
        surface: "#1F2937",
        text: "#F9FAFB",
        textSecondary: "#9CA3AF",
        primary: "#3B82F6",
        border: "#374151",
      }
    : {
        background: "#ffffff",
        surface: "#f9f9f9",
        text: "#003366",
        textSecondary: "#666666",
        primary: "#083198",
        border: "#f0f0f0",
      };

  return {
    modalContent: { backgroundColor: colors.background },
    modalTitle: { color: colors.text },
    modalInputLabel: { color: colors.text },
    modalInput: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      color: colors.text,
    },
    modalSelectButton: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    modalSelectText: { color: colors.text },
    modalCancelButton: { backgroundColor: colors.surface },
    modalCancelButtonText: { color: colors.textSecondary },
    modalSaveButton: { backgroundColor: colors.primary },
    modalSaveButtonText: { color: colors.background },
    modalSaveButtonDisabled: { backgroundColor: "#cccccc" },
    modalSaveButtonTextDisabled: { color: "#999999" },
    typeDropdown: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    typeOption: { borderBottomColor: colors.border },
    typeOptionSelected: { backgroundColor: colors.surface },
    typeOptionText: { color: colors.text },
    typeOptionTextSelected: { color: colors.primary },
    errorText: { color: "#FF3B30" }, // Красный цвет для ошибок в обеих темах
  };
};
