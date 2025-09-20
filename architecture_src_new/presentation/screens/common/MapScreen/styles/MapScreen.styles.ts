import { StyleSheet } from 'react-native';
import { SIZES, SHADOWS, colors } from '../../../../../shared/constants/adaptiveConstants';

export const createMapScreenStyles = (isDark: boolean) => {
  const currentColors = colors[isDark ? 'dark' : 'light'];
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
      paddingTop: 0, // Убираем верхний отступ SafeAreaView
    },
    mapContainer: {
      flex: 1,
      position: 'relative',
    },
    
    // MapControls styles
    topLeftButton: {
      position: 'absolute',
      top: SIZES.xl + 12, // чуть ниже
      left: SIZES.lg,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: currentColors.background,
      borderWidth: 1,
      borderColor: currentColors.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
      zIndex: 10,
    },
    topRightButton: {
      position: 'absolute',
      top: SIZES.xl + 12, // чуть ниже
      right: SIZES.lg,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: currentColors.background,
      borderWidth: 1,
      borderColor: currentColors.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
      zIndex: 10,
    },
    sosText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#DC2626',
      letterSpacing: 1,
    },
    bottomButtonsContainer: {
      position: 'absolute',
      bottom: SIZES.xl + 84, // +20px
      right: SIZES.lg - 4,
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: SIZES.md,
    },
    bottomButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: currentColors.background,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: currentColors.border,
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
      zIndex: 10,
    },
    settingsPanel: {
      position: 'absolute',
      bottom: 72, // подняли панель настроек
      right: 0,
      backgroundColor: 'transparent',
      borderRadius: SIZES.radius.lg,
      borderWidth: 0,
      borderColor: 'transparent',
      padding: 0,
      shadowColor: 'transparent',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: SIZES.xs,
      width: 48, // Ограничиваем ширину панели
      height: 300, // Ограничиваем высоту панели
      pointerEvents: 'box-none', // Позволяет кликам проходить сквозь панель, но кнопки остаются кликабельными
    },
    settingsButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SIZES.xs,
      paddingHorizontal: SIZES.xs,
      borderRadius: 24, // Делаем круглую форму как у основных кнопок
      width: 48,
      height: 48,
      backgroundColor: currentColors.background,
      borderWidth: 1,
      borderColor: currentColors.border,
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
      pointerEvents: 'auto', // Кнопки остаются кликабельными
    },
    settingsButtonText: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.text,
      fontWeight: '500',
      marginLeft: SIZES.sm,
    },
    leftButton: {
      position: 'absolute',
      bottom: SIZES.xl + 84, // +20px
      left: SIZES.lg - 4,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: currentColors.background,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: currentColors.border,
      ...SHADOWS[isDark ? 'dark' : 'light'].small,
      zIndex: 10,
    },
    
    // Стили для модалки репорта
    reportModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    // alias for components expecting modalOverlay
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    reportModalContainer: {
      backgroundColor: currentColors.background,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.xl,
      marginHorizontal: SIZES.lg,
      minWidth: 320,
      maxWidth: 400,
      ...SHADOWS[isDark ? 'dark' : 'light'].large,
    },
    reportModalHeader: {
      alignItems: 'center',
      marginBottom: SIZES.lg,
    },
    // close button in header
    closeButton: {
      position: 'absolute',
      right: SIZES.md,
      top: SIZES.md,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reportIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#FEF2F2',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: SIZES.md,
    },
    reportModalTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '700',
      color: currentColors.text,
      textAlign: 'center',
    },
    reportModalSubtitle: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: SIZES.lg,
    },
    // alias names used in component
    reportModalContent: {
      marginBottom: SIZES.lg,
    },
    reportModalDescription: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: SIZES.md,
    },
    reportCommentInput: {
      borderWidth: 1,
      borderColor: currentColors.border,
      borderRadius: SIZES.radius.md,
      padding: SIZES.md,
      fontSize: SIZES.fontSize.md,
      color: currentColors.text,
      backgroundColor: currentColors.surface,
      minHeight: 100,
      marginBottom: SIZES.xl,
      textAlignVertical: 'top',
    },
    // alias
    reportTextInput: {
      borderWidth: 1,
      borderColor: currentColors.border,
      borderRadius: SIZES.radius.md,
      padding: SIZES.md,
      fontSize: SIZES.fontSize.md,
      color: currentColors.text,
      backgroundColor: currentColors.surface,
      minHeight: 100,
      marginBottom: SIZES.xl,
      textAlignVertical: 'top',
    },
    reportModalButtons: {
      flexDirection: 'row',
      gap: SIZES.md,
    },
    // alias
    reportModalActions: {
      flexDirection: 'row',
      gap: SIZES.md,
    },
    reportCancelButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      borderWidth: 1,
      borderColor: currentColors.border,
      backgroundColor: 'transparent',
      alignItems: 'center',
    },
    reportCancelButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: currentColors.text,
    },
    reportSubmitButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      backgroundColor: currentColors.error,
      alignItems: 'center',
    },
    reportSubmitButtonDisabled: {
      backgroundColor: currentColors.border,
      borderWidth: 1,
      borderColor: currentColors.border,
    },
    reportSubmitButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    reportSubmitButtonTextDisabled: {
      color: currentColors.textSecondary,
    },
    // aliases used in component
    reportButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      borderWidth: 1,
      borderColor: currentColors.border,
      backgroundColor: 'transparent',
    },
    cancelButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: currentColors.text,
    },
    submitButton: {
      backgroundColor: currentColors.error,
    },
    submitButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    
    // Стили для простого диалога
    simpleDialogOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    simpleDialogContainer: {
      backgroundColor: currentColors.background,
      borderRadius: SIZES.radius.lg,
      padding: SIZES.xl,
      margin: SIZES.xl,
      minWidth: 280,
      ...SHADOWS[isDark ? 'dark' : 'light'].large,
    },
    simpleDialogTitle: {
      fontSize: SIZES.fontSize.xl,
      fontWeight: '700',
      color: currentColors.text,
      textAlign: 'center',
      marginBottom: SIZES.md,
    },
    simpleDialogMessage: {
      fontSize: SIZES.fontSize.md,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: SIZES.xl,
    },
    simpleDialogButtons: {
      flexDirection: 'row',
      gap: SIZES.md,
    },
    // aliases for component expectations
    simpleDialogHeader: {
      alignItems: 'center',
      marginBottom: SIZES.md,
    },
    simpleDialogContent: {
      marginBottom: SIZES.md,
    },
    simpleDialogActions: {
      flexDirection: 'row',
      gap: SIZES.md,
    },
    simpleDialogNoButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      borderWidth: 1,
      borderColor: currentColors.border,
      backgroundColor: 'transparent',
      alignItems: 'center',
    },
    simpleDialogNoButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: currentColors.text,
    },
    simpleDialogYesButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      backgroundColor: currentColors.primary,
      alignItems: 'center',
    },
    simpleDialogYesButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    // generic dialog button aliases
    dialogButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noButton: {
      borderWidth: 1,
      borderColor: currentColors.border,
      backgroundColor: 'transparent',
    },
    yesButton: {
      backgroundColor: currentColors.primary,
    },
    noButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: currentColors.text,
    },
    yesButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
};