/**
 * Vehicle-related constants
 */

export const VEHICLE_CONSTANTS = {
  STORAGE_KEYS: {
    DRIVER_VEHICLES: 'driver_vehicles',
  },
  DEFAULTS: {
    DRIVER_ID: 'driver-1',
    IS_ACTIVE: true,
    IS_VERIFIED: false,
  },
  TIMEOUTS: {
    LOAD_VEHICLE: 500,
    UPDATE_VEHICLE: 1000,
    TOGGLE_VEHICLE: 500,
    UPLOAD_PHOTO: 1000,
  },
} as const;
