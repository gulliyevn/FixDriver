export interface AddressCategoryConfig {
  id: string;
  translationKey: string;
  icon?: string;
}

export const ADDRESS_CATEGORY_CONFIG: AddressCategoryConfig[] = [
  { id: 'home', translationKey: 'profile.residence.categories.home', icon: 'home' },
  { id: 'work', translationKey: 'profile.residence.categories.work', icon: 'briefcase' },
  { id: 'university', translationKey: 'profile.residence.categories.university', icon: 'school' },
  { id: 'mall', translationKey: 'profile.residence.categories.mall', icon: 'cart' },
  { id: 'hospital', translationKey: 'profile.residence.categories.hospital', icon: 'medical' },
  { id: 'gym', translationKey: 'profile.residence.categories.gym', icon: 'fitness' },
  { id: 'restaurant', translationKey: 'profile.residence.categories.restaurant', icon: 'restaurant' },
  { id: 'parents', translationKey: 'profile.residence.categories.parents', icon: 'people' },
  { id: 'dacha', translationKey: 'profile.residence.categories.dacha', icon: 'leaf' },
  { id: 'other', translationKey: 'profile.residence.categories.other', icon: 'ellipsis-horizontal' },
];
