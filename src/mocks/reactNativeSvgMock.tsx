import React from "react";
import { View } from "react-native";

export const Svg = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
  <View testID="svg" {...props}>
    {children}
  </View>
);

export const Path = ({ ...props }: Record<string, unknown>) => (
  <View testID="svg-path" {...props} />
);

export const Circle = ({ ...props }: Record<string, unknown>) => (
  <View testID="svg-circle" {...props} />
);

export const Rect = ({ ...props }: Record<string, unknown>) => (
  <View testID="svg-rect" {...props} />
);
