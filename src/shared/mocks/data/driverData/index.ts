/**
 * Driver Data Module Exports
 * Centralized exports for all driver data components
 */

// Main service
export { DriverDataHelper, driverDataHelper } from './DriverDataHelper';

// Data modules
export { 
  EXPERIENCE_OPTIONS, 
  getExperienceOptionByValue,
  getExperienceOptionsByYears
} from './ExperienceOptions';

export { 
  CAR_BRANDS, 
  getCarBrandByValue,
  getCarBrandsByCategory,
  getCarBrandsByCountry
} from './CarBrands';

export { 
  TARIFF_OPTIONS, 
  getTariffOptionById,
  getTariffOptionsByType,
  getPopularTariffOptions,
  getTariffOptionsByPriceRange
} from './TariffOptions';

export { 
  YEAR_OPTIONS, 
  getYearOptionByValue,
  getYearOptionsByRange,
  getRecentYearOptions,
  getYearOptionsByDecade
} from './YearOptions';

// Re-export types for convenience
export type { 
  ExperienceOption, 
  CarBrand, 
  CarModel, 
  TariffOption, 
  YearOption, 
  DriverDataService,
  CarCategory,
  TariffType,
  PriceRange
} from '../../../../types/driver/driver';
