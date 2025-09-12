/**
 * Driver types
 * Type definitions for driver-related data
 */

export enum DriverStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
  INACTIVE = 'inactive',
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  rating: number;
  isAvailable: boolean;
  phone_number: string;
  price?: string;
}

// Driver data types
export interface ExperienceOption {
  label: string;
  value: string;
  years: number;
  description: string;
}

export enum CarCategory {
  SEDAN = 'sedan',
  SUV = 'suv',
  COMPACT = 'compact',
  LUXURY = 'luxury',
  SPORTS = 'sports',
  ELECTRIC = 'electric',
}

export interface CarBrand {
  label: string;
  value: string;
  country: string;
  category: CarCategory;
  popularModels: string[];
}

export interface CarModel {
  label: string;
  value: string;
  brand: string;
  yearFrom: number;
  yearTo?: number;
  category: CarCategory;
  tariff: TariffType;
  features: string[];
  priceRange: PriceRange;
}

export enum TariffType {
  ECONOMY = 'economy',
  STANDARD = 'standard',
  PLUS = 'plus',
  PREMIUM = 'premium',
  BUSINESS = 'business',
  LUXURY = 'luxury',
}

export enum PriceRange {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  PREMIUM = 'premium',
}

export interface TariffOption {
  label: string;
  value: TariffType;
  description: string;
  priceMultiplier: number;
  features: string[];
}

export interface YearOption {
  label: string;
  value: string;
  year: number;
}

export interface DriverDataService {
  getExperienceOptions(): ExperienceOption[];
  getCarBrands(): CarBrand[];
  getCarModelsByBrand(brand: string): CarModel[];
  getYearOptions(): YearOption[];
  getTariffOptions(t: (key: string) => string): TariffOption[];
  getCarByModel(model: string): CarModel | null;
  getBrandByModel(model: string): CarBrand | null;
  getModelsByTariff(tariff: TariffType): CarModel[];
  getModelsByYear(year: number): CarModel[];
  getPopularModels(): CarModel[];
  getModelsByCategory(category: CarCategory): CarModel[];
  searchModels(query: string): CarModel[];
}