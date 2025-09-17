import React from 'react';
import { View } from 'react-native';

export const Screen = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);

export const ScreenContainer = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);

export const ScreenStack = ({ children, ...props }: any) => (
  <View {...props}>{children}</View>
);

export const ScreenStackHeaderConfig = ({ ...props }: any) => (
  <View {...props} />
); 