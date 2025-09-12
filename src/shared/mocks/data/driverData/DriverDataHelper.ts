/**
 * Driver Data Helper Service
 * Main service for driver data operations
 */

import { 
  DriverDataService, 
  ExperienceOption, 
  CarBrand, 
  CarModel, 
  TariffOption, 
  YearOption 
} from '../../../../types/driver/driver';

import { EXPERIENCE_OPTIONS, getExperienceOptionByValue } from './ExperienceOptions';
import { CAR_BRANDS, getCarBrandByValue } from './CarBrands';
import { TARIFF_OPTIONS, getTariffOptionById } from './TariffOptions';
import { YEAR_OPTIONS, getYearOptionByValue } from './YearOptions';

/**
 * Driver Data Helper Service
 * Provides comprehensive driver and vehicle data
 */
export class DriverDataHelper implements DriverDataService {
  /**
   * Get all experience options
   */
  getExperienceOptions(): ExperienceOption[] {
    return EXPERIENCE_OPTIONS;
  }

  /**
   * Get experience option by value
   */
  getExperienceOptionByValue(value: string): ExperienceOption | undefined {
    return getExperienceOptionByValue(value);
  }

  /**
   * Get all car brands
   */
  getCarBrands(): CarBrand[] {
    return CAR_BRANDS;
  }

  /**
   * Get car brand by value
   */
  getCarBrandByValue(value: string): CarBrand | undefined {
    return getCarBrandByValue(value);
  }

  /**
   * Get all tariff options
   */
  getTariffOptions(): TariffOption[] {
    return TARIFF_OPTIONS;
  }

  /**
   * Get tariff option by ID
   */
  getTariffOptionById(id: string): TariffOption | undefined {
    return getTariffOptionById(id);
  }

  /**
   * Get all year options
   */
  getYearOptions(): YearOption[] {
    return YEAR_OPTIONS;
  }

  /**
   * Get year option by value
   */
  getYearOptionByValue(value: string): YearOption | undefined {
    return getYearOptionByValue(value);
  }

  /**
   * Get popular models for a car brand
   */
  getPopularModelsByBrand(brandValue: string): string[] {
    const brand = this.getCarBrandByValue(brandValue);
    return brand?.popularModels || [];
  }

  /**
   * Get brands by category
   */
  getBrandsByCategory(category: string): CarBrand[] {
    return CAR_BRANDS.filter(brand => brand.category === category);
  }

  /**
   * Get popular tariff options
   */
  getPopularTariffOptions(): TariffOption[] {
    return TARIFF_OPTIONS.filter(tariff => tariff.isPopular);
  }

  /**
   * Get recent year options (last 10 years)
   */
  getRecentYearOptions(years: number = 10): YearOption[] {
    const currentYear = new Date().getFullYear();
    return YEAR_OPTIONS.filter(option => 
      option.year >= currentYear - years
    );
  }
}

// Export singleton instance
export const driverDataHelper = new DriverDataHelper();

// Export all data for direct access if needed
export {
  EXPERIENCE_OPTIONS,
  CAR_BRANDS,
  TARIFF_OPTIONS,
  YEAR_OPTIONS
};
