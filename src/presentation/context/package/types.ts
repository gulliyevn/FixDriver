/**
 * Package context types
 * Type definitions for package and subscription management
 */

export type PackageType = 'free' | 'plus' | 'premium' | 'premiumPlus';

export interface Subscription {
  packageType: PackageType;
  startDate: string;
  autoRenew: boolean;
  isActive: boolean;
  nextBillingDate: string;
  period: 'month' | 'year';
  pendingExtension?: {
    packageType: PackageType;
    period: 'month' | 'year';
    activationDate: string;
    price: number;
  };
  pendingAutoRenewal?: {
    price: number;
    packageName: string;
    lastNotificationDate?: string; // Last notification date
  };
}

export interface PackageContextType {
  currentPackage: PackageType;
  subscription: Subscription | null;
  updatePackage: (newPackage: PackageType, period?: 'month' | 'year') => Promise<void>;
  extendSubscription: (packageType: PackageType, period: 'month' | 'year', price: number) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  toggleAutoRenew: () => Promise<void>;
  processAutoRenewal: () => Promise<boolean>;
  checkPendingAutoRenewal: () => Promise<boolean>;
  getPackageIcon: (packageType?: PackageType) => string;
  getPackageColor: (packageType?: PackageType) => string;
  getPackagePrice: (packageType: PackageType, period?: 'month' | 'year') => number;
}

export interface PackageProviderProps {
  children: React.ReactNode;
}
