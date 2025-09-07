import { UserRole } from '../types/permissions';

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

/**
 * i18n keys for role labels
 */
export const ROLE_LABEL_T_KEYS: Record<UserRole, string> = {
  client: 'roles.client.label',
  driver: 'roles.driver.label',
  admin: 'roles.admin.label',
};

/**
 * i18n keys for role descriptions
 */
export const ROLE_DESCRIPTION_T_KEYS: Record<UserRole, string> = {
  client: 'roles.client.description',
  driver: 'roles.driver.description',
  admin: 'roles.admin.description',
};
