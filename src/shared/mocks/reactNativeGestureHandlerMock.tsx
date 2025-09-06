import React from 'react';
import { View } from 'react-native';

export const GestureHandlerRootView = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);

export const PanGestureHandler = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);

export const TapGestureHandler = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);

export const State = {
  UNDETERMINED: 0,
  FAILED: 1,
  BEGAN: 2,
  CANCELLED: 3,
  ACTIVE: 4,
  END: 5,
}; 