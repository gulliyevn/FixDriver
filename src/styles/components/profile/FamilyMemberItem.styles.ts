import { StyleSheet } from "react-native";

export const createFamilyMemberItemStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },

    // Заголовок члена семьи
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: isDark ? "#1F2937" : "#f9f9f9",
      borderRadius: 8,
      marginBottom: 8,
    },

    headerTextContainer: {
      flex: 1,
    },

    headerName: {
      fontSize: 16,
      fontWeight: "500",
      color: isDark ? "#F9FAFB" : "#003366",
    },

    headerSubtitle: {
      fontSize: 14,
      color: isDark ? "#9CA3AF" : "#666666",
    },

    headerIcon: {
      transform: [{ rotate: "0deg" }],
    },

    // Расширенная информация
    expandedContainer: {
      backgroundColor: isDark ? "#1F2937" : "#f9f9f9",
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
    },

    // Поля формы
    fieldContainer: {
      marginBottom: 16,
    },

    fieldLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: isDark ? "#F9FAFB" : "#003366",
      marginBottom: 8,
    },

    fieldInput: {
      borderWidth: 1,
      borderColor: isDark ? "#374151" : "#e0e0e0",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: isDark ? "#111827" : "#fff",
      color: isDark ? "#F9FAFB" : "#003366",
    },

    fieldDisplay: {
      borderWidth: 1,
      borderColor: isDark ? "#374151" : "#e0e0e0",
      borderRadius: 8,
      padding: 12,
      backgroundColor: isDark ? "#111827" : "#fff",
    },

    fieldText: {
      fontSize: 16,
      color: isDark ? "#F9FAFB" : "#003366",
    },

    // Выпадающий список типов
    typeDropdownContainer: {
      position: "relative",
    },

    typeDropdownButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: isDark ? "#374151" : "#e0e0e0",
      borderRadius: 8,
      padding: 12,
      backgroundColor: isDark ? "#111827" : "#fff",
    },

    typeDropdownText: {
      fontSize: 16,
      color: isDark ? "#F9FAFB" : "#003366",
    },

    typeDropdownList: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: isDark ? "#111827" : "#fff",
      borderWidth: 1,
      borderColor: isDark ? "#374151" : "#e0e0e0",
      borderRadius: 8,
      marginTop: 4,
      maxHeight: 200,
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      zIndex: 1000,
    },

    typeDropdownItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#374151" : "#f0f0f0",
    },

    typeDropdownItemLast: {
      borderBottomWidth: 0,
    },

    typeDropdownItemSelected: {
      backgroundColor: isDark ? "#1F2937" : "#f8f9fa",
    },

    typeDropdownItemText: {
      fontSize: 16,
      color: isDark ? "#F9FAFB" : "#003366",
      fontWeight: "400",
    },

    typeDropdownItemTextSelected: {
      fontWeight: "600",
    },

    // Телефон
    phoneContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: isDark ? "#374151" : "#e0e0e0",
      borderRadius: 8,
      padding: 12,
      backgroundColor: isDark ? "#111827" : "#fff",
    },

    phoneInput: {
      flex: 1,
      borderWidth: 0,
      backgroundColor: "transparent",
      padding: 0,
      margin: 0,
      fontSize: 16,
      color: isDark ? "#F9FAFB" : "#003366",
    },

    phoneText: {
      flex: 1,
      fontSize: 16,
      color: isDark ? "#F9FAFB" : "#003366",
    },

    clearButton: {
      paddingHorizontal: 2,
      paddingVertical: 6,
      marginLeft: 4,
    },

    verifyButton: {
      paddingHorizontal: 2,
      paddingVertical: 6,
      marginLeft: 4,
    },

    verifyButtonDisabled: {
      opacity: 0.5,
    },

    // Кнопки действий
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },

    deleteButton: {
      flex: 1,
      backgroundColor: "#dc3545",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },

    saveButton: {
      flex: 1,
      backgroundColor: isDark ? "#3B82F6" : "#083198",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },

    editButton: {
      backgroundColor: isDark ? "#3B82F6" : "#083198",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },

    buttonText: {
      fontSize: 16,
      color: "#fff",
      fontWeight: "500",
    },

    // Последний элемент в списке
    lastFieldContainer: {
      marginBottom: 20,
    },
  });
