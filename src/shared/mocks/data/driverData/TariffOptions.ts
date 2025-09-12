/**
 * Tariff Options for Drivers
 * Mock data for driver tariff selection
 */

import { TariffOption, TariffType, PriceRange } from '../../../../types/driver/driver';

export const TARIFF_OPTIONS: TariffOption[] = [
  {
    id: 'economy',
    name: 'Economy',
    type: TariffType.ECONOMY,
    description: 'Basic service for budget-conscious riders',
    priceRange: {
      min: 1.50,
      max: 3.00,
      currency: 'AFc'
    } as PriceRange,
    features: [
      'Basic vehicle',
      'Standard service',
      'Shared rides available'
    ],
    isPopular: true
  },
  {
    id: 'comfort',
    name: 'Comfort',
    type: TariffType.COMFORT,
    description: 'Enhanced service with better vehicles',
    priceRange: {
      min: 2.50,
      max: 4.50,
      currency: 'AFc'
    } as PriceRange,
    features: [
      'Mid-size vehicle',
      'Professional driver',
      'Priority booking',
      'Climate control'
    ],
    isPopular: false
  },
  {
    id: 'business',
    name: 'Business',
    type: TariffType.BUSINESS,
    description: 'Premium service for business travelers',
    priceRange: {
      min: 4.00,
      max: 7.00,
      currency: 'AFc'
    } as PriceRange,
    features: [
      'Luxury vehicle',
      'Experienced driver',
      'Executive service',
      'Wi-Fi available',
      'Water and amenities'
    ],
    isPopular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    type: TariffType.PREMIUM,
    description: 'Top-tier service with luxury vehicles',
    priceRange: {
      min: 6.00,
      max: 12.00,
      currency: 'AFc'
    } as PriceRange,
    features: [
      'Luxury sedan/SUV',
      'Professional chauffeur',
      'VIP treatment',
      'Premium amenities',
      'Priority support',
      'Custom requests'
    ],
    isPopular: false
  }
];

export const getTariffOptionById = (id: string): TariffOption | undefined => {
  return TARIFF_OPTIONS.find(tariff => tariff.id === id);
};

export const getTariffOptionsByType = (type: TariffType): TariffOption[] => {
  return TARIFF_OPTIONS.filter(tariff => tariff.type === type);
};

export const getPopularTariffOptions = (): TariffOption[] => {
  return TARIFF_OPTIONS.filter(tariff => tariff.isPopular);
};

export const getTariffOptionsByPriceRange = (minPrice: number, maxPrice: number): TariffOption[] => {
  return TARIFF_OPTIONS.filter(tariff => 
    tariff.priceRange.min >= minPrice && tariff.priceRange.max <= maxPrice
  );
};
