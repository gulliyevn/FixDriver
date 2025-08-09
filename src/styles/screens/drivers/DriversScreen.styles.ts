import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../../constants/colors';

export const createDriversScreenStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.lg,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
            headerActions: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: SIZES.md,
        },
        filterButton: {
          padding: SIZES.xs,
        },
    headerTitle: {
      fontSize: SIZES.fontSize.xxl + 4, // Увеличиваем размер на 4
      fontWeight: '700',
      color: colors.text,
      textAlign: 'left',
      marginLeft: SIZES.sm, // Сдвигаем правее
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
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
    driversList: {
      flex: 1,
      paddingVertical: SIZES.sm,
    },
    driverItem: {
      flexDirection: 'column',
      marginBottom: SIZES.sm,
      marginHorizontal: SIZES.xl,
      padding: SIZES.lg,
      borderRadius: SIZES.radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
    },
    driverHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.lg + 6,
      paddingBottom: SIZES.md + 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    driverMainInfo: {
      flex: 1,
      marginLeft: SIZES.md,
    },
    nameRatingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    vehicleExpandRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 2,
    },
    expandButton: {
      padding: 4,
      marginLeft: SIZES.xs,
    },
    tripsContainer: {
      marginVertical: SIZES.xs + 6,
    },
    tripItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SIZES.xs + 6,
    },
    tripDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#10B981',
      marginRight: SIZES.md,
    },
    tripDotBlue: {
      backgroundColor: '#3B82F6',
    },
    tripDotLocation: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#6B7280',
    },
    tripText: {
      flex: 1,
      fontSize: SIZES.fontSize.md,
      color: colors.text,
      fontWeight: '500',
    },
    tripTime: {
      fontSize: SIZES.fontSize.md,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    driverInfoBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: -SIZES.lg - 4,
      marginBottom: SIZES.xs + 6,
      paddingVertical: SIZES.xs + 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    bottomBorder: {
      marginTop: SIZES.xs + 6,
      paddingTop: SIZES.xs + 6,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SIZES.md,
      gap: SIZES.md,
    },
    leftButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.md,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SIZES.xs,
    },
    leftButtonText: {
      color: '#FFFFFF',
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
    rightButton: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.md,
      borderRadius: SIZES.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SIZES.xs,
    },
    rightButtonText: {
      color: colors.text,
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
    scheduleInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    scheduleText: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    premiumInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    stopsText: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    selectionCheckbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colors.primary,
      marginRight: SIZES.md,
      backgroundColor: 'transparent',
    },
    selectionCheckboxActive: {
      backgroundColor: colors.primary,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: SIZES.md,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary, // Фирменный синий цвет FixDrive
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#10B981', // Зеленый для доступен
      borderWidth: 2,
      borderColor: colors.background,
    },
    offlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#9CA3AF', // Серый для занят
      borderWidth: 2,
      borderColor: colors.background,
    },
    driverContent: {
      flex: 1,
    },
    driverInfo: {
      flex: 1,
    },
    driverNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    driverName: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: '600',
      color: colors.text,
      flexShrink: 1,
      marginRight: 0,
    },
    favoriteInlineIcon: {
      marginLeft: 4,
      opacity: 0.7,
    },
    vehicleInfo: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
      marginBottom: SIZES.xs,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: SIZES.xs,
    },
    ratingText: {
      fontSize: SIZES.fontSize.xl,
      color: '#10B981',
      fontWeight: '700',
    },
    premiumBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFD70020',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      marginLeft: 8,
      gap: 2,
    },
    premiumText: {
      fontSize: 10,
      color: '#FFD700',
      fontWeight: '600',
    },
    statusText: {
      fontSize: SIZES.fontSize.sm,
      color: '#10B981', // Зеленый для доступен
      fontWeight: '500',
    },
    statusTextOffline: {
      fontSize: SIZES.fontSize.sm,
      color: '#9CA3AF', // Серый для занят
      fontWeight: '500',
    },
    rightSection: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      height: 60,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SIZES.xxl * 2,
    },
    emptyStateTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '600',
      color: colors.text,
      marginTop: SIZES.lg,
      textAlign: 'center',
    },
    emptyStateSubtitle: {
      fontSize: SIZES.fontSize.md,
      color: colors.textSecondary,
      marginTop: SIZES.sm,
      textAlign: 'center',
    },
    actionButtonsContainer: {
      paddingHorizontal: SIZES.xl,
      paddingVertical: SIZES.md,
      backgroundColor: colors.background,
    },
    actionButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SIZES.md,
    },
    actionButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    selectAllButton: {
      backgroundColor: colors.background,
      borderColor: colors.primary,
    },
    selectAllButtonText: {
      color: colors.primary,
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
    bookButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    bookButtonText: {
      color: colors.background,
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
    deleteButton: {
      backgroundColor: '#EF4444', // Красный цвет
      borderColor: '#EF4444',
    },
    deleteButtonText: {
      color: colors.background,
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
    swipeActions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    swipeActionsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: SIZES.xl,
    },
    swipeActionsRight: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
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
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8, // смещаем саму кнопку чуть вверх
      borderRadius: SIZES.radius.lg,
    },
    favoriteAction: {
      backgroundColor: '#F59E0B', // Оранжевый цвет для избранного
    },
    deleteAction: {
      backgroundColor: '#EF4444', // Красный цвет для удаления
    },
  });
};
