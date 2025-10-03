import React from "react";
import { View } from "react-native";

export const Svg = ({ children, ...props }: any) => (
  <View testID="svg" {...props}>
    {children}
  </View>
);

export const Path = ({ ...props }: any) => (
  <View testID="svg-path" {...props} />
);

export const Circle = ({ ...props }: any) => (
  <View testID="svg-circle" {...props} />
);

export const Rect = ({ ...props }: any) => (
  <View testID="svg-rect" {...props} />
);
