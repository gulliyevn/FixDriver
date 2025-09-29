import { StyleSheet, ViewStyle } from 'react-native';

export const BalanceCardDecorationStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -26,
    left: -24,
    right: -24,
    bottom: -24,
    zIndex: 0,
    pointerEvents: 'none',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
});

export const getDecorationContainerStyle = (): ViewStyle => ({
  position: 'absolute',
  top: -26,
  left: -24,
  right: -24,
  bottom: -24,
  zIndex: 0,
  pointerEvents: 'none',
}); 