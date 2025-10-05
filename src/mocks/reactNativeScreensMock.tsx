import React from "react";
import { View } from "react-native";

export const Screen = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
  <View {...props}>{children}</View>
);

export const ScreenContainer = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
  <View {...props}>{children}</View>
);

export const ScreenStack = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
  <View {...props}>{children}</View>
);

export const ScreenStackHeaderConfig = ({ ...props }: Record<string, unknown>) => (
  <View {...props} />
);
