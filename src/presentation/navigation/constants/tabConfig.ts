/**
 * Tab bar configuration
 * Centralized configuration for navigation tabs
 */

import { TAB_ICONS } from './tabIcons';

export interface TabConfigItem {
  name: string;
  icon: string;
  activeIcon: string;
  translationKey: string;
  isSpecial?: boolean;
}

export const CLIENT_TABS: TabConfigItem[] = [
  {
    name: 'Map',
    icon: TAB_ICONS.MAP,
    activeIcon: TAB_ICONS.MAP_ACTIVE,
    translationKey: 'navigation.tabs.map',
  },
  {
    name: 'Drivers',
    icon: TAB_ICONS.DRIVERS,
    activeIcon: TAB_ICONS.DRIVERS_ACTIVE,
    translationKey: 'navigation.tabs.drivers',
  },
  {
    name: 'Schedule',
    icon: TAB_ICONS.SCHEDULE,
    activeIcon: TAB_ICONS.SCHEDULE_ACTIVE,
    translationKey: 'navigation.tabs.schedule',
    isSpecial: true,
  },
  {
    name: 'Chat',
    icon: TAB_ICONS.CHAT,
    activeIcon: TAB_ICONS.CHAT_ACTIVE,
    translationKey: 'navigation.tabs.chats',
  },
  {
    name: 'ClientProfile',
    icon: TAB_ICONS.PROFILE,
    activeIcon: TAB_ICONS.PROFILE_ACTIVE,
    translationKey: 'navigation.tabs.profile',
  },
];

export const DRIVER_TABS: TabConfigItem[] = [
  {
    name: 'Orders',
    icon: TAB_ICONS.ORDERS,
    activeIcon: TAB_ICONS.ORDERS_ACTIVE,
    translationKey: 'navigation.tabs.orders',
  },
  {
    name: 'Earnings',
    icon: TAB_ICONS.EARNINGS,
    activeIcon: TAB_ICONS.EARNINGS_ACTIVE,
    translationKey: 'navigation.tabs.earnings',
    isSpecial: true,
  },
  {
    name: 'Profile',
    icon: TAB_ICONS.PROFILE,
    activeIcon: TAB_ICONS.PROFILE_ACTIVE,
    translationKey: 'navigation.tabs.profile',
  },
];

export const TAB_CONFIG = {
  CLIENT_TABS,
  DRIVER_TABS,
} as const;
