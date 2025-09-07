// User roles, permissions and features types

export type UserRole = 'client' | 'driver' | 'admin';

// Role details structure
export interface RoleDetails {
  client: {
    name: string;
    description: string;
    permissions: ClientPermission[];
    features: ClientFeature[];
  };
  driver: {
    name: string;
    description: string;
    permissions: DriverPermission[];
    features: DriverFeature[];
    requirements: DriverRequirement[];
  };
  admin: {
    name: string;
    description: string;
    permissions: AdminPermission[];
    features: AdminFeature[];
    accessLevels: AdminAccessLevel[];
  };
}

// Client permissions
export type ClientPermission = 
  | 'create_orders'
  | 'view_orders'
  | 'cancel_orders'
  | 'rate_drivers'
  | 'manage_profile'
  | 'manage_payment_methods'
  | 'view_trip_history'
  | 'contact_support';

// Driver permissions
export type DriverPermission = 
  | 'view_available_orders'
  | 'accept_orders'
  | 'start_trips'
  | 'complete_trips'
  | 'update_location'
  | 'manage_availability'
  | 'view_earnings'
  | 'contact_support';

// Admin permissions
export type AdminPermission = 
  | 'view_all_users'
  | 'manage_users'
  | 'view_all_orders'
  | 'manage_orders'
  | 'view_analytics'
  | 'manage_system_settings'
  | 'view_logs'
  | 'manage_payments';

// Client features
export type ClientFeature = 
  | 'order_creation'
  | 'real_time_tracking'
  | 'payment_management'
  | 'driver_rating'
  | 'trip_history'
  | 'support_chat';

// Driver features
export type DriverFeature = 
  | 'order_management'
  | 'navigation'
  | 'earnings_tracking'
  | 'availability_control'
  | 'trip_history'
  | 'support_chat';

// Admin features
export type AdminFeature = 
  | 'user_management'
  | 'order_management'
  | 'analytics_dashboard'
  | 'system_configuration'
  | 'payment_management'
  | 'support_management';

// Driver requirements
export interface DriverRequirement {
  type: 'license' | 'vehicle' | 'insurance' | 'background_check' | 'training';
  required: boolean;
  verified: boolean;
  verificationDate?: string;
  expiryDate?: string;
}

// Admin access levels
export type AdminAccessLevel = 'basic' | 'advanced' | 'super';

// Role i18n keys are defined in shared/constants/roles.ts (ROLE_LABEL_T_KEYS, ROLE_DESCRIPTION_T_KEYS)

// Role checks
export const isClient = (role: UserRole): boolean => role === 'client';
export const isDriver = (role: UserRole): boolean => role === 'driver';
export const isAdmin = (role: UserRole): boolean => role === 'admin';

// Get permissions for a role
export const getRolePermissions = (role: UserRole): string[] => {
  const permissions: Record<UserRole, string[]> = {
    client: [
      'create_orders',
      'view_orders',
      'cancel_orders',
      'rate_drivers',
      'manage_profile',
      'manage_payment_methods',
      'view_trip_history',
      'contact_support',
    ],
    driver: [
      'view_available_orders',
      'accept_orders',
      'start_trips',
      'complete_trips',
      'update_location',
      'manage_availability',
      'view_earnings',
      'contact_support',
    ],
    admin: [
      'view_all_users',
      'manage_users',
      'view_all_orders',
      'manage_orders',
      'view_analytics',
      'manage_system_settings',
      'view_logs',
      'manage_payments',
    ],
  };
  
  return permissions[role] || [];
};

// Get features for a role
export const getRoleFeatures = (role: UserRole): string[] => {
  const features: Record<UserRole, string[]> = {
    client: [
      'order_creation',
      'real_time_tracking',
      'payment_management',
      'driver_rating',
      'trip_history',
      'support_chat',
    ],
    driver: [
      'order_management',
      'navigation',
      'earnings_tracking',
      'availability_control',
      'trip_history',
      'support_chat',
    ],
    admin: [
      'user_management',
      'order_management',
      'analytics_dashboard',
      'system_configuration',
      'payment_management',
      'support_management',
    ],
  };
  
  return features[role] || [];
};

// Check if permission exists
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission);
};

// Check if role exists in list
export const hasRole = (userRoles: UserRole[], requiredRole: UserRole): boolean => {
  return userRoles.includes(requiredRole);
};
