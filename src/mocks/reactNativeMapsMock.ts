import React from 'react';
import { View, Text } from 'react-native';

export const MapView = ({ children, ...props }: any) => {
  return React.createElement(View, { testID: "map-view", ...props }, children);
};

export const Marker = ({ coordinate, title, ...props }: any) => {
  return React.createElement(View, { testID: "map-marker", ...props }, 
    React.createElement(Text, null, title)
  );
};

export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = 'default'; 