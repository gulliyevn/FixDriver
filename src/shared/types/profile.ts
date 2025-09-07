/**
 * Profile domain types
 */
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
}

/**
 * Profile actions exposed to UI components.
 */
export interface ProfileChangeHandler {
  changeRole?: (role: 'client' | 'driver') => void;
}

/**
 * Navigation/context helpers used in profile flows.
 */
export interface ProfileNavigation {
  navigation: any;
  login: (email: string, password: string) => Promise<boolean>;
  t: (key: string) => string;
}

/**
 * Helper service for profile-specific operations.
 */
export interface ProfileHelpersService {
  getDefaultDate(): string;
  calculateAge(birthDate: string): number;
  hasChanges(formData: ProfileFormData, originalData: ProfileFormData): boolean;
  handleRoleSwitch(
    navigation: any,
    login: (email: string, password: string) => Promise<boolean>,
    t: (key: string) => string,
    targetRole: 'client' | 'driver',
    changeRole?: (role: 'client' | 'driver') => void
  ): void;
}
