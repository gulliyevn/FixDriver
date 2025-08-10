import { StyleSheet } from 'react-native';
import { getCurrentColors } from '../../constants/colors';

export const createOrdersMapScreenStyles = (isDark: boolean) => {
  const colors = getCurrentColors(isDark);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    mapContainer: {
      flex: 1,
    },
  });
};


