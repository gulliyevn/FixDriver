import { getAdaptiveSize, getAdaptiveSpacing, isTablet } from '../../utils/deviceUtils';

// Adaptive SIZES
export const SIZES = {
  // Font sizes
  fontSize: {
    title: getAdaptiveSize(28, 32),
    xl: getAdaptiveSize(22, 26),
    lg: getAdaptiveSize(18, 22),
    md: getAdaptiveSize(16, 18),
    sm: getAdaptiveSize(14, 16),
    xs: getAdaptiveSize(12, 14),
  },
  
  // Line heights
  lineHeight: {
    title: getAdaptiveSize(36, 40),
    lg: getAdaptiveSize(26, 30),
    md: getAdaptiveSize(22, 24),
  },
  
  // Border radius
  radius: {
    lg: getAdaptiveSize(20, 24),
    md: getAdaptiveSize(16, 20),
    sm: getAdaptiveSize(12, 16),
  },
  
  // Spacing
  xs: getAdaptiveSpacing(8, 12),
  sm: getAdaptiveSpacing(12, 16),
  md: getAdaptiveSpacing(16, 20),
  lg: getAdaptiveSpacing(20, 24),
  xl: getAdaptiveSpacing(24, 32),
  xxl: getAdaptiveSpacing(28, 36),
  xxxl: getAdaptiveSpacing(32, 40),
  
  // Button heights
  buttonHeight: {
    sm: getAdaptiveSize(36, 44),
    md: getAdaptiveSize(48, 56),
    lg: getAdaptiveSize(56, 64),
  },
  
  // Input heights
  inputHeight: {
    sm: getAdaptiveSize(40, 48),
    md: getAdaptiveSize(56, 64),
    lg: getAdaptiveSize(64, 72),
  },
  
  // Container sizes
  container: {
    maxWidth: isTablet ? 600 : '100%',
    paddingHorizontal: getAdaptiveSpacing(20, 40),
    paddingVertical: getAdaptiveSpacing(20, 30),
  },
  
  // Card sizes
  card: {
    borderRadius: getAdaptiveSize(16, 20),
    padding: getAdaptiveSpacing(20, 30),
    marginBottom: getAdaptiveSpacing(20, 30),
  },
};
