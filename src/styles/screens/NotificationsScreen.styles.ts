import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

export const NotificationsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  containerDark: {
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerDark: {
    backgroundColor: colors.dark.background,
    borderBottomColor: colors.dark.border,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.light.text,
    marginLeft: 8,
  },
  headerTitleDark: {
    color: colors.dark.text,
  },
  selectButton: {
    padding: 8,
  },
  markAllButton: {
    padding: 8,
    backgroundColor: colors.light.primary,
    borderRadius: 8,
  },
  markAllButtonText: {
    color: colors.light.background,
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: colors.light.textSecondary,
    marginTop: 16,
    fontWeight: "600",
  },
  emptyStateTextDark: {
    color: colors.dark.textSecondary,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  emptyStateSubtextDark: {
    color: colors.dark.textSecondary,
  },
  notificationItem: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationItemDark: {
    backgroundColor: colors.dark.surface,
    shadowColor: colors.dark.cardShadow,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: colors.light.primary,
  },
  selectedNotification: {
    backgroundColor: colors.light.primary + "10",
    borderLeftWidth: 4,
    borderLeftColor: colors.light.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.light.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
    flex: 1,
  },
  notificationTitleDark: {
    color: colors.dark.text,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.light.textTertiary,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  // Стили для режима выбора
  selectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  cancelButton: {
    fontSize: 16,
    color: colors.light.primary,
    fontWeight: "500",
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.light.text,
  },
  selectAllButton: {
    fontSize: 16,
    color: colors.light.primary,
    fontWeight: "500",
  },
  selectionActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.light.text,
  },
  deleteActionButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  deleteButtonText: {
    color: "#EF4444",
  },
});
