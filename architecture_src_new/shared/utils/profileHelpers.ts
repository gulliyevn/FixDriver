import { Alert } from 'react-native';
import { 
  ProfileFormData, 
  ProfileHelpersService,
  ProfileNavigation,
  ProfileChangeHandler 
} from '../types/profile';

/**
 * Profile helpers service implementation
 * Provides utility functions for profile management
 */
export class ProfileHelpers implements ProfileHelpersService {
  private readonly DEFAULT_BIRTH_DATE = '2000-11-06';
  private readonly DRIVER_CREDENTIALS = { email: 'driver@example.com', password: 'password123' };
  private readonly CLIENT_CREDENTIALS = { email: 'client@example.com', password: 'password123' };

  /**
   * Get default birth date for new profiles
   */
  getDefaultDate(): string {
    return this.DEFAULT_BIRTH_DATE;
  }

  /**
   * Calculate exact age from birth date
   */
  calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // If birthday hasn't occurred this year, subtract 1 from age
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Check if form data has changed compared to original data
   */
  hasChanges(formData: ProfileFormData, originalData: ProfileFormData): boolean {
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.phone !== originalData.phone ||
      formData.email !== originalData.email ||
      formData.birthDate !== originalData.birthDate
    );
  }

  /**
   * Handle role switching between client and driver
   */
  handleRoleSwitch(
    navigation: any,
    login: (email: string, password: string) => Promise<boolean>,
    t: (key: string) => string,
    changeRole?: (role: 'client' | 'driver') => void,
    targetRole: 'client' | 'driver' = 'driver'
  ): void {
    const isSwitchingToDriver = targetRole === 'driver';
    const hasAccount = false; // TODO: Replace with real account status check
    
    if (hasAccount) {
      // If account exists, switch to target role profile
      console.log(`Switching to ${targetRole} profile...`);
      try {
        if (changeRole) {
          changeRole(targetRole);
        }
        console.log(`Role changed to ${targetRole}`);
      } catch (error) {
        console.error('Role change error:', error);
        Alert.alert('Error', `Failed to switch to ${targetRole} profile`);
      }
    } else {
      // If no account exists, show notification
      const modalKey = isSwitchingToDriver ? 'becomeDriverModal' : 'becomeClientModal';
      const credentials = isSwitchingToDriver ? this.DRIVER_CREDENTIALS : this.CLIENT_CREDENTIALS;
      
      Alert.alert(
        t(`profile.${modalKey}.title`) || `Become ${targetRole}`,
        t(`profile.${modalKey}.message`) || `Open ${targetRole} page?`,
        [
          { 
            text: t(`profile.${modalKey}.cancel`) || 'Cancel', 
            style: 'cancel' 
          },
          { 
            text: t(`profile.${modalKey}.proceed`) || 'Proceed',
            onPress: async () => {
              // Automatically login as target role
              const success = await login(credentials.email, credentials.password);
              if (!success) {
                Alert.alert(
                  'Error', 
                  t(`profile.${modalKey}.loginError`) || `Failed to login as ${targetRole}`
                );
              }
            }
          }
        ]
      );
    }
  }

  /**
   * Handle circle press for client profile (switch to driver)
   */
  handleClientCirclePress(
    navigation: any,
    login: (email: string, password: string) => Promise<boolean>,
    t: (key: string) => string,
    changeRole?: (role: 'client' | 'driver') => void
  ): void {
    this.handleRoleSwitch(navigation, login, t, changeRole, 'driver');
  }

  /**
   * Handle circle press for driver profile (switch to client)
   */
  handleDriverCirclePress(
    navigation: any,
    login: (email: string, password: string) => Promise<boolean>,
    t: (key: string) => string,
    changeRole?: (role: 'client' | 'driver') => void
  ): void {
    this.handleRoleSwitch(navigation, login, t, changeRole, 'client');
  }
}

// Default instance for backward compatibility
export const profileHelpers = new ProfileHelpers();

// Legacy function exports for smooth migration
export const getDefaultDate = () => profileHelpers.getDefaultDate();
export const calculateAge = (birthDate: string) => profileHelpers.calculateAge(birthDate);
export const hasChanges = (formData: ProfileFormData, originalData: ProfileFormData) => 
  profileHelpers.hasChanges(formData, originalData);
export const handleCirclePress = (
  navigation: any,
  login: (email: string, password: string) => Promise<boolean>,
  t: (key: string) => string,
  changeRole?: (role: 'client' | 'driver') => void
) => profileHelpers.handleClientCirclePress(navigation, login, t, changeRole);
export const handleDriverCirclePress = (
  navigation: any,
  login: (email: string, password: string) => Promise<boolean>,
  t: (key: string) => string,
  changeRole?: (role: 'client' | 'driver') => void
) => profileHelpers.handleDriverCirclePress(navigation, login, t, changeRole);

// Export mock service for testing and gRPC preparation
export { MockServices } from '../mocks';
