import { StyleSheet } from 'react-native';
import { getCurrentColors, SIZES, SHADOWS } from '../../../constants/colors';

export const createFixWaveScreenStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    // Хедер скопированный из ChatListScreen
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
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      flex: 1,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SIZES.md,
    },
    headerContainer: {
      width: 200,
      height: 30,
      backgroundColor: colors.surface,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    headerButton: {
      width: 100,
      height: 24,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
    },
    buttonInner: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
    },
    containerTouchable: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
    headerButtonLeft: {
      left: 4,
    },
    headerButtonRight: {
      right: 4,
    },
    headerTitle: {
      fontSize: SIZES.fontSize.xxl + 4, // Увеличиваем размер на 4
      fontWeight: '700',
      color: colors.text,
      textAlign: 'left',
      marginLeft: SIZES.sm, // Сдвигаем правее
    },
    content: {
      padding: SIZES.lg,
      gap: SIZES.lg,
    },
  });
};


