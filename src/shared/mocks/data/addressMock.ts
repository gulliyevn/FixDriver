import { Address } from '../../types/profile';

/**
 * Mock Address Data
 * 
 * Sample addresses for development and testing
 */

export const mockAddresses: Address[] = [
  {
    id: 'address_1',
    title: 'Home',
    address: '123 Main Street, Downtown, City 12345',
    category: 'home',
    isDefault: true,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
  },
  {
    id: 'address_2',
    title: 'Office',
    address: '456 Business Avenue, Business District, City 12345',
    category: 'work',
    isDefault: false,
    createdAt: new Date('2024-01-20T14:30:00Z'),
    updatedAt: new Date('2024-01-20T14:30:00Z'),
  },
  {
    id: 'address_3',
    title: 'Gym',
    address: '789 Fitness Center, Sports Complex, City 12345',
    category: 'other',
    isDefault: false,
    createdAt: new Date('2024-02-01T09:15:00Z'),
    updatedAt: new Date('2024-02-01T09:15:00Z'),
  },
];

/**
 * Address category options for form selection
 */
export const getAddressCategoryOptions = (t: (key: string) => string) => [
  { value: 'home', label: t('residence.categories.home') },
  { value: 'work', label: t('residence.categories.work') },
  { value: 'other', label: t('residence.categories.other') },
];
