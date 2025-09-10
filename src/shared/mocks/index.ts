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

// 🔌 SERVICE EXPORTS
export { default as MockServices } from './MockServices';
export { default as MockData } from './MockData';

// 📦 SHARED MOCK EXPORTS
export * from './shared/auth';
export * from './shared/balanceMock';
export * from './shared/cardsMock';
export * from './shared/carsMock';
export * from './shared/earningsDetailsMock';
export * from './shared/familyMembers';
export * from './shared/other';
export * from './shared/residenceMock';
export * from './shared/tripsMock';

// 🏭 FACTORY EXPORTS
export * from './factories';

// 🚗 DRIVER MOCK EXPORTS
export * from './driver/driverModalMock';
export * from './driver/driverStatsMock';
export * from './driver/driverVehiclesMock';

// 📦 ORDER MOCK EXPORTS
export * from './order/orderMock';
export * from './order/orders';
export * from './order/ordersMock';

// 📦 PACKAGE MOCK EXPORTS
export * from './package/premiumPackagesMock';

// 💰 PAYMENT MOCK EXPORTS
export * from './payment/paymentHistoryMock';

// 📋 RULES MOCK EXPORTS
export * from './rules/rulesMock';

// 🛠️ UTILITY EXPORTS
export * from './utils/asyncStorageMock';
export * from './utils/mapMock';
export * from './utils/notificationsMock';
export * from './utils/scheduleMock';

// 📚 HELP MOCK EXPORTS
export * from './help/bookingHelpMock';
export * from './help/paymentHelpMock';
export * from './help/safetyHelpMock';

// 📱 EXPO MOCK EXPORTS
export * from './expo/expoConstantsMock';
export * from './expo/expoCryptoMock';
export * from './expo/expoDeviceMock';
export * from './expo/expoHapticsMock';
export * from './expo/expoImagePickerMock';
export * from './expo/expoLinearGradientMock';
export * from './expo/expoLocalizationMock';
export * from './expo/expoLocationMock';
export * from './expo/expoNotificationsMock';
export * from './expo/expoRouterMock';
export * from './expo/expoStatusBarMock';

// 📱 REACT NATIVE MOCK EXPORTS
export * from './reactNative/reactNativeCalendarsMock';
export * from './reactNative/reactNativeDropdownPickerMock';
export * from './reactNative/reactNativeGestureHandlerMock';
export * from './reactNative/reactNativeMapsMock';
export * from './reactNative/reactNativePermissionsMock';
export * from './reactNative/reactNativeReanimatedMock';
export * from './reactNative/reactNativeSafeAreaContextMock';
export * from './reactNative/reactNativeScreensMock';
export * from './reactNative/reactNativeSvgMock';
export * from './reactNative/reactNativeWebMock';

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