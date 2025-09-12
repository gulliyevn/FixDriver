import { useI18n } from '../../../../../../shared/hooks/useI18n';

/**
 * Profile Validation Hook
 * 
 * Handles validation logic for profile form fields
 */

interface UseProfileValidationParams {
  formData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    birthDate: string;
  };
}

export const useProfileValidation = ({ formData }: UseProfileValidationParams) => {
  const { t } = useI18n();

  const validatePersonalInfo = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) {
      errors.push(t('profile.validation.firstNameRequired'));
    }
    
    if (!formData.lastName.trim()) {
      errors.push(t('profile.validation.lastNameRequired'));
    }
    
    if (!formData.email.trim()) {
      errors.push(t('profile.validation.emailRequired'));
    } else if (!isValidEmail(formData.email)) {
      errors.push(t('profile.validation.emailInvalid'));
    }
    
    if (formData.phone.trim() && !isValidPhone(formData.phone)) {
      errors.push(t('profile.validation.phoneInvalid'));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateFamilyMember = (member: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!member.name?.trim()) {
      errors.push(t('profile.family.validation.nameRequired'));
    }
    
    if (!member.surname?.trim()) {
      errors.push(t('profile.family.validation.surnameRequired'));
    }
    
    if (!member.phone?.trim()) {
      errors.push(t('profile.family.validation.phoneRequired'));
    } else if (!isValidPhone(member.phone)) {
      errors.push(t('profile.family.validation.phoneInvalid'));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateVehicle = (vehicle: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!vehicle.vehicleNumber?.trim()) {
      errors.push(t('profile.vehicles.validation.numberRequired'));
    }
    
    if (!vehicle.carBrand?.trim()) {
      errors.push(t('profile.vehicles.validation.brandRequired'));
    }
    
    if (!vehicle.carModel?.trim()) {
      errors.push(t('profile.vehicles.validation.modelRequired'));
    }
    
    if (!vehicle.carYear || vehicle.carYear < 1900 || vehicle.carYear > new Date().getFullYear()) {
      errors.push(t('profile.vehicles.validation.yearInvalid'));
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validationErrors = {
    personalInfo: validatePersonalInfo(),
    familyMember: (member: any) => validateFamilyMember(member),
    vehicle: (vehicle: any) => validateVehicle(vehicle),
  };

  return {
    validatePersonalInfo,
    validateFamilyMember,
    validateVehicle,
    isValidEmail,
    isValidPhone,
    validationErrors,
  };
};
