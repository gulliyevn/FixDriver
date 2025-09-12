/**
 * Driver Data Module Exports
 * Centralized exports for all driver data components
 */

// Main data
export { MOCK_DRIVER_PROFILES, getDriverProfileById, getOnlineDrivers, getDriversByStatus, getDriversByPackage } from './DriverProfiles';

export { DRIVER_LEVELS, getDriverLevelById, getDriverLevelsByPosition, getTopDriverLevels } from './DriverLevels';

// Legacy compatibility - keep the old export for backward compatibility
export { MOCK_DRIVER_PROFILES as mockDrivers } from './DriverProfiles';
export { DRIVER_LEVELS as mockTopDrivers } from './DriverLevels';

// Re-export types for convenience
export type { DriverLevel } from './DriverLevels';
