export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
}

export interface ProfileChangeHandler {
  changeRole?: (role: 'client' | 'driver') => void;
}

export interface ProfileNavigation {
  navigation: any;
  login: (email: string, password: string) => Promise<boolean>;
  t: (key: string) => string;
}

export interface ProfileHelpersService {
  getDefaultDate(): string;
  calculateAge(birthDate: string): number;
  hasChanges(formData: ProfileFormData, originalData: ProfileFormData): boolean;
  handleRoleSwitch(
    navigation: any,
    login: (email: string, password: string) => Promise<boolean>,
    t: (key: string) => string,
    changeRole?: (role: 'client' | 'driver') => void,
    targetRole: 'client' | 'driver'
  ): void;
}
