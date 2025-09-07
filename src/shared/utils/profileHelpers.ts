import { Alert } from 'react-native';

// Returns default date (fixed for deterministic UI/tests)
export const getDefaultDate = (): string => {
  return '2000-11-06';
};

// Calculate precise age from ISO date string
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Decrease age if birthday hasn't occurred yet in current year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Compare profile form data to detect changes
export const hasChanges = (
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
  },
  originalData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
  }
): boolean => {
  return (
    formData.firstName !== originalData.firstName ||
    formData.lastName !== originalData.lastName ||
    formData.phone !== originalData.phone ||
    formData.email !== originalData.email ||
    formData.birthDate !== originalData.birthDate
  );
};

// Handle circle press (switch from client to driver)
export const handleCirclePress = (
  navigation: any,
  login: (email: string, password: string) => Promise<boolean>,
  t: (key: string) => string,
  changeRole?: (role: 'client' | 'driver') => void
): void => {
  // TODO: Replace with real driver account status check from state/backend
  const hasDriverAccount = false;
  
  if (hasDriverAccount) {
    // Switch to driver profile by changing role
    try {
      if (changeRole) {
        changeRole('driver');
      }
    } catch (error) {
      Alert.alert(t('errors.error'), t('profile.errors.roleChangeFailed'));
    }
  } else {
    // Propose to navigate to driver registration
    Alert.alert(
      t('profile.becomeDriverModal.title'),
      t('profile.becomeDriverModal.message'),
      [
        { text: t('profile.becomeDriverModal.cancel'), style: 'cancel' },
        { 
          text: t('profile.becomeDriverModal.proceed'),
          onPress: async () => {
            navigation?.navigate?.('DriverRegister');
          }
        }
      ]
    );
  }
};

// Handle circle press in driver profile (switch to client)
export const handleDriverCirclePress = (
  navigation: any,
  login: (email: string, password: string) => Promise<boolean>,
  t: (key: string) => string,
  changeRole?: (role: 'client' | 'driver') => void
): void => {
  // TODO: Replace with real client account status check from state/backend
  const hasClientAccount = false;
  
  if (hasClientAccount) {
    // Switch to client profile by changing role
    try {
      if (changeRole) {
        changeRole('client');
      }
    } catch (error) {
      Alert.alert(t('errors.error'), t('profile.errors.roleChangeFailed'));
    }
  } else {
    // Propose to navigate to client registration
    Alert.alert(
      t('profile.becomeClientModal.title'),
      t('profile.becomeClientModal.message'),
      [
        { text: t('profile.becomeClientModal.cancel'), style: 'cancel' },
        { 
          text: t('profile.becomeClientModal.proceed'),
          onPress: async () => {
            navigation?.navigate?.('ClientRegister');
          }
        }
      ]
    );
  }
}; 