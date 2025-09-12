/**
 * Address-related constants
 */

export const ADDRESS_CONSTANTS = {
  ENDPOINTS: {
    ADDRESSES: '/api/addresses',
  },
  EXTERNAL_APIS: {
    NOMINATIM_BASE_URL: 'https://nominatim.openstreetmap.org',
    GOOGLE_BASE_URL: 'https://maps.googleapis.com/maps/api/geocode/json',
    YANDEX_BASE_URL: 'https://geocode-maps.yandex.ru/1.x',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
    YANDEX_API_KEY: process.env.YANDEX_API_KEY || '',
  },
  VALIDATION: {
    MIN_LENGTH: 5,
    REQUIRED_KEYWORDS: ['street', 'house', 'building', 'avenue', 'road', 'lane'],
  },
  ERROR_MESSAGES: {
    LOAD_FAILED: 'Failed to load addresses',
    ADD_FAILED: 'Failed to add address',
    UPDATE_FAILED: 'Failed to update address',
    DELETE_FAILED: 'Failed to delete address',
    SET_DEFAULT_FAILED: 'Failed to set default address',
  },
} as const;
