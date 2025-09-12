/**
 * Car Brands Data
 * Mock data for car brand selection
 */

import { CarBrand, CarCategory } from '../../../../types/driver/driver';

export const CAR_BRANDS: CarBrand[] = [
  {
    label: 'Mercedes-Benz',
    value: 'Mercedes',
    country: 'Germany',
    category: CarCategory.LUXURY,
    popularModels: ['E-Class', 'S-Class', 'C-Class', 'GLE', 'GLS']
  },
  {
    label: 'BMW',
    value: 'BMW',
    country: 'Germany',
    category: CarCategory.LUXURY,
    popularModels: ['5 Series', '7 Series', '3 Series', 'X5', 'X7']
  },
  {
    label: 'Audi',
    value: 'Audi',
    country: 'Germany',
    category: CarCategory.LUXURY,
    popularModels: ['A6', 'A8', 'A4', 'Q7', 'Q8']
  },
  {
    label: 'Toyota',
    value: 'Toyota',
    country: 'Japan',
    category: CarCategory.SEDAN,
    popularModels: ['Camry', 'Corolla', 'Avalon', 'RAV4', 'Highlander']
  },
  {
    label: 'Honda',
    value: 'Honda',
    country: 'Japan',
    category: CarCategory.SEDAN,
    popularModels: ['Accord', 'Civic', 'Insight', 'CR-V', 'Pilot']
  },
  {
    label: 'Nissan',
    value: 'Nissan',
    country: 'Japan',
    category: CarCategory.SEDAN,
    popularModels: ['Altima', 'Maxima', 'Sentra', 'Rogue', 'Murano']
  },
  {
    label: 'Hyundai',
    value: 'Hyundai',
    country: 'South Korea',
    category: CarCategory.SEDAN,
    popularModels: ['Elantra', 'Sonata', 'Accent', 'Tucson', 'Santa Fe']
  },
  {
    label: 'Kia',
    value: 'Kia',
    country: 'South Korea',
    category: CarCategory.SEDAN,
    popularModels: ['Optima', 'Forte', 'Rio', 'Sportage', 'Sorento']
  },
  {
    label: 'Ford',
    value: 'Ford',
    country: 'USA',
    category: CarCategory.SEDAN,
    popularModels: ['Fusion', 'Focus', 'Mustang', 'Explorer', 'Escape']
  },
  {
    label: 'Chevrolet',
    value: 'Chevrolet',
    country: 'USA',
    category: CarCategory.SEDAN,
    popularModels: ['Malibu', 'Cruze', 'Impala', 'Equinox', 'Traverse']
  },
  {
    label: 'Volkswagen',
    value: 'Volkswagen',
    country: 'Germany',
    category: CarCategory.SEDAN,
    popularModels: ['Passat', 'Jetta', 'Golf', 'Tiguan', 'Atlas']
  },
  {
    label: 'Mazda',
    value: 'Mazda',
    country: 'Japan',
    category: CarCategory.SEDAN,
    popularModels: ['Mazda6', 'Mazda3', 'CX-5', 'CX-9', 'MX-5']
  }
];

export const getCarBrandByValue = (value: string): CarBrand | undefined => {
  return CAR_BRANDS.find(brand => brand.value === value);
};

export const getCarBrandsByCategory = (category: CarCategory): CarBrand[] => {
  return CAR_BRANDS.filter(brand => brand.category === category);
};

export const getCarBrandsByCountry = (country: string): CarBrand[] => {
  return CAR_BRANDS.filter(brand => brand.country === country);
};
