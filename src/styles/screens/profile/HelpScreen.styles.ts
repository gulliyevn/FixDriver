import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const HelpScreenStyles = StyleSheet.create({
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  description: {
    fontSize: 16,
    color: "#888",
    marginBottom: 24,
    textAlign: "center",
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 8,
  },
  helpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  helpInfo: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 14,
  },
  errorIcon: {
    marginRight: 4,
  },
  contactSection: {
    marginTop: 32,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#25D366",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  contactButtonDisabled: {
    opacity: 0.6,
  },
  supportIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

// Функции для динамических стилей с поддержкой темной темы
export const getHelpScreenStyles = (isDark: boolean) => {
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
    description: {
      color: currentColors.textSecondary,
    },
    helpItem: {
      backgroundColor: currentColors.surface,
    },
    helpIcon: {
      backgroundColor: currentColors.surface,
    },
    helpTitle: {
      color: currentColors.text,
    },
    helpDescription: {
      color: currentColors.textSecondary,
    },
    contactTitle: {
      color: currentColors.text,
    },
    contactDescription: {
      color: currentColors.textSecondary,
    },
  };
};
