// Address type for calculations
interface Address {
  latitude: number;
  longitude: number;
}

// Calculation constants
const CALCULATION_CONSTANTS = {
  EARTH_RADIUS_METERS: 6371000,
  DISTANCE_THRESHOLDS: {
    HIGHWAY_KM: 10,
    MAIN_ROADS_KM: 5,
    WALKING_KM: 1,
  },
  SPEEDS: {
    HIGHWAY: 60,
    MAIN_ROADS: 40,
    WALKING: 15,
    DEFAULT_CITY: 25,
  },
} as const;

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(from: Address, to: Address): number {
  const R = CALCULATION_CONSTANTS.EARTH_RADIUS_METERS; // Earth's radius in meters
  const lat1Rad = (from.latitude * Math.PI) / 180;
  const lat2Rad = (to.latitude * Math.PI) / 180;
  const deltaLatRad = ((to.latitude - from.latitude) * Math.PI) / 180;
  const deltaLonRad = ((to.longitude - from.longitude) * Math.PI) / 180;

  const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; // Distance in meters
}

/**
 * Estimate average speed based on distance
 */
export function getAverageSpeed(distance: number): number {
  if (distance > CALCULATION_CONSTANTS.DISTANCE_THRESHOLDS.HIGHWAY_KM * 1000) return CALCULATION_CONSTANTS.SPEEDS.HIGHWAY; // > 10km - highway
  if (distance > CALCULATION_CONSTANTS.DISTANCE_THRESHOLDS.MAIN_ROADS_KM * 1000) return CALCULATION_CONSTANTS.SPEEDS.MAIN_ROADS;  // 5-10km - main roads
  if (distance < CALCULATION_CONSTANTS.DISTANCE_THRESHOLDS.WALKING_KM * 1000) return CALCULATION_CONSTANTS.SPEEDS.WALKING;  // < 1km - walking distance
  return CALCULATION_CONSTANTS.SPEEDS.DEFAULT_CITY; // Default city speed
}

/**
 * Calculate trip duration with buffer time
 */
export function calculateDuration(distance: number, speedKmH: number): number {
  const durationMinutes = (distance / 1000) / speedKmH * 60;
  const bufferMinutes = Math.max(5, Math.round(durationMinutes * 0.2));
  return Math.round(durationMinutes + bufferMinutes);
}

/**
 * Estimate trip duration between two addresses
 */
export function estimateTripDuration(from: Address, to: Address): number {
  const distance = calculateDistance(from, to);
  const speed = getAverageSpeed(distance);
  return calculateDuration(distance, speed);
}
