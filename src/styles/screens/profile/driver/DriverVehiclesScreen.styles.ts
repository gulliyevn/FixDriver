import { StyleSheet } from "react-native";
import { colors } from "../../../../constants/colors";

export const DriverVehiclesScreenStyles = StyleSheet.create({
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
  },
  headerSpacing: {
    height: 20, // Отступ под хедером
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
  // Форма
  form: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 8,
  },
  requiredStar: {
    color: "#e53935",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 12,
    color: "#e53935",
    marginTop: 4,
    marginLeft: 4,
  },
  // Карточка автомобиля
  vehicleList: {
    flex: 1,
  },
  vehicleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
    marginLeft: 8,
  },
  vehicleDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#003366",
    fontWeight: "600",
  },
  photoContainer: {
    marginTop: 8,
  },
  photoPreview: {
    width: 80,
    height: 80,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  // Кнопка сохранения
  saveButton: {
    backgroundColor: "#003366",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  // Состояния загрузки и ошибок
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: "#003366",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export const getDriverVehiclesScreenColors = (isDark: boolean) => {
  const currentColors = isDark ? colors.dark : colors.light;

  return {
    container: { backgroundColor: currentColors.background },
    header: {
      backgroundColor: currentColors.background,
      borderBottomColor: currentColors.border,
    },
    title: { color: currentColors.text },
    emptyTitle: { color: currentColors.text },
    emptyDescription: { color: currentColors.textSecondary },
    label: { color: currentColors.text },
    input: {
      backgroundColor: currentColors.surface,
      borderColor: currentColors.border,
      color: currentColors.text,
    },
    errorText: { color: currentColors.error },
    vehicleCard: {
      backgroundColor: currentColors.surface,
      shadowColor: "#000",
    },
    vehicleTitle: { color: currentColors.text },
    detailLabel: { color: currentColors.textSecondary },
    detailValue: { color: currentColors.text },
    photoPreview: { backgroundColor: currentColors.border },
    detailRow: { borderBottomColor: currentColors.border },
    saveButton: { backgroundColor: currentColors.primary },
    saveButtonText: { color: "#ffffff" },
    loadingText: { color: currentColors.textSecondary },
    retryButton: { backgroundColor: currentColors.primary },
    retryButtonText: { color: "#ffffff" },
    emptyText: { color: currentColors.text },
    emptySubtext: { color: currentColors.textSecondary },
  };
};
