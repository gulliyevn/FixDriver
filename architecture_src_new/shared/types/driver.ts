export interface Driver {
  id: string;
  userId: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation: {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
  };
  rating: {
    value: number;
    count: number;
    average: number;
  };
  vehicleId: string;
  licenseNumber: string;
  experience: number;
  totalTrips: number;
  totalEarnings: number;
  isOnline: boolean;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperienceOption {
  label: string;
  value: string;
  years: number;
  description?: string;
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
}

export enum CarCategory {
  ECONOMY = 'Economy',
  COMPACT = 'Compact',
  SEDAN = 'Sedan',
  SUV = 'SUV',
  LUXURY = 'Luxury',
  SPORTS = 'Sports',
  ELECTRIC = 'Electric',
  HYBRID = 'Hybrid'
}

export enum TariffType {
  ECONOMY = 'Economy',
  STANDARD = 'Standard',
  PLUS = 'Plus',
  PREMIUM = 'Premium',
  BUSINESS = 'Business',
  LUXURY = 'Luxury'
}

export enum PriceRange {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  PREMIUM = 'Premium'
}
