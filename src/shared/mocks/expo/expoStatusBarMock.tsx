import React from 'react';
import { View } from 'react-native';

export const StatusBar = ({ ...props }: any) => (
  <View testID="status-bar" {...props} />
);

export default StatusBar; 