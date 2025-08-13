import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES } from '../../constants/colors';

export const createOrdersMapScreenStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 0, // Убираем верхний отступ SafeAreaView
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
    headerTitle: {
      fontSize: SIZES.fontSize.xxl + 4, // Увеличиваем размер на 4
      fontWeight: '700',
      color: colors.text,
      textAlign: 'left',
      marginLeft: SIZES.sm, // Сдвигаем правее
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.md,
    },
    headerButton: {
      padding: SIZES.sm,
      borderRadius: SIZES.radius.md,
      backgroundColor: 'transparent',
    },
    mapContainer: {
      flex: 1,
    },
    settingsPanel: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: 'transparent', // Делаем прозрачным
      borderRadius: SIZES.radius.lg,
      borderWidth: 0, // Убираем границу
      borderColor: 'transparent',
      padding: 0, // Убираем padding
      shadowColor: 'transparent', // Убираем тень
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.xs,
    },
    settingsButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SIZES.xs,
      paddingHorizontal: SIZES.xs,
      borderRadius: 18, // Делаем круглую форму
      width: 36,
      height: 36,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    settingsButtonText: {
      fontSize: SIZES.fontSize.md,
      color: colors.text,
      fontWeight: '500',
      marginLeft: SIZES.sm,
    },
    
    // Стили для модалки репорта
    reportModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    reportModalContainer: {
      backgroundColor: colors.background,
      borderRadius: SIZES.radius.xl,
      padding: SIZES.xl,
      marginHorizontal: SIZES.lg,
      minWidth: 320,
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    reportModalHeader: {
      alignItems: 'center',
      marginBottom: SIZES.lg,
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
      color: colors.text,
      textAlign: 'center',
    },
    reportModalSubtitle: {
      fontSize: SIZES.fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: SIZES.lg,
    },
    reportCommentInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: SIZES.radius.md,
      padding: SIZES.md,
      fontSize: SIZES.fontSize.md,
      color: colors.text,
      backgroundColor: colors.surface,
      minHeight: 100,
      marginBottom: SIZES.xl,
      textAlignVertical: 'top',
    },
    reportModalButtons: {
      flexDirection: 'row',
      gap: SIZES.md,
    },
    reportCancelButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: 'transparent',
      alignItems: 'center',
    },
    reportCancelButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: colors.text,
    },
    reportSubmitButton: {
      flex: 1,
      paddingVertical: SIZES.md,
      paddingHorizontal: SIZES.lg,
      borderRadius: SIZES.radius.md,
      backgroundColor: '#DC2626',
      alignItems: 'center',
    },
    reportSubmitButtonText: {
      fontSize: SIZES.fontSize.md,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
};


