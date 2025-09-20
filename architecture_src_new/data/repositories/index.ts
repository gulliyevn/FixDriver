/**
 * 📦 DATA REPOSITORIES INDEX
 * 
 * Exports all repository implementations and interfaces.
 * Repositories act as data access layer between domain and data sources.
 */

// Repository implementations
export { AuthRepository } from './AuthRepository';
export { UserRepository } from './UserRepository';
export { OrderRepository } from './OrderRepository';
export { PaymentRepository } from './PaymentRepository';

// Repository interfaces (from domain layer)
export type { IAuthRepository } from '../../domain/repositories/IAuthRepository';
export type { IUserRepository } from '../../domain/repositories/IUserRepository';
export type { IOrderRepository } from '../../domain/repositories/IOrderRepository';
export type { IPaymentRepository } from '../../domain/repositories/IPaymentRepository';
