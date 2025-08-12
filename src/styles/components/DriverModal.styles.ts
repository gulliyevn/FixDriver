import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../constants/colors';

export const createDriverModalStyles = (isDark: boolean) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      width: '100%',
      backgroundColor: palette.background,
      borderTopLeftRadius: SIZES.radius.lg,
      borderTopRightRadius: SIZES.radius.lg,
      paddingBottom: SIZES.xl,
      ...(isDark ? SHADOWS.dark.large : SHADOWS.light.large),
    },


    // Driver Item Styles (скопированы из MapView)
    driverItem: {
      flexDirection: 'column',
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.lg + 4,
      borderRadius: SIZES.radius.lg + 2,
      backgroundColor: palette.surface,
      borderWidth: 1,
      borderColor: palette.border,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    driverHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.lg + 6,
      paddingBottom: SIZES.md + 6,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.primary,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#10B981',
      borderWidth: 2,
      borderColor: palette.background,
    },
    driverMainInfo: {
      flex: 1,
      marginLeft: SIZES.md,
    },
    nameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    driverName: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: palette.text,
      flexShrink: 1,
    },
    premiumIcon: {
      marginLeft: SIZES.xs,
    },
    vehicleExpandRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 2,
    },
    vehicleInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    vehicleInfo: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: '500',
    },
    childIcon: {
      marginRight: SIZES.xs,
    },
    vehiclePhotoContainer: {
      width: 120,
      height: 100,
      borderRadius: 8,
      backgroundColor: palette.surface,
      marginLeft: SIZES.sm,
    },
    vehiclePhoto: {
      width: '70%',
      height: '70%',
      alignSelf: 'center',
      marginTop: '15%',
    },
    vehiclePhotoPlaceholder: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.surface,
    },

    // Driver Info Bar
    driverInfoBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: -SIZES.lg - 4,
      marginBottom: SIZES.xs + 6,
      paddingHorizontal: SIZES.sm,
      paddingVertical: SIZES.xs + 6,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    scheduleInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    scheduleText: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: '500',
    },
    priceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    priceText: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: '500',
    },
    distanceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    distanceText: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: '500',
    },
    timeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    timeText: {
      fontSize: SIZES.fontSize.sm,
      color: palette.textSecondary,
      fontWeight: '500',
    },

    // Expandable Content
    expandableContent: {
      overflow: 'hidden',
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
      color: palette.text,
      fontWeight: '500',
    },
    tripTime: {
      fontSize: SIZES.fontSize.md,
      color: palette.textSecondary,
      fontWeight: '500',
    },
    bottomBorder: {
      marginTop: SIZES.xs + 6,
      paddingTop: SIZES.xs + 6,
      borderTopWidth: 1,
      borderTopColor: palette.border,
    },

    // Buttons
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: SIZES.md,
      gap: SIZES.md,
    },
    leftButton: {
      flex: 1,
      backgroundColor: palette.primary,
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
      borderColor: palette.border,
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
      color: palette.text,
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
  });
};
