import React from 'react';
import { View } from 'react-native';

export const Animated = {
  View: View,
  Text: View,
  Image: View,
  ScrollView: View,
  createAnimatedComponent: (component: any) => component,
};

export const useSharedValue = jest.fn((initialValue: any) => ({
  value: initialValue,
}));

export const useAnimatedStyle = jest.fn(() => ({}));

export const withSpring = jest.fn((value: any) => value);
export const withTiming = jest.fn((value: any) => value);
export const withRepeat = jest.fn((value: any) => value);
export const withSequence = jest.fn((value: any) => value);

export const runOnJS = jest.fn((fn: any) => fn);
export const runOnUI = jest.fn((fn: any) => fn); 