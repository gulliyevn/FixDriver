/**
 * Tab bar icons constants
 * Centralized icon names for navigation tabs
 */

export const TAB_ICONS = {
  // Map tab icons
  MAP: 'map-outline',
  MAP_ACTIVE: 'map',
  
  // Drivers tab icons
  DRIVERS: 'people-outline',
  DRIVERS_ACTIVE: 'people',
  
  // Schedule tab icons
  SCHEDULE: 'add',
  SCHEDULE_ACTIVE: 'add',
  
  // Chat tab icons
  CHAT: 'chatbubbles-outline',
  CHAT_ACTIVE: 'chatbubbles',
  
  // Profile tab icons
  PROFILE: 'person-outline',
  PROFILE_ACTIVE: 'person',
  
  // Orders tab icons
  ORDERS: 'list-outline',
  ORDERS_ACTIVE: 'list',
  
  // Earnings tab icons
  EARNINGS: 'wallet-outline',
  EARNINGS_ACTIVE: 'wallet',
} as const;

export type TabIcon = typeof TAB_ICONS[keyof typeof TAB_ICONS];
