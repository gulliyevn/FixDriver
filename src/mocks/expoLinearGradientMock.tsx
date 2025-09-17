import React from 'react';
import { View } from 'react-native';

export const LinearGradient = ({ children, ...props }: any) => (
  <View testID="linear-gradient" {...props}>
    {children}
  </View>
); 