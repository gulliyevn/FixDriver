import { useState } from 'react';
import { Alert } from 'react-native';
import { useI18n } from '../../../../shared/i18n';
import { getTariffOptions, getCarBrandOptions, getCarModelsForTariffAndBrand } from '../../../../shared/constants/driverOptions';
import { driverData } from '../../../../shared/mocks/data/driverData';
import { COUNTRIES_FULL } from '../../../../shared/constants/countries';
import { AuthUseCase } from '../../../../domain/usecases/auth/AuthUseCase';
import { AuthRepository } from '../../../../data/repositories/AuthRepository';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // driver
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

export const useRegisterForm = (role: 'client' | 'driver') => {
  const { t } = useI18n();

  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleNumber: '',
    experience: '',
    tariff: '',
    carBrand: '',
    carModel: '',
    carYear: '',
    carMileage: '',
    licensePhotoUri: '',
    techPassportPhotoUri: '',
  });

  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [brandOptions] = useState(getCarBrandOptions());

  const updateFormData = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const e: Partial<RegisterFormData> = {};
    if (!formData.firstName.trim()) e.firstName = t('auth.register.firstNameRequired');
    if (!formData.lastName.trim()) e.lastName = t('auth.register.lastNameRequired');
    if (!formData.email.trim()) e.email = t('auth.register.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = t('auth.register.emailInvalid');
    if (!formData.phone.trim()) e.phone = t('auth.register.phoneRequired');
    if (!formData.password) e.password = t('auth.register.passwordRequired');
    else {
      const policy = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!policy.test(formData.password)) e.password = t('auth.register.passwordPolicy');
    }
    if (formData.confirmPassword !== formData.password) e.confirmPassword = t('auth.register.passwordsDontMatch');

    if (role === 'driver') {
      if (!formData.country) e.country = t('auth.register.countryRequired');
      if (!formData.licenseNumber?.trim()) e.licenseNumber = t('auth.register.licenseNumberRequired');
      if (!formData.licenseExpiry?.trim()) e.licenseExpiry = t('auth.register.licenseExpiryRequired');
      if (!formData.licensePhotoUri) e.licensePhotoUri = t('auth.register.licensePhotoRequired');
      if (!formData.techPassportPhotoUri) e.techPassportPhotoUri = t('auth.register.techPassportPhotoRequired');
      if (!formData.vehicleNumber?.trim()) e.vehicleNumber = t('auth.register.vehicleNumberRequired');
      if (!formData.experience) e.experience = t('auth.register.experienceRequired');
      if (!formData.tariff) e.tariff = t('auth.register.tariffRequired');
      if (!formData.carBrand) e.carBrand = t('auth.register.carBrandRequired');
      if (!formData.carModel) e.carModel = t('auth.register.carModelRequired');
      if (!formData.carYear) e.carYear = t('auth.register.carYearRequired');
      if (!formData.carMileage?.trim()) e.carMileage = t('auth.register.carMileageRequired');
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSelect = (field: keyof RegisterFormData, title: string, setSelect: (title: string, field: keyof RegisterFormData, options: {label:string; value:string}[]) => void) => {
    let options: { label: string; value: string }[] = [];
    switch (field) {
      case 'country':
        options = COUNTRIES_FULL.map(c => ({ label: t(`common.countries.${c.code}`) || c.name || c.nameEn, value: String(c.code) }));
        break;
      case 'experience':
        options = [
          { label: t('auth.register.experienceUpTo1'), value: '0-1' },
          { label: t('auth.register.experience1to3'), value: '1-3' },
          { label: t('auth.register.experience3to5'), value: '3-5' },
          { label: t('auth.register.experience5to10'), value: '5-10' },
          { label: t('auth.register.experience10plus'), value: '10+' },
        ];
        break;
      case 'tariff':
        options = getTariffOptions(t).map(o => ({ label: String(o.label), value: String(o.value) }));
        break;
      case 'carBrand': {
        // Require tariff first
        if (!formData.tariff) {
          Alert.alert(title, t('auth.register.tariffPlaceholder'));
          break;
        }
        // Brands that have at least one model for the selected tariff
        const allowedBrands = driverData.getCarBrands()
          .filter(brand => {
            const models = driverData.getCarModelsByBrand(brand.value);
            return models.some(m => String(m.tariff) === String(formData.tariff));
          });
        options = allowedBrands.map(o => ({ label: String(o.label), value: String(o.value) }));
        break;
      }
      case 'carModel': {
        // Require brand first
        if (!formData.carBrand) {
          Alert.alert(title, t('auth.register.carBrandPlaceholder'));
          break;
        }
        const models = driverData.getCarModelsByBrand(formData.carBrand || '');
        const filteredByTariff = formData.tariff
          ? models.filter(m => !m.tariff || String(m.tariff) === String(formData.tariff))
          : models;
        options = filteredByTariff.map(o => ({ label: String(o.label), value: String(o.value) }));
        break;
      }
      case 'carYear':
        options = driverData.getYearOptions().map(o => ({ label: String(o.label), value: String(o.value) }));
        break;
      case 'carMileage':
        options = [
          { label: t('auth.register.mileageUpTo50k'), value: '≤50000' },
          { label: t('auth.register.mileage50kto100k'), value: '50000-100000' },
          { label: t('auth.register.mileage100kto150k'), value: '100000-150000' },
          { label: t('auth.register.mileage150kPlus'), value: '150000+' },
        ];
        break;
      default:
        break;
    }

    if (options.length === 0) {
      Alert.alert(title, t('common.noOptions'));
      return;
    }
    setSelect(title, field, options);
  };

  const submit = async (onSuccess: () => void) => {
    if (!agree) {
      Alert.alert(t('auth.register.agreementRequired'));
      return;
    }
    if (!validateForm()) return;

    setLoading(true);
    try {
      const useCase = new AuthUseCase(new AuthRepository());
      // Register user
      await useCase.register({ ...(formData as any), role } as any);
      // Auto-login after successful registration
      await useCase.login(formData.email, formData.password, true);
      setLoading(false);
      onSuccess();
    } catch (e) {
      setLoading(false);
      Alert.alert(t('auth.register.errorTitle'), t('auth.register.errorText'));
    }
  };

  return {
    t,
    formData,
    errors,
    loading,
    agree,
    showPassword,
    showConfirmPassword,
    setAgree,
    setShowPassword,
    setShowConfirmPassword,
    updateFormData,
    validateForm,
    handleSelect,
    submit,
  };
};


