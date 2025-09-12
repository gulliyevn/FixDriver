/**
 * Package context constants
 * Constants for package and subscription management
 */

export const PACKAGE_CONSTANTS = {
  STORAGE_KEYS: {
    PACKAGE: 'user_package',
    SUBSCRIPTION: 'user_subscription',
  },
  
  VALID_PACKAGES: ['free', 'plus', 'premium', 'premiumPlus'] as const,
  
  AUTO_RENEWAL_CHECK_INTERVAL: 6 * 60 * 60 * 1000, // 6 hours
  
  NOTIFICATION_COOLDOWN: 24 * 60 * 60 * 1000, // 24 hours
  
  PERIODS: {
    MONTH_DAYS: 30,
    YEAR_DAYS: 365,
  },
} as const;

export const PACKAGE_PRICES = {
  MONTHLY: {
    free: 0,
    plus: 99,
    premium: 199,
    premiumPlus: 299,
  },
  YEARLY: {
    free: 0,
    plus: 999,
    premium: 1999,
    premiumPlus: 2999,
  },
} as const;

export const PACKAGE_ICONS = {
  free: 'person',
  plus: 'add-circle',
  premium: 'diamond',
  premiumPlus: 'star',
} as const;

export const PACKAGE_COLORS = {
  free: '#666666',
  plus: '#0066CC',
  premium: '#FFD700',
  premiumPlus: '#FF6B35',
} as const;
