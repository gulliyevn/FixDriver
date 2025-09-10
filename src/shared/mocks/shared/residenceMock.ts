/**
 * Mock Residence Data
 * Mock data for address and residence management
 */

import { SelectOption } from '../components/Select';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Address {
  id: string;
  title: string;
  address: string;
  category?: string; // Address category
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

// Function to get translated address categories
export const getAddressCategoryOptions = (t: (key: string) => string): SelectOption[] => {
  // Check simple translations
  const test1 = t('profile.residence.title');
  const test2 = t('common.ok');
  
  // Check individual category translations
  const selectCategory = t('profile.residence.categories.selectCategory');
  const home = t('profile.residence.categories.home');
  const work = t('profile.residence.categories.work');
  
  const options: SelectOption[] = [
    { value: '', label: selectCategory },
    { value: 'home', label: home, icon: 'home' as const },
    { value: 'work', label: work, icon: 'briefcase' as const },
    { value: 'university', label: t('profile.residence.categories.university'), icon: 'school' as const },
    { value: 'mall', label: t('profile.residence.categories.mall'), icon: 'cart' as const },
    { value: 'hospital', label: t('profile.residence.categories.hospital'), icon: 'medical' as const },
    { value: 'gym', label: t('profile.residence.categories.gym'), icon: 'fitness' as const },
    { value: 'restaurant', label: t('profile.residence.categories.restaurant'), icon: 'restaurant' as const },
    { value: 'parents', label: t('profile.residence.categories.parents'), icon: 'people' as const },
    { value: 'dacha', label: t('profile.residence.categories.dacha'), icon: 'leaf' as const },
    { value: 'other', label: t('profile.residence.categories.other'), icon: 'ellipsis-horizontal' as const },
  ];
  
  return options;
};

// Mock address data
export const mockAddresses: Address[] = [
  {
    id: 'addr_1',
    title: 'Home',
    address: '123 Main Street, Baku, Azerbaijan',
    category: 'home',
    isDefault: true,
    latitude: 40.3777,
    longitude: 49.8920,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'addr_2',
    title: 'Work',
    address: '456 Business District, Baku, Azerbaijan',
    category: 'work',
    isDefault: false,
    latitude: 40.3953,
    longitude: 49.8512,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'addr_3',
    title: 'University',
    address: '789 Education Center, Baku, Azerbaijan',
    category: 'university',
    isDefault: false,
    latitude: 40.4093,
    longitude: 49.8671,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock address storage functions
export const mockAddressStorage = {
  async getAddresses(): Promise<Address[]> {
    try {
      const data = await AsyncStorage.getItem('mock_addresses');
      return data ? JSON.parse(data) : mockAddresses;
    } catch (error) {
      console.error('Error getting addresses:', error);
      return mockAddresses;
    }
  },

  async saveAddresses(addresses: Address[]): Promise<void> {
    try {
      await AsyncStorage.setItem('mock_addresses', JSON.stringify(addresses));
    } catch (error) {
      console.error('Error saving addresses:', error);
    }
  },

  async addAddress(address: Address): Promise<void> {
    const addresses = await this.getAddresses();
    addresses.push(address);
    await this.saveAddresses(addresses);
  },

  async updateAddress(id: string, updatedAddress: Partial<Address>): Promise<void> {
    const addresses = await this.getAddresses();
    const index = addresses.findIndex(addr => addr.id === id);
    if (index !== -1) {
      addresses[index] = { ...addresses[index], ...updatedAddress };
      await this.saveAddresses(addresses);
    }
  },

  async deleteAddress(id: string): Promise<void> {
    const addresses = await this.getAddresses();
    const filteredAddresses = addresses.filter(addr => addr.id !== id);
    await this.saveAddresses(filteredAddresses);
  },

  async setDefaultAddress(id: string): Promise<void> {
    const addresses = await this.getAddresses();
    addresses.forEach(addr => {
      addr.isDefault = addr.id === id;
    });
    await this.saveAddresses(addresses);
  },
};

// Mock address validation
export const validateAddress = (address: Partial<Address>): string[] => {
  const errors: string[] = [];

  if (!address.title || address.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (!address.address || address.address.trim().length === 0) {
    errors.push('Address is required');
  }

  if (!address.latitude || !address.longitude) {
    errors.push('Location coordinates are required');
  }

  return errors;
};

// Mock address search
export const searchAddresses = (addresses: Address[], query: string): Address[] => {
  if (!query.trim()) return addresses;

  const lowercaseQuery = query.toLowerCase();
  return addresses.filter(address =>
    address.title.toLowerCase().includes(lowercaseQuery) ||
    address.address.toLowerCase().includes(lowercaseQuery) ||
    (address.category && address.category.toLowerCase().includes(lowercaseQuery))
  );
};