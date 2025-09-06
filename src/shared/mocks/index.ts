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
export * from './data/users';
export * from './data/drivers';
export * from './data/orders';
export * from './data/vehicles';
export * from './data/locations';

// 🚗 DRIVER MOCK EXPORTS
export * from './driverMock';
export * from './driverStatsMock';
export * from './mapMock';
export * from './notificationMock';
export * from './orderMock';

// 🔌 SERVICE EXPORTS
export * from './services/AuthService';
export * from './services/UserService';
export * from './services/DriverService';
export * from './services/OrderService';
export * from './services/MapService';

// 🏷️ TYPE EXPORTS
export * from './types/common';
export * from './types/user';
export * from './types/order';
export * from './types/driver';

// 📅 SCHEDULE EXPORTS
export type { FlexibleScheduleData, CustomizedScheduleData, AllScheduleData } from './types/common';

// 👤 PROFILE EXPORTS
export type { ProfileFormData, ProfileChangeHandler, ProfileNavigation } from './types/common';

// 📦 PACKAGE EXPORTS
export type { PackageType, PackageVisuals } from './types/common';

// 🔤 FORMATTING EXPORTS
export type { AppLanguage, DateFormat } from './types/common';

// 🚨 ERROR EXPORTS
export type { AuthErrorCode, NetworkErrorCode, ValidationErrorCode } from './types/common';

// 🌍 COUNTRY EXPORTS
export type { Country, CountryService, Region } from './types/common';

// 🚨 EMERGENCY EXPORTS
export type { EmergencyService, EmergencyContact, EmergencyServiceProvider, EmergencyServiceType } from './types/common';

// 🚗 DRIVER EXPORTS
export type { 
  ExperienceOption, 
  CarBrand, 
  CarModel, 
  TariffOption, 
  YearOption, 
  DriverDataService,
  CarCategory,
  TariffType,
  PriceRange
} from './types/common';

// 👤 USER EXPORTS
export type { 
  User, 
  UserRole, 
  ClientProfile, 
  DriverProfile, 
  AdminProfile,
  Child,
  PaymentMethod,
  VehicleInfo,
  DocumentInfo,
  UserWithClientProfile,
  UserWithDriverProfile,
  UserWithAdminProfile
} from './types/common';

export type {
  UserService,
  UserManagementService,
  UserValidationService,
  CreateUserData,
  CreateChildData,
  CreatePaymentMethodData,
  CreateVehicleData,
  CreateDocumentData,
  UserFilters,
  UserStats,
  SystemStats,
  ValidationResult,
  ValidationError,
  ValidationWarning
} from './types/common';

// 🛠️ UTILITY EXPORTS
export * from '../utils/userHelpers';

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
