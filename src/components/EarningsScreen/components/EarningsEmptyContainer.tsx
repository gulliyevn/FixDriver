import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getCurrentColors, SHADOWS, SIZES } from '../../../constants/colors';

interface EarningsEmptyContainerProps {
  isDark: boolean;
}

const EarningsEmptyContainer: React.FC<EarningsEmptyContainerProps> = ({ isDark }) => {
  const colors = getCurrentColors(isDark);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: SIZES.xl,
      marginHorizontal: SIZES.xl,
      marginBottom: SIZES.lg,
      borderRadius: SIZES.radius.lg,
      ...(isDark ? SHADOWS.dark.small : SHADOWS.light.small),
      minHeight: 300,
    },
  });

  return (
    <View style={styles.container}>
      {/* Пустой контейнер для будущих компонентов */}
    </View>
  );
};

export default EarningsEmptyContainer;
