import { StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../../../constants/colors';

export const createModalStyles = (isDark: boolean) => {
  const palette = getCurrentColors(isDark);

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    modalContainer: {
      width: '100%',
      backgroundColor: palette.background,
      borderTopLeftRadius: SIZES.radius.lg,
      borderTopRightRadius: SIZES.radius.lg,
      paddingBottom: 0,
      position: 'absolute',
      bottom: 0,
      ...(isDark ? SHADOWS.dark.large : SHADOWS.light.large),
    },
  });
};
