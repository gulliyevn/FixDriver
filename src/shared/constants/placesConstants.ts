/**
 * Places Service Constants
 * 
 * Constants for Places service functionality
 */

export const PLACES_CONSTANTS = {
  BASE_URL: 'https://nominatim.openstreetmap.org',
  HISTORY_KEY: 'address_history',
  MAX_HISTORY_ITEMS: 5,
  MIN_INPUT_LENGTH: 2,
  SEARCH_LIMIT: 10,
  ACCEPT_LANGUAGE: 'ru,az,en',
  MIN_ADDRESS_LENGTH: 5,
  MIN_STREET_LENGTH: 3,
  ERRORS: {
    ADDRESS_TOO_SHORT: 'Address is too short',
    MISSING_HOUSE_NUMBER: 'Address must contain house number',
    MISSING_STREET_NAME: 'Address must contain street name',
  }
} as const;
