import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

export const FixDriveDropdownStyles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 16,
    position: "relative",
  },
  dropdownLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "500",
    color: "#003366",
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: isTablet ? 16 : 12,
    backgroundColor: "#fff",
  },
  dropdownButtonText: {
    fontSize: isTablet ? 18 : 16,
    color: "#003366",
  },
  dropdownButtonPlaceholder: {
    fontSize: isTablet ? 18 : 16,
    color: "#9CA3AF",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: isTablet ? 250 : 200,
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
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 20 : 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownOptionSelected: {
    backgroundColor: "#f8f9fa",
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: isTablet ? 18 : 16,
    color: "#003366",
  },
  dropdownOptionTextSelected: {
    fontWeight: "600",
  },
});

export const getFixDriveDropdownColors = (isDark: boolean) => {
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
    dropdownLabel: { color: colors.text },
    dropdownButton: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    dropdownButtonText: { color: colors.text },
    dropdownButtonPlaceholder: { color: colors.textSecondary },
    dropdownList: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    dropdownOption: { borderBottomColor: colors.border },
    dropdownOptionSelected: { backgroundColor: colors.surface },
    dropdownOptionText: { color: colors.text },
    dropdownOptionTextSelected: { color: colors.primary },
  };
};
