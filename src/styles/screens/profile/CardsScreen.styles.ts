import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const CardsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 45, // Устанавливаем отступ сверху
    paddingBottom: 6, // Отступ снизу
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 16, // Отступ под хедером
  },
  // Пустое состояние
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#003366",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 32,
  },
  addCardButton: {
    backgroundColor: "#003366",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  addCardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // Карточки
  cardItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardDetails: {
    marginLeft: 12,
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: "#888",
  },
  deleteButton: {
    padding: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardType: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
  },
  cardExpiry: {
    fontSize: 14,
    color: "#888",
  },
  // Добавить новую карту
  addNewCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  addNewCardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginTop: -80,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 10,
    padding: 14,
    marginBottom: 4,
    color: "#003366",
    backgroundColor: "#fff",
    fontFamily: "System",
    fontSize: 15,
    fontWeight: "400",
  },
  errorText: {
    color: "#e53935",
    fontSize: 12,
    marginBottom: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  modalButtonCancel: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginRight: 8,
  },
  modalButtonSave: {
    backgroundColor: "#003366",
    marginLeft: 8,
  },
  modalButtonDisabled: {
    backgroundColor: "#f9f9f9",
    opacity: 0.5,
  },
  // Инлайн стили из компонента
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  inputWithIcon: {
    paddingRight: 80,
  },
  scanButton: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 32,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  inputFlex: {
    flex: 1,
  },
  errorRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  errorContainer: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cardNumberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardExpiryWithMargin: {
    marginLeft: 12,
  },
  defaultButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  defaultButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardTypeIndicator: {
    position: "absolute",
    right: 50,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 32,
  },
});

// Функция для получения динамических стилей в зависимости от темы
export const getCardsScreenStyles = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;

  return {
    container: {
      backgroundColor: currentColors.background,
    },
    header: {
      borderBottomColor: currentColors.border,
    },
    title: {
      color: currentColors.text,
    },
    emptyTitle: {
      color: currentColors.text,
    },
    emptyDescription: {
      color: currentColors.textSecondary,
    },
    cardItem: {
      backgroundColor: currentColors.surface,
    },
    cardName: {
      color: currentColors.text,
    },
    cardNumber: {
      color: currentColors.textSecondary,
    },
    cardType: {
      color: currentColors.text,
    },
    cardExpiry: {
      color: currentColors.textSecondary,
    },
    addNewCardButton: {
      backgroundColor: currentColors.surface,
    },
    addNewCardText: {
      color: currentColors.text,
    },
    // Динамические стили для инлайн элементов
    modalContainer: {
      backgroundColor: currentColors.surface,
    },
    modalTitle: {
      color: currentColors.text,
    },
    input: {
      color: currentColors.text,
      backgroundColor: currentColors.background,
      borderColor: currentColors.border,
    },
    inputFlex: {
      color: currentColors.text,
      backgroundColor: currentColors.background,
      borderColor: currentColors.border,
      flex: 1,
    },
    errorText: {
      color: currentColors.error,
    },
    modalButtonCancel: {
      borderColor: currentColors.border,
      backgroundColor: currentColors.surface,
    },
    modalButtonText: {
      color: currentColors.text,
    },
    modalButtonSave: {
      backgroundColor: currentColors.primary,
    },
    modalButtonSaveDisabled: {
      backgroundColor: currentColors.surface,
    },
    modalButtonTextSave: {
      color: "#fff",
    },
    modalButtonTextSaveDisabled: {
      color: currentColors.textSecondary,
    },
    cardExpiryWithMargin: {
      marginLeft: 12,
    },
    defaultButton: {
      backgroundColor: currentColors.primary,
      borderWidth: 0,
    },
    defaultButtonInactive: {
      backgroundColor: currentColors.surface,
      borderWidth: 1,
      borderColor: currentColors.primary,
    },
    defaultButtonText: {
      color: "#fff",
    },
    defaultButtonTextInactive: {
      color: currentColors.primary,
    },
  };
};
