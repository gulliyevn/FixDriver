import React from 'react';
import { View, Text } from 'react-native';

export const DropDownPicker = ({ ...props }: any) => (
  <View testID="dropdown-picker" {...props}>
    <Text>Dropdown Picker</Text>
  </View>
); 