/**
 * Tab bar colors constants
 * Centralized colors for navigation tab bar
 */

export const TAB_BAR_COLORS = {
  // Light theme
  LIGHT: {
    BACKGROUND: '#fff',
    BORDER: '#e0e0e0',
  },
  // Dark theme
  DARK: {
    BACKGROUND: '#181A20',
    BORDER: '#333',
  },
} as const;

export type TabBarTheme = keyof typeof TAB_BAR_COLORS;
