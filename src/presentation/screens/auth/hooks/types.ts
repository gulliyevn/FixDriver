import { UserRole } from '../../../../shared/types/permissions';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // Driver fields
  country?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  vehicleNumber?: string;
  experience?: string;
  tariff?: string;
  carBrand?: string;
  carModel?: string;
  carYear?: string;
  carMileage?: string;
  licensePhotoUri?: string;
  techPassportPhotoUri?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

// UserRole imported from shared types

export interface UseRegisterFormReturn {
  t: (k: string) => string;
  formData: RegisterFormData;
  errors: Partial<RegisterFormData>;
  loading: boolean;
  agree: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  setAgree: (flag: boolean) => void;
  setShowPassword: (flag: boolean) => void;
  setShowConfirmPassword: (flag: boolean) => void;
  updateFormData: (field: keyof RegisterFormData, value: string) => void;
  validateForm: () => boolean;
  handleSelect: (
    field: keyof RegisterFormData, 
    title: string, 
    setSelect: (title: string, field: keyof RegisterFormData, options: SelectOption[]) => void
  ) => void;
  submit: (onSuccess: () => void) => Promise<void>;
}
