import { StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

export const TripsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 6,
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
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 20,
  },
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
  addCarButton: {
    backgroundColor: "#003366",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  addCarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  carItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  carHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  carInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  carDetails: {
    marginLeft: 12,
    flex: 1,
  },
  carModel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 14,
    color: "#888",
  },
  paymentAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  carSpecs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  specValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
  },
  carActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#003366",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  addNewCarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  addNewCarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginLeft: 8,
  },
});

// Функция для получения динамических стилей в зависимости от темы
export const getTripsScreenStyles = (isDark: boolean) => {
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
    carItem: {
      backgroundColor: currentColors.surface,
    },
    carModel: {
      color: currentColors.text,
    },
    carPlate: {
      color: currentColors.textSecondary,
    },
    specValue: {
      color: currentColors.text,
    },
    specLabel: {
      color: currentColors.textSecondary,
    },
    addNewCarButton: {
      backgroundColor: currentColors.surface,
    },
    addNewCarText: {
      color: currentColors.text,
    },
  };
};
