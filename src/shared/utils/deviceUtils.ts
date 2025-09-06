import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device type detection
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

// Screen size detection
export const isTablet = screenWidth > 768;
export const isPhone = screenWidth <= 768;
export const isSmallDevice = screenHeight < 700;
export const isLargeDevice = screenHeight > 800;

// Device specific info
export const deviceInfo = {
  platform: Platform.OS,
  isIOS,
  isAndroid,
  isWeb,
  isTablet,
  isPhone,
  isSmallDevice,
  isLargeDevice,
  screenWidth,
  screenHeight,
  statusBarHeight: StatusBar.currentHeight || 0,
};

// Adaptive sizing based on device
export const getAdaptiveSize = (phoneSize: number, tabletSize?: number): number => {
  if (isTablet && tabletSize) {
    return tabletSize;
  }
  return phoneSize;
};

// Adaptive spacing
export const getAdaptiveSpacing = (phoneSpacing: number, tabletSpacing?: number): number => {
  if (isTablet && tabletSpacing) {
    return tabletSpacing;
  }
  return phoneSpacing;
};

// Platform specific values
export const platformSpecific = {
  // iOS specific
  ios: {
    statusBarStyle: 'dark-content' as const,
    keyboardAvoidingBehavior: 'padding' as const,
    safeAreaInsets: { top: 44, bottom: 34, left: 0, right: 0 },
  },
  // Android specific
  android: {
    statusBarStyle: 'dark-content' as const,
    keyboardAvoidingBehavior: 'height' as const,
    safeAreaInsets: { top: 24, bottom: 0, left: 0, right: 0 },
  },
  // Web specific
  web: {
    statusBarStyle: 'dark-content' as const,
    keyboardAvoidingBehavior: 'padding' as const,
    safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
  },
};

// Get platform specific values
export const getPlatformSpecific = (key: keyof typeof platformSpecific.ios) => {
  if (isIOS) return platformSpecific.ios[key];
  if (isAndroid) return platformSpecific.android[key];
  return platformSpecific.web[key];
};
