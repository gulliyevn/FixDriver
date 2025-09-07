/**
 * 🎯 CENTRALIZED MOCK DATA EXPORT
 * 
 * This file exports all mock data and services in a clean, organized way.
 * When switching to gRPC, just replace the imports here!
 * 
 * @example
 * // Instead of scattered imports:
 * import { mockDrivers } from '../../../mocks/data/users';
 * 
 * // Use centralized import:
 * import { mockDrivers } from '../../shared/mocks';
 */

// 📊 DATA EXPORTS
export { default as mockUsers } from './data/users';
export { default as mockDrivers } from './data/drivers';
export { default as mockOrders } from './data/orders';
export * from './data/vehicles';
export * from './data/locations';

// 🚗 DRIVER MOCK EXPORTS
export * from './driverMock';
export * from './driverStatsMock';
export * from './mapMock';
export * from './notificationMock';
export * from './orderMock';

// 🔌 SERVICE EXPORTS (Use centralized MockServices instead)

// Note: Types are exported from shared/types. Avoid re-exporting types here to prevent conflicts.

// 🛠️ UTILITY EXPORTS
// userHelpers is deprecated and was moved to УДАЛИТЬ; do not re-export

// 🚀 QUICK ACCESS HELPERS
export { default as MockData } from './MockData';
export { default as MockServices } from './MockServices';

/**
 * 🔄 MIGRATION TO gRPC:
 * 
 * 1. Replace this file with gRPC service exports
 * 2. Update service implementations
 * 3. Keep the same export names for compatibility
 * 
 * @example
 * // Before (mocks):
 * export { AuthService } from './services/AuthService';
 * 
 * // After (gRPC):
 * export { AuthService } from '../../data/datasources/grpc/AuthService';
 */
