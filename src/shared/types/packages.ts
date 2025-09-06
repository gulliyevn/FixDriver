export enum PackageType {
  FREE = 'free',
  PLUS = 'plus',
  PREMIUM = 'premium',
  PREMIUM_PLUS = 'premiumPlus',
  SINGLE = 'single',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum PackagePeriod {
  MONTH = '_month',
  YEAR = '_year'
}

export interface PackageVisuals {
  icon: string;
  color: string;
  label: string;
  decoration: string;
  isPremium: boolean;
}

export interface PackagePricing {
  price: number;
  currency: string;
  formatted: string;
}

export interface PackageVisualsService {
  getPackageIcon(type: string): string;
  getPackageColor(type: string): string;
  getPackageLabel(type: string): string;
  getPackageDecoration(type: string): string;
  formatPackagePrice(price: number): string;
  isPremiumPackage(type: string): boolean;
  getPackageVisuals(type: string): PackageVisuals;
}
