/**
 * 🏷️ MOCK TYPES
 * 
 * Centralized type exports for all mock data and services.
 * Clean, organized, and ready for gRPC migration.
 */

// Core domain types
export * from '../types/user';
export * from '../types/driver';
export * from '../types/order';
export * from '../types/emergency';
export * from '../types/auth';
export * from '../types/balance';
export * from '../types/billing';
export * from '../types/chat';
export * from '../types/countries';
export * from '../types/family';
export * from '../types/navigation';
export * from '../types/notificationTypes';
export * from '../types/package';
export * from '../types/packages';
export * from '../types/payment';
// export * from '../types/permissions'; // Conflicts with UserRole enum
export * from '../types/profile';
export * from '../types/schedule';

// Driver-specific types
export * from '../types/driver/DriverVehicle';

// Mock-specific types will be defined here if needed