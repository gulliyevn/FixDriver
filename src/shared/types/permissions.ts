// Типы для ролей, разрешений и функций пользователей

export type UserRole = 'client' | 'driver' | 'admin';

// Детали ролей
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

// Разрешения для клиента
export type ClientPermission = 
  | 'create_orders'
  | 'view_orders'
  | 'cancel_orders'
  | 'rate_drivers'
  | 'manage_profile'
  | 'manage_payment_methods'
  | 'view_trip_history'
  | 'contact_support';

// Разрешения для водителя
export type DriverPermission = 
  | 'view_available_orders'
  | 'accept_orders'
  | 'start_trips'
  | 'complete_trips'
  | 'update_location'
  | 'manage_availability'
  | 'view_earnings'
  | 'contact_support';

// Разрешения для администратора
export type AdminPermission = 
  | 'view_all_users'
  | 'manage_users'
  | 'view_all_orders'
  | 'manage_orders'
  | 'view_analytics'
  | 'manage_system_settings'
  | 'view_logs'
  | 'manage_payments';

// Функции для клиента
export type ClientFeature = 
  | 'order_creation'
  | 'real_time_tracking'
  | 'payment_management'
  | 'driver_rating'
  | 'trip_history'
  | 'support_chat';

// Функции для водителя
export type DriverFeature = 
  | 'order_management'
  | 'navigation'
  | 'earnings_tracking'
  | 'availability_control'
  | 'trip_history'
  | 'support_chat';

// Функции для администратора
export type AdminFeature = 
  | 'user_management'
  | 'order_management'
  | 'analytics_dashboard'
  | 'system_configuration'
  | 'payment_management'
  | 'support_management';

// Требования для водителя
export interface DriverRequirement {
  type: 'license' | 'vehicle' | 'insurance' | 'background_check' | 'training';
  required: boolean;
  verified: boolean;
  verificationDate?: string;
  expiryDate?: string;
}

// Уровни доступа администратора
export type AdminAccessLevel = 'basic' | 'advanced' | 'super';

// Утилиты для работы с ролями
export const ROLE_LABELS: Record<UserRole, string> = {
  client: 'Клиент',
  driver: 'Водитель',
  admin: 'Администратор',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  client: 'Заказывает поездки и управляет своим профилем',
  driver: 'Выполняет заказы и получает оплату',
  admin: 'Управляет системой и пользователями',
};

// Проверка ролей
export const isClient = (role: UserRole): boolean => role === 'client';
export const isDriver = (role: UserRole): boolean => role === 'driver';
export const isAdmin = (role: UserRole): boolean => role === 'admin';

// Получение разрешений для роли
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

// Получение функций для роли
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

// Проверка разрешений
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission);
};

// Проверка роли
export const hasRole = (userRoles: UserRole[], requiredRole: UserRole): boolean => {
  return userRoles.includes(requiredRole);
};
