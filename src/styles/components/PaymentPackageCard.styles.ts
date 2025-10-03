import { StyleSheet } from "react-native";

export const PaymentPackageCardStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selected: {
    borderColor: "#3B82F6",
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  disabled: {
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Стили для темной темы
  containerDark: {
    backgroundColor: "#1F2937",
  },
  containerLight: {
    backgroundColor: "#FFFFFF",
  },
  borderDark: {
    borderColor: "#374151",
  },
  borderLight: {
    borderColor: "#E5E7EB",
  },
  titleDark: {
    color: "#F9FAFB",
  },
  titleLight: {
    color: "#1F2937",
  },
  priceSelected: {
    color: "#3B82F6",
  },
  priceDark: {
    color: "#9CA3AF",
  },
  priceLight: {
    color: "#6B7280",
  },
  descriptionDark: {
    color: "#9CA3AF",
  },
  descriptionLight: {
    color: "#6B7280",
  },
});
