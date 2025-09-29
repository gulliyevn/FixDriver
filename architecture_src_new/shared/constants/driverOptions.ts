import { driverData } from '../mocks/data/driverData';
import type { CarBrand, CarModel } from '../types/driver';

export type OptionItem = { label: string; value: string };

// Tariff types matching the driver types
export type TariffOption = OptionItem & {
  description?: string;
  availableCars?: string[]; // Brands available for this tariff
};

// Returns tariff options with localized labels and available cars
export const getTariffOptions = (t: (key: string) => string): TariffOption[] => {
  return [
    { 
      label: t('auth.register.tariffPlaceholder'), 
      value: '',
      description: t('auth.register.tariffRequired')
    },
    { 
      label: t('auth.register.tariffEconomy'), 
      value: 'Economy',
      description: 'Базовый тариф для экономичных поездок',
      availableCars: getCarBrandsForTariff('Economy')
    },
    { 
      label: t('auth.register.tariffStandard'), 
      value: 'Standard',
      description: 'Стандартный тариф для повседневных поездок', 
      availableCars: getCarBrandsForTariff('Standard')
    },
    { 
      label: t('auth.register.tariffPremium'), 
      value: 'Premium',
      description: 'Премиум тариф для требовательных клиентов',
      availableCars: getCarBrandsForTariff('Premium')
    },
    { 
      label: t('auth.register.tariffBusiness'), 
      value: 'Business',
      description: 'Бизнес тариф для корпоративных клиентов',
      availableCars: getCarBrandsForTariff('Business')
    }
  ];
};

// Get car brands that have models for specific tariff
export const getCarBrandsForTariff = (tariff: string): string[] => {
  const allBrands = driverData.getCarBrands();
  const availableBrands: string[] = [];
  
  allBrands.forEach(brand => {
    const brandModels = driverData.getCarModelsByBrand(brand.value);
    const hasModelsForTariff = brandModels.some(model => model.tariff === tariff);
    if (hasModelsForTariff) {
      availableBrands.push(brand.value);
    }
  });
  
  return availableBrands;
};

// Get car models for specific tariff and brand
export const getCarModelsForTariffAndBrand = (tariff: string, brand: string): CarModel[] => {
  return driverData.getCarModelsByBrand(brand).filter(model => model.tariff === tariff);
};

// Get all available car brands (for UI dropdowns)
export const getCarBrandOptions = (): CarBrand[] => {
  return driverData.getCarBrands();
};

// Experience options can be constructed inline in the form, but provided here if needed
export const getExperienceOptions = (t: (key: string) => string): OptionItem[] => {
  return [
    { label: t('auth.register.experienceUpTo1'), value: '0-1' },
    { label: t('auth.register.experience1to3'), value: '1-3' },
    { label: t('auth.register.experience3to5'), value: '3-5' },
    { label: t('auth.register.experience5to10'), value: '5-10' },
    { label: t('auth.register.experience10plus'), value: '10+' },
  ];
};


