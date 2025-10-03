import { StyleSheet } from "react-native";

export const ProfileNotificationsModalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
  },
  markAllReadButton: {
    marginRight: 16,
  },
  markAllReadText: {
    color: "#007AFF",
    fontSize: 16,
  },
  // Стили для темной темы
  containerDark: {
    backgroundColor: "#000000",
  },
  containerLight: {
    backgroundColor: "#F2F2F7",
  },
  notificationItemDark: {
    borderBottomColor: "#374151",
    backgroundColor: "#1F2937",
  },
  notificationItemLight: {
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  notificationTitleDark: {
    color: "#F9FAFB",
  },
  notificationTitleLight: {
    color: "#1F2937",
  },
  notificationMessageDark: {
    color: "#9CA3AF",
  },
  notificationMessageLight: {
    color: "#6B7280",
  },
  notificationTimeDark: {
    color: "#6B7280",
  },
  notificationTimeLight: {
    color: "#9CA3AF",
  },
  headerDark: {
    borderBottomColor: "#374151",
    backgroundColor: "#1F2937",
  },
  headerLight: {
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  headerTitleDark: {
    color: "#F9FAFB",
  },
  headerTitleLight: {
    color: "#1F2937",
  },
});
