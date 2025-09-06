/**
 * Universal Link Handler Constants
 * 
 * Constants for universal link handler functionality
 */

export const UNIVERSAL_LINK_CONSTANTS = {
  ROUTE_PATH: '/route',
  DEFAULT_TRAVEL_MODE: 'driving',
  VALID_HOSTNAMES: ['fixdrive', 'example.com'],
  PARAMS: {
    ORIGIN: 'o',
    DESTINATION: 'd',
    WAYPOINTS: 'w',
    TRAVEL_MODE: 't',
  },
  POINT_IDS: {
    START: 'start',
    END: 'end',
    WAYPOINT_PREFIX: 'wp',
  }
} as const;
