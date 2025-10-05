import React from "react";
import { View } from "react-native";

export const StatusBar = ({ ...props }: Record<string, unknown>) => (
  <View testID="status-bar" {...props} />
);

export default StatusBar;
