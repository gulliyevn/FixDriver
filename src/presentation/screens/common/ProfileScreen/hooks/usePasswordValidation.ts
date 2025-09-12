/**
 * usePasswordValidation hook
 * Handles password validation logic
 */

import { useState } from 'react';
import { useLanguage } from '../../../../context/LanguageContext';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const usePasswordValidation = () => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateCurrentPassword = (password: string): string | undefined => {
    if (!password.trim()) {
      return t('password.validation.currentRequired');
    }
    return undefined;
  };

  const validateNewPassword = (password: string): string | undefined => {
    if (!password) {
      return t('password.validation.newRequired');
    }
    
    if (password.length < 8) {
      return t('password.validation.tooShort');
    }
    
    if (!/[a-z]/.test(password)) {
      return t('password.validation.noLowercase');
    }
    
    if (!/[A-Z]/.test(password)) {
      return t('password.validation.noUppercase');
    }
    
    if (!/\d/.test(password)) {
      return t('password.validation.noNumber');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return t('password.validation.noSpecial');
    }
    
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) {
      return t('password.validation.confirmRequired');
    }
    
    if (password !== confirmPassword) {
      return t('password.validation.noMatch');
    }
    
    return undefined;
  };

  const validateForm = (formData: FormData): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate current password
    const currentError = validateCurrentPassword(formData.currentPassword);
    if (currentError) {
      newErrors.currentPassword = currentError;
    }

    // Validate new password
    const newError = validateNewPassword(formData.newPassword);
    if (newError) {
      newErrors.newPassword = newError;
    }

    // Validate confirm password
    const confirmError = validateConfirmPassword(formData.newPassword, formData.confirmPassword);
    if (confirmError) {
      newErrors.confirmPassword = confirmError;
    }

    // Check if new password is different from current
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = t('password.validation.sameAsCurrent');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (password: string): string | undefined => {
    return validateNewPassword(password);
  };

  return {
    errors,
    setErrors,
    validateForm,
    validatePassword,
    validateCurrentPassword,
    validateNewPassword,
    validateConfirmPassword,
  };
};
