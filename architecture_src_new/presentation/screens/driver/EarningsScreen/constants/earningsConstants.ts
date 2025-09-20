// Earnings Screen Constants
export const EARNINGS_CONSTANTS = {
  // Animation values
  BALANCE_ANIMATION_SCALE: 1,
  
  // Level colors
  LEVEL_COLORS: {
    DARK: '#3B82F6',
    LIGHT: '#083198',
  },
  
  // VIP requirements
  VIP_MIN_HOURS: 10,
  VIP_MIN_RIDES: 3,
  
  // Modal dimensions
  MODAL_DIMENSIONS: {
    MAX_HEIGHT: '80%',
    WIDTH: '90%',
    MIN_HEIGHT: 500,
  },
  
  // Timer format
  TIMER_FORMAT: {
    HOURS: 'HH',
    MINUTES: 'MM', 
    SECONDS: 'SS',
  },
} as const;

// Level ride ranges
export const LEVEL_RIDE_RANGES = {
  1: { start: 0, end: 120 },
  2: { start: 121, end: 360 },
  3: { start: 361, end: 810 },
  4: { start: 811, end: 1560 },
  5: { start: 1561, end: 2700 },
  6: { start: 2701, end: 4320 },
} as const;

// Sublevel ride ranges
export const SUBLEVEL_RIDE_RANGES = {
  1: {
    1: { start: 0, end: 30 },
    2: { start: 31, end: 70 },
    3: { start: 71, end: 120 },
  },
  2: {
    1: { start: 121, end: 180 },
    2: { start: 181, end: 260 },
    3: { start: 261, end: 360 },
  },
  3: {
    1: { start: 361, end: 480 },
    2: { start: 481, end: 630 },
    3: { start: 631, end: 810 },
  },
  4: {
    1: { start: 811, end: 1020 },
    2: { start: 1021, end: 1270 },
    3: { start: 1271, end: 1560 },
  },
  5: {
    1: { start: 1561, end: 1890 },
    2: { start: 1891, end: 2270 },
    3: { start: 2271, end: 2700 },
  },
  6: {
    1: { start: 2701, end: 3180 },
    2: { start: 3181, end: 3720 },
    3: { start: 3721, end: 4320 },
  },
} as const;
