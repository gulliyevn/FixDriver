import { RegisterFormData } from './types';
import { UserRole } from '../../../../shared/types/permissions';

export const validateRegisterForm = (
  formData: RegisterFormData, 
  role: UserRole, 
  t: (k: string) => string
): Partial<RegisterFormData> => {
  const errors: Partial<RegisterFormData> = {};

  // Common validations
  if (!formData.firstName.trim()) {
    errors.firstName = t('auth.register.firstNameRequired');
  }
  if (!formData.lastName.trim()) {
    errors.lastName = t('auth.register.lastNameRequired');
  }
  if (!formData.email.trim()) {
    errors.email = t('auth.register.emailRequired');
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = t('auth.register.emailInvalid');
  }
  if (!formData.phone.trim()) {
    errors.phone = t('auth.register.phoneRequired');
  }

  // Password validations
  if (!formData.password) {
    errors.password = t('auth.register.passwordRequired');
  } else {
    const policy = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!policy.test(formData.password)) {
      errors.password = t('auth.register.passwordPolicy');
    }
  }
  if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = t('auth.register.passwordsDontMatch');
  }

  // Driver-specific validations
  if (role === 'driver') {
    if (!formData.country) {
      errors.country = t('auth.register.countryRequired');
    }
    if (!formData.licenseNumber?.trim()) {
      errors.licenseNumber = t('auth.register.licenseNumberRequired');
    }
    if (!formData.licenseExpiry?.trim()) {
      errors.licenseExpiry = t('auth.register.licenseExpiryRequired');
    }
    if (!formData.licensePhotoUri) {
      errors.licensePhotoUri = t('auth.register.licensePhotoRequired');
    }
    if (!formData.techPassportPhotoUri) {
      errors.techPassportPhotoUri = t('auth.register.techPassportPhotoRequired');
    }
    if (!formData.vehicleNumber?.trim()) {
      errors.vehicleNumber = t('auth.register.vehicleNumberRequired');
    }
    if (!formData.experience) {
      errors.experience = t('auth.register.experienceRequired');
    }
    if (!formData.tariff) {
      errors.tariff = t('auth.register.tariffRequired');
    }
    if (!formData.carBrand) {
      errors.carBrand = t('auth.register.carBrandRequired');
    }
    if (!formData.carModel) {
      errors.carModel = t('auth.register.carModelRequired');
    }
    if (!formData.carYear) {
      errors.carYear = t('auth.register.carYearRequired');
    }
    if (!formData.carMileage?.trim()) {
      errors.carMileage = t('auth.register.carMileageRequired');
    }
  }

  return errors;
};
