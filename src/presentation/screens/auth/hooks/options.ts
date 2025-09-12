import { Alert } from 'react-native';
import { getTariffOptions } from '../../../../shared/constants/driverOptions';
import { carBrands, carModelsByBrand, getYearOptions } from '../../../../shared/constants/cars';
import { COUNTRIES_FULL } from '../../../../shared/constants/countries';
import { RegisterFormData, SelectOption } from './types';

export const getSelectOptions = (
  field: keyof RegisterFormData,
  formData: RegisterFormData,
  t: (k: string) => string
): SelectOption[] => {
  let options: SelectOption[] = [];

  switch (field) {
    case 'country':
      options = COUNTRIES_FULL.map(c => ({ label: c.name, value: String(c.code) }));
      break;

    case 'experience':
      options = [
        { label: t('auth.register.experienceUpTo1'), value: '0-1' },
        { label: t('auth.register.experience1'), value: '1' },
        { label: t('auth.register.experience2'), value: '2' },
        { label: t('auth.register.experience3'), value: '3' },
        { label: t('auth.register.experience4'), value: '4' },
        { label: t('auth.register.experience5'), value: '5' },
        { label: t('auth.register.experience6'), value: '6' },
        { label: t('auth.register.experience7'), value: '7' },
        { label: t('auth.register.experience8'), value: '8' },
        { label: t('auth.register.experience9'), value: '9' },
        { label: t('auth.register.experience10'), value: '10' },
        { label: t('auth.register.experience10plus'), value: '10+' },
      ];
      break;

    case 'tariff':
      options = getTariffOptions(t).map(o => ({ label: String(o.label), value: String(o.value) }));
      break;

    case 'carBrand': {
      // Require tariff first
      if (!formData.tariff) {
        Alert.alert(t('auth.register.selectTariff'), t('auth.register.tariffPlaceholder'));
        return [];
      }
      // Brands that have at least one model for the selected tariff
      const allowedBrands = Object.entries(carModelsByBrand)
        .filter(([brand, models]) => models.some(m => String(m.tariff) === String(formData.tariff)))
        .map(([brand]) => brand);
      options = carBrands
        .filter(b => allowedBrands.includes(String(b.value)))
        .map(o => ({ label: String(o.label), value: String(o.value) }));
      break;
    }

    case 'carModel': {
      // Require brand first
      if (!formData.carBrand) {
        Alert.alert(t('auth.register.selectCarBrand'), t('auth.register.carBrandPlaceholder'));
        return [];
      }
      const models = (carModelsByBrand[formData.carBrand || ''] || []);
      const filteredByTariff = formData.tariff
        ? models.filter(m => !m.tariff || String(m.tariff) === String(formData.tariff))
        : models;
      options = filteredByTariff.map(o => ({ label: String(o.label), value: String(o.value) }));
      break;
    }

    case 'carYear':
      options = getYearOptions().map(o => ({ label: String(o.label), value: String(o.value) }));
      break;

    case 'carMileage':
      options = [
        { label: t('auth.register.mileageUpTo50k'), value: '≤50000' },
        { label: t('auth.register.mileageUpTo100k'), value: '≤100000' },
        { label: t('auth.register.mileageUpTo150k'), value: '≤150000' },
        { label: t('auth.register.mileage150kPlus'), value: '150000+' },
      ];
      break;

    default:
      break;
  }

  return options;
};

export const handleSelect = (
  field: keyof RegisterFormData,
  title: string,
  formData: RegisterFormData,
  t: (k: string) => string,
  setSelect: (title: string, field: keyof RegisterFormData, options: SelectOption[]) => void
) => {
  const options = getSelectOptions(field, formData, t);

  if (options.length === 0) {
    Alert.alert(title, t('common.noOptions'));
    return;
  }

  setSelect(title, field, options);
};
