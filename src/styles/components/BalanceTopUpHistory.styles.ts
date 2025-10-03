import { StyleSheet } from "react-native";

export const SWITCH_COLORS = {
  active: "#3B82F6",
  inactive: "#10B981",
};

export const BalanceTopUpHistoryStyles = StyleSheet.create({
  container: {
    marginTop: -8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  transactionsList: {
    maxHeight: 400,
  },
  transactionItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginBottom: 8,
    marginHorizontal: 8,
  },
  transactionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 80,
    textAlign: "right",
    marginBottom: 4,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  statusBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "500",
  },
  switchContainer: {
    width: 56,
    height: 32,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    position: "relative",
  },
  switchThumb: {
    width: 28,
    height: 28,
    backgroundColor: "white",
    borderRadius: 14,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchIcon: {
    flex: 1,
    alignItems: "center",
  },
  switchIconImage: {
    color: "#ffffff",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
});

export const getBalanceTopUpHistoryStyles = (isDark: boolean) => {
  const colors = isDark
    ? {
        text: "#F9FAFB",
        textSecondary: "#9CA3AF",
        textTertiary: "#6B7280",
        border: "#4B5563",
        surface: "#374151",
      }
    : {
        text: "#1F2937",
        textSecondary: "#6B7280",
        textTertiary: "#9CA3AF",
        border: "#F3F4F6",
        surface: "#F9FAFB",
      };

  return {
    title: { color: colors.text },
    transactionItem: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    transactionTitle: { color: colors.text },
    transactionDate: { color: colors.textTertiary },
  };
};
