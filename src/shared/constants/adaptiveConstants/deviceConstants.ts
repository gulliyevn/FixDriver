import { isSmallDevice, isLargeDevice } from '../../utils/deviceUtils';

// Responsive breakpoints
export const BREAKPOINTS = {
  phone: 768,
  tablet: 1024,
  desktop: 1200,
};

// Device specific adjustments
export const DEVICE_ADJUSTMENTS = {
  // Small devices (iPhone SE, etc.)
  small: {
    fontSize: {
      title: 24,
      xl: 20,
      lg: 16,
      md: 14,
      sm: 12,
      xs: 10,
    },
    spacing: {
      xs: 6,
      sm: 10,
      md: 14,
      lg: 18,
      xl: 22,
      xxl: 26,
      xxxl: 30,
    },
  },
  // Large devices (iPhone Pro Max, etc.)
  large: {
    fontSize: {
      title: 32,
      xl: 26,
      lg: 22,
      md: 18,
      sm: 16,
      xs: 14,
    },
    spacing: {
      xs: 10,
      sm: 14,
      md: 18,
      lg: 24,
      xl: 30,
      xxl: 36,
      xxxl: 42,
    },
  },
};

// Get device specific adjustments
export const getDeviceAdjustments = () => {
  if (isSmallDevice) return DEVICE_ADJUSTMENTS.small;
  if (isLargeDevice) return DEVICE_ADJUSTMENTS.large;
  return null;
};
