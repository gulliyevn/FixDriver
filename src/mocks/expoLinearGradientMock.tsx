import React from "react";
import { View } from "react-native";

export const LinearGradient = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
  <View testID="linear-gradient" {...props}>
    {children}
  </View>
);
