import { StyleSheet } from "react-native";
import { getCurrentColors, SHADOWS, SIZES } from "../../../constants/colors";

export const createChatListScreenStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.lg,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: SIZES.md,
    },
    headerTitle: {
      fontSize: SIZES.fontSize.xxl + 4, // Увеличиваем размер на 4
      fontWeight: "700",
      color: colors.text,
      textAlign: "left",
      marginLeft: SIZES.sm, // Сдвигаем правее
    },
    notificationBadge: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: "#EF4444",
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: SIZES.xs,
      borderWidth: 2,
      borderColor: colors.background,
    },
    notificationCount: {
      color: "#fff",
      fontSize: SIZES.fontSize.xs,
      fontWeight: "700",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: SIZES.xl,
      marginVertical: SIZES.md,
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.sm,
      backgroundColor: colors.surface,
      borderRadius: SIZES.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: SIZES.sm,
      fontSize: SIZES.fontSize.md,
      color: colors.text,
    },
    chatList: {
      flex: 1,
      paddingVertical: SIZES.sm,
    },
    chatItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SIZES.sm,
      marginHorizontal: SIZES.xl,
      padding: SIZES.md,
      borderRadius: SIZES.radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    selectionCheckbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
      borderColor: colors.primary,
      marginRight: SIZES.md,
      backgroundColor: "transparent",
    },
    selectionCheckboxActive: {
      backgroundColor: colors.primary,
    },
    avatarContainer: {
      position: "relative",
      marginRight: SIZES.md,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary, // Фирменный синий цвет FixDrive
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#10B981", // Зеленый для онлайн
      borderWidth: 2,
      borderColor: colors.background,
    },
    offlineIndicator: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#9CA3AF", // Серый для офлайн
      borderWidth: 2,
      borderColor: colors.background,
    },
    chatContent: {
      flex: 1,
    },
    chatHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: SIZES.xs,
    },
    chatNameRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    chatName: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: "600",
      color: colors.text,
      flexShrink: 1,
      marginRight: 0,
    },
    favoriteInlineIcon: {
      marginLeft: 4,
      opacity: 0.7,
    },
    chatTime: {
      fontSize: SIZES.fontSize.xs,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    chatPreview: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    chatInfo: {
      flex: 1,
    },
    carInfo: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
      marginBottom: SIZES.xs,
    },
    statusText: {
      fontSize: SIZES.fontSize.sm,
      color: "#10B981", // Зеленый для онлайн
      fontWeight: "500",
    },
    statusTextOffline: {
      fontSize: SIZES.fontSize.sm,
      color: "#9CA3AF", // Серый для офлайн
      fontWeight: "500",
    },
    lastMessage: {
      fontSize: SIZES.fontSize.md,
      color: colors.textSecondary,
      marginTop: SIZES.xs,
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 60,
    },
    unreadBadge: {
      backgroundColor: colors.primary,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: SIZES.xs,
    },
    unreadCount: {
      color: colors.background,
      fontSize: SIZES.fontSize.xs,
      fontWeight: "700",
    },
    bookmarkIcon: {
      marginTop: SIZES.xs,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: SIZES.xxl * 2,
    },
    emptyStateTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: "600",
      color: colors.text,
      marginTop: SIZES.lg,
      textAlign: "center",
    },
    emptyStateSubtitle: {
      fontSize: SIZES.fontSize.md,
      color: colors.textSecondary,
      marginTop: SIZES.sm,
      textAlign: "center",
    },
    actionButtonsContainer: {
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.md,
      backgroundColor: colors.background,
    },
    actionButtonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: SIZES.md,
    },
    actionButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.lg,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
    },
    selectAllButton: {
      backgroundColor: colors.background,
      borderColor: colors.primary,
    },
    selectAllButtonText: {
      color: colors.primary,
      fontSize: SIZES.fontSize.md,
      fontWeight: "600",
    },
    deleteButton: {
      backgroundColor: "#EF4444", // Красный цвет
      borderColor: "#EF4444",
    },
    deleteButtonText: {
      color: colors.background,
      fontSize: SIZES.fontSize.md,
      fontWeight: "600",
    },
    selectionBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    selectionInfo: {
      fontSize: SIZES.fontSize.md,
      color: colors.text,
      fontWeight: "600",
    },
    actionsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SIZES.sm,
    },
    actionBtn: {
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.sm,
      borderRadius: SIZES.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    actionBtnPrimary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    actionBtnText: {
      fontSize: SIZES.fontSize.md,
      color: colors.text,
      fontWeight: "600",
    },
    actionBtnTextPrimary: {
      color: colors.background,
    },
    swipeActions: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    swipeActionsLeft: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: SIZES.xl,
    },
    swipeActionsRight: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingRight: SIZES.xl,
    },
    swipeActionInnerLeft: {
      marginRight: 4,
    },
    swipeActionInnerRight: {
      marginLeft: 4,
    },
    swipeAction: {
      width: 100,
      height: 70,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8, // смещаем саму кнопку чуть вверх
      borderRadius: SIZES.radius.lg,
    },
    swipeActionText: {
      color: "#fff",
      fontSize: SIZES.fontSize.sm,
      fontWeight: "600",
      marginTop: SIZES.sm,
      textAlign: "center",
    },
    favoriteAction: {
      backgroundColor: "#F59E0B", // Оранжевый цвет для избранного
    },
    deleteAction: {
      backgroundColor: "#EF4444", // Красный цвет для удаления
    },
  });
};
