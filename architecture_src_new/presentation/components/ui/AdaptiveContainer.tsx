import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { SIZES, getColors } from '../../../shared/constants/adaptiveConstants';
import { isTablet } from '../../../shared/utils/deviceUtils';

interface AdaptiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  maxWidth?: number | string;
  center?: boolean;
  safe?: boolean;
}

const AdaptiveContainer: React.FC<AdaptiveContainerProps> = ({
  children,
  style,
  padding = 'medium',
  maxWidth,
  center = false,
  safe = true,
}) => {
  const colors = getColors(false); // Light theme for now

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return SIZES.sm;
      case 'medium':
        return SIZES.md;
      case 'large':
        return SIZES.lg;
      default:
        return SIZES.md;
    }
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: getPadding(),
    paddingVertical: safe ? getPadding() : 0,
    ...(center && {
      alignItems: 'center',
      justifyContent: 'center',
    }),
    ...(maxWidth && {
      maxWidth: maxWidth as any,
      alignSelf: 'center',
      width: '100%',
    }),
    ...(isTablet && {
      paddingHorizontal: SIZES.lg,
    }),
  };

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
};

export default AdaptiveContainer;
