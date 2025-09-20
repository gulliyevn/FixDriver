import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../../../shared/constants/colors';

export const createDriverModalStyles = (isDark: boolean, role: 'client' | 'driver' = 'client') => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    // ===== MODAL STYLES =====
    modalOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    modalContainer: {
      width: '100%',
      backgroundColor: colors.background,
      borderTopLeftRadius: SIZES.radius.lg,
      borderTopRightRadius: SIZES.radius.lg,
      position: 'absolute',
      bottom: 0,
      ...(isDark ? SHADOWS.dark.large : SHADOWS.light.large),
    },
    modalContent: {
      flex: 1,
    },

    // ===== HEADER STYLES =====
    driverItem: {
      flexDirection: 'column',
      paddingHorizontal: SIZES.lg,
      paddingVertical: SIZES.sm,
      borderRadius: SIZES.radius.lg + 2,
      backgroundColor: colors.background,
      ...(role === 'driver' && {
        borderWidth: 1,
        borderColor: colors.border,
      }),
    },
    driverHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: -SIZES.sm,
      marginBottom: SIZES.lg + 6,
      paddingTop: 0,
      paddingBottom: SIZES.md + 6,
    },
    driverHeaderContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 50,
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.sm,
      minHeight: 70,
      ...(role === 'driver' && {
        borderWidth: 1,
        borderColor: colors.border,
      }),
      ...(role === 'client' && {
        width: '110%',
        borderRadius: SIZES.radius.lg,
        minHeight: 0,
        paddingHorizontal: SIZES.xxl,
        paddingVertical: 0,
        marginVertical: -SIZES.sm,
        alignSelf: 'center',
      }),
    },

    // ===== SLIDER STYLES =====
    sliderHandle: {
      width: 50,
      height: 5,
      backgroundColor: colors.border,
      borderRadius: 2.5,
      alignSelf: 'center',
      marginTop: 0,
      marginBottom: SIZES.xs,
    },
    sliderHandleContainer: {
      width: 80,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 0,
      marginBottom: SIZES.xs,
    },
    sliderBackgroundContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 4,
      zIndex: 2,
    },
    sliderContainer: {
      width: '100%',
      height: 60,
      backgroundColor: colors.border,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 4,
    },
    sliderButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    smallCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primary,
      position: 'absolute',
      right: -8,
      top: -26,
      zIndex: 2,
    },
    roundButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 0,
      marginRight: -10,
      ...(isDark ? SHADOWS.dark.medium : SHADOWS.light.medium),
    },
    fixDriveContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    fixDriveText: {
      fontSize: SIZES.fontSize.lg + 4,
      fontWeight: '700',
      color: colors.primary,
      letterSpacing: 1,
    },
    timerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerText: {
      fontSize: SIZES.fontSize.xl + 8,
      fontWeight: '700',
      color: colors.primary,
      fontFamily: 'monospace',
    },

    // ===== AVATAR STYLES =====
    avatarAndInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      zIndex: 1,
      ...(role === 'client' && {
        justifyContent: 'flex-start',
        marginLeft: -SIZES.md,
      }),
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
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
      borderColor: colors.background,
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
      color: colors.textPrimary,
      flexShrink: 1,
      ...(role === 'client' && {
        fontSize: SIZES.fontSize.lg,
      }),
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
      color: colors.textSecondary,
      fontWeight: '500',
    },
    childIcon: {
      marginRight: SIZES.xs,
    },
    vehiclePhotoContainer: {
      marginLeft: SIZES.md,
    },
    vehiclePhoto: {
      width: 60,
      height: 40,
    },

    // ===== INFO BAR STYLES =====
    driverInfoBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: SIZES.md,
      paddingVertical: SIZES.sm,
      backgroundColor: colors.surface,
      borderRadius: SIZES.radius.md,
      marginHorizontal: SIZES.lg,
      marginVertical: SIZES.sm,
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
    priceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    priceText: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    distanceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    distanceText: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    timeInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    timeText: {
      fontSize: SIZES.fontSize.sm,
      color: colors.textSecondary,
      fontWeight: '500',
    },

    // ===== CONTENT STYLES =====
    expandableContent: {
      overflow: 'hidden',
    },
    bottomBorder: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: SIZES.md,
    },

    // ===== BUTTONS STYLES =====
    buttonsContainer: {
      flexDirection: 'row',
      gap: SIZES.md,
      paddingHorizontal: SIZES.lg,
    },
    leftButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: SIZES.radius.md,
      paddingVertical: SIZES.md,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SIZES.sm,
    },
    leftButtonText: {
      color: colors.background,
      fontWeight: '600',
      fontSize: SIZES.fontSize.md,
    },
    rightButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: SIZES.radius.md,
      paddingVertical: SIZES.md,
    },
    rightButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SIZES.sm,
    },
    rightButtonText: {
      color: colors.textPrimary,
      fontWeight: '600',
      fontSize: SIZES.fontSize.md,
    },

    // ===== DIALOGS STYLES =====
    dialogOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dialogContainer: {
      backgroundColor: colors.background,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.lg + 10,
      marginHorizontal: SIZES.md,
      marginVertical: SIZES.lg,
      minWidth: 340,
      minHeight: 200,
      ...(isDark ? SHADOWS.dark.large : SHADOWS.light.large),
    },
    dialogTitle: {
      fontSize: SIZES.fontSize.lg + 2,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: SIZES.md,
      textAlign: 'center',
    },
    dialogText: {
      fontSize: SIZES.fontSize.md + 2,
      color: colors.textSecondary,
      marginBottom: SIZES.lg + 10,
      textAlign: 'center',
      lineHeight: 24,
    },
    dialogButton: {
      backgroundColor: colors.primary,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
    },
    dialogButtonText: {
      color: '#FFFFFF',
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
    },
    dialogButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SIZES.md,
      marginBottom: 0,
    },
    dialogCancelButton: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingVertical: SIZES.md + 5,
      paddingHorizontal: SIZES.lg + 10,
      borderRadius: SIZES.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    dialogCancelButtonText: {
      color: colors.textPrimary,
      fontSize: SIZES.fontSize.md + 2,
      fontWeight: '600',
    },
    dialogOkButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: SIZES.md + 5,
      paddingHorizontal: SIZES.lg + 10,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
    },
    dialogOkButtonText: {
      color: '#FFFFFF',
      fontSize: SIZES.fontSize.md + 2,
      fontWeight: '600',
    },
    emergencyStopButton: {
      flex: 1,
      backgroundColor: '#EAB308',
      paddingVertical: SIZES.md + 5,
      paddingHorizontal: SIZES.lg + 10,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      marginRight: SIZES.xs,
    },
    emergencyEndButton: {
      flex: 1,
      backgroundColor: '#DC2626',
      paddingVertical: SIZES.md + 5,
      paddingHorizontal: SIZES.lg + 10,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      marginLeft: SIZES.xs,
    },
    emergencyButtonText: {
      color: '#FFFFFF',
      fontSize: SIZES.fontSize.sm + 1,
      fontWeight: '600',
      textAlign: 'center',
    },
    onlineDialogContainer: {
      backgroundColor: colors.background,
      borderRadius: SIZES.radius.lg,
      paddingTop: SIZES.xl + 10,
      paddingHorizontal: SIZES.lg + 10,
      paddingBottom: 0,
      marginHorizontal: SIZES.md,
      marginVertical: SIZES.lg,
      minWidth: 340,
      minHeight: 160,
      ...(isDark ? SHADOWS.dark.large : SHADOWS.light.large),
    },
    onlineDialogButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SIZES.md,
      marginBottom: -SIZES.sm,
    },

    // ===== CALL SHEET STYLES =====
    callSheetOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    callSheetBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    callSheetContainer: {
      backgroundColor: colors.background,
      borderTopLeftRadius: SIZES.radius.lg,
      borderTopRightRadius: SIZES.radius.lg,
      paddingTop: SIZES.md,
      paddingHorizontal: SIZES.lg,
      paddingBottom: SIZES.xl,
    },
    callSheetClose: {
      alignItems: 'center',
      marginBottom: SIZES.lg,
    },
    callSheetHandle: {
      width: 40,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
    },
    callSheetTitle: {
      fontSize: SIZES.fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: SIZES.lg,
      textAlign: 'center',
    },
    callSheetOption: {
      paddingVertical: SIZES.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    callSheetOptionText: {
      fontSize: SIZES.fontSize.md,
      color: colors.textPrimary,
      textAlign: 'center',
    },

    // ===== RATING STYLES =====
    ratingDialogContainer: {
      backgroundColor: colors.background,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.lg + 10,
      marginHorizontal: SIZES.md,
      marginVertical: SIZES.lg,
      minWidth: 340,
      minHeight: 300,
      ...(isDark ? SHADOWS.dark.large : SHADOWS.light.large),
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: SIZES.lg,
      gap: SIZES.sm,
    },
    starButton: {
      padding: SIZES.xs,
    },
    commentContainer: {
      marginVertical: SIZES.md,
    },
    commentLabel: {
      fontSize: SIZES.fontSize.md,
      color: colors.textPrimary,
      marginBottom: SIZES.sm,
      fontWeight: '500',
    },
    commentInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: SIZES.radius.md,
      padding: SIZES.md,
      fontSize: SIZES.fontSize.md,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
      minHeight: 80,
      textAlignVertical: 'top',
    },
  });
};

export default createDriverModalStyles;
