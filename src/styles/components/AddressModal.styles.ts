import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

export const AddressModalStyles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#003366",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#ccc",
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#333",
  },
  addressInputContainer: {
    position: "relative",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    height: 100,
  },
  addressInput: {
    flex: 1,
    padding: 16,
    paddingRight: 60, // Место для иконки
    fontSize: 16,
    textAlignVertical: "top",
    color: "#333",
  },
  mapButton: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 12,
  },
  checkboxText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  // Стили для модального окна карты
  mapModalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mapModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  mapCloseButton: {
    padding: 8,
  },
  mapModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
    flex: 1,
    textAlign: "center",
  },
  mapConfirmButton: {
    padding: 8,
    backgroundColor: "#003366",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  mapConfirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  mapPlaceholder: {
    fontSize: 24,
    marginBottom: 16,
  },
  mapInstructions: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  // Стили для валидации адреса
  validationContainer: {
    marginTop: 8,
  },
  validationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  validationText: {
    fontSize: 14,
    marginLeft: 8,
    color: "#666",
  },
  validationTextValid: {
    color: "#4caf50",
  },
  validationTextInvalid: {
    color: "#f44336",
  },
  verifyButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#2196f3",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

// Функции для динамических стилей с поддержкой темной темы
export const getAddressModalStyles = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;

  return {
    modalHeader: {
      backgroundColor: currentColors.card,
      borderBottomColor: currentColors.border,
    },
    modalTitle: {
      color: currentColors.text,
    },
    formContainer: {
      backgroundColor: currentColors.background,
    },
    inputLabel: {
      color: currentColors.text,
    },
    textInput: {
      backgroundColor: currentColors.surface,
      borderColor: currentColors.border,
      color: currentColors.text,
    },
    addressInputContainer: {
      backgroundColor: currentColors.surface,
      borderColor: currentColors.border,
    },
    addressInput: {
      color: currentColors.text,
    },
    mapButton: {
      backgroundColor: currentColors.primary,
      borderColor: currentColors.primary,
    },
    checkboxText: {
      color: currentColors.text,
    },
    mapModalContainer: {
      backgroundColor: currentColors.background,
    },
    mapModalHeader: {
      backgroundColor: currentColors.card,
      borderBottomColor: currentColors.border,
    },
    mapModalTitle: {
      color: currentColors.text,
    },
    mapContainer: {
      backgroundColor: currentColors.background,
    },
    validationText: {
      color: currentColors.textSecondary,
    },
    mapInstructions: {
      color: currentColors.textSecondary,
    },
  };
};
