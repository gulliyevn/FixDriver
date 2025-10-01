import { useEffect, useMemo, useState } from 'react';

import AddressService, { AddressCategory } from '../../services/addressService';
import { ADDRESS_CATEGORY_CONFIG } from '../constants/addressCategories';
import { useI18n } from '../../hooks/useI18n';

const addressService = new AddressService();

export interface AddressCategoryOption {
  id: string;
  label: string;
  icon?: string;
  color?: string;
}

export const useAddressCategories = () => {
  const { t } = useI18n();
  const [categories, setCategories] = useState<AddressCategoryOption[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      if (__DEV__) {
        const options = ADDRESS_CATEGORY_CONFIG.map(config => ({
          id: config.id,
          label: t(config.translationKey),
          icon: config.icon,
        }));
        setCategories(options);
        return;
      }

      const apiCategories = await addressService.fetchAddressCategories();
      if (!apiCategories.length) {
        const fallback = ADDRESS_CATEGORY_CONFIG.map(config => ({
          id: config.id,
          label: t(config.translationKey),
          icon: config.icon,
        }));
        setCategories(fallback);
        return;
      }

      setCategories(
        apiCategories.map(category => ({
          id: category.id,
          label: t(category.name),
          icon: category.icon,
          color: category.color,
        }))
      );
    };

    loadCategories();
  }, [t]);

  const options = useMemo(() => categories, [categories]);

  return {
    categories: options,
  };
};
