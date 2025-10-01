import { AddressCategoryConfig } from '../constants/addressCategories';

export interface AddressInput {
  title: string;
  address: string;
  category: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export interface AddressCategoryOption extends AddressCategoryConfig {
  label: string;
}
