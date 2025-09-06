import { UserRole } from '../types';

/**
 * Valid user roles
 */
export const VALID_ROLES: UserRole[] = ['client', 'driver', 'admin'];

/**
 * Check if role is valid
 */
export function isValidRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole);
}
