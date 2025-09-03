/**
 * 🏷️ MOCK TYPES EXPORT
 * 
 * Centralized export of all mock data types.
 */

// 🎯 MAIN TYPE EXPORTS
export type { User } from './user';
export type { Driver } from './driver';
export type { Order } from './order';
export type { Vehicle } from './vehicle';
export type { Location, AuthResult } from './common';
export type { MockServiceInterface, MockAuthServiceInterface, MockMapServiceInterface } from './services';

/**
 * 🔄 MIGRATION TO gRPC:
 * 
 * When switching to gRPC, these types should match your protobuf definitions.
 * Update the imports to point to your gRPC generated types.
 * 
 * @example
 * // Before (mocks):
 * export * from './user';
 * 
 * // After (gRPC):
 * export * from '../../../../generated/grpc/user';
 */
