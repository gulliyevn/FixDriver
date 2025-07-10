import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// Mock Expo modules
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
  Linking: {
    openURL: jest.fn(),
  },
  Notifications: {
    getPermissionsAsync: jest.fn(),
    requestPermissionsAsync: jest.fn(),
    getExpoPushTokenAsync: jest.fn(),
    addNotificationReceivedListener: jest.fn(),
    addNotificationResponseReceivedListener: jest.fn(),
  },
}));

// Mock expo-crypto
jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn(() => Promise.resolve('mock-hash')),
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo Vector Icons as React components
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const createIcon = (name) => (props) => React.createElement('Icon', { ...props, name });
  return {
    Ionicons: createIcon('Ionicons'),
    MaterialIcons: createIcon('MaterialIcons'),
    AntDesign: createIcon('AntDesign'),
    Feather: createIcon('Feather'),
    FontAwesome: createIcon('FontAwesome'),
    FontAwesome5: createIcon('FontAwesome5'),
    MaterialCommunityIcons: createIcon('MaterialCommunityIcons'),
  };
});

// Global test setup
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 