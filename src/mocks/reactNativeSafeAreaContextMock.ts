import React from 'react';
import { View } from 'react-native';

export const SafeAreaProvider = ({ children, ...props }: any) => {
  return React.createElement(View, props, children);
};

export const SafeAreaView = ({ children, ...props }: any) => {
  return React.createElement(View, props, children);
};

export const useSafeAreaInsets = jest.fn(() => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}));

export const useSafeAreaFrame = jest.fn(() => ({
  x: 0,
  y: 0,
  width: 375,
  height: 812,
})); 