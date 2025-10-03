import { StyleSheet } from "react-native";
import { lightColors, darkColors } from "../../../constants/colors";

export const NotificationsModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: lightColors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: lightColors.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: lightColors.textSecondary,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: lightColors.textSecondary,
    textAlign: "center",
    marginTop: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
  },
  unreadNotification: {
    backgroundColor: lightColors.primary + "10",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: lightColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationIconText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  notificationTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: lightColors.text,
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: lightColors.textSecondary,
  },
  notificationMessage: {
    fontSize: 14,
    color: lightColors.textSecondary,
    lineHeight: 20,
  },
  notificationActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: lightColors.primary,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  deleteButton: {
    backgroundColor: lightColors.error,
  },
  markReadButton: {
    backgroundColor: lightColors.secondary,
  },
});

// Темные стили
export const NotificationsModalDarkStyles = StyleSheet.create({
  modalContent: {
    backgroundColor: darkColors.surface,
  },
  modalHeader: {
    borderBottomColor: darkColors.border,
  },
  modalTitle: {
    color: darkColors.text,
  },
  closeButtonText: {
    color: darkColors.textSecondary,
  },
  emptyStateText: {
    color: darkColors.textSecondary,
  },
  notificationItem: {
    borderBottomColor: darkColors.border,
  },
  notificationTitle: {
    color: darkColors.text,
  },
  notificationTime: {
    color: darkColors.textSecondary,
  },
  notificationMessage: {
    color: darkColors.textSecondary,
  },
});
