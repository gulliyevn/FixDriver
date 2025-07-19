export interface Address {
  id: string;
  title: string;
  address: string;
  category?: string; // Категория адреса
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

import { SelectOption } from '../components/Select';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Функция для получения переведенных категорий адресов
export const getAddressCategoryOptions = (t: (key: string) => string): SelectOption[] => {

  
  // Проверяем простые переводы
  const test1 = t('profile.residence.title');
  const test2 = t('common.ok');
  
  
  
  // Проверяем отдельные переводы категорий
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

// Предустановленные варианты категорий для адресов (для обратной совместимости)
export const addressCategoryOptions: SelectOption[] = [
  { value: '', label: 'Выберите категорию' },
  { value: 'home', label: 'Дом', icon: 'home' },
  { value: 'work', label: 'Работа', icon: 'briefcase' },
  { value: 'university', label: 'Университет', icon: 'school' },
  { value: 'mall', label: 'Торговый центр', icon: 'cart' },
  { value: 'hospital', label: 'Больница', icon: 'medical' },
  { value: 'gym', label: 'Спортзал', icon: 'fitness' },
  { value: 'restaurant', label: 'Ресторан', icon: 'restaurant' },
  { value: 'parents', label: 'Родители', icon: 'people' },
  { value: 'dacha', label: 'Дача', icon: 'leaf' },
  { value: 'other', label: 'Другой', icon: 'ellipsis-horizontal' },
];

// Начальные адреса по умолчанию
const defaultAddresses: Address[] = [
  {
    id: '1',
    title: 'Дом',
    address: 'ул. Ленина, 123, кв. 45',
    category: 'home',
    isDefault: true,
    latitude: 40.3777,
    longitude: 49.8920,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Работа',
    address: 'пр. Гейдара Алиева, 78, офис 15',
    category: 'work',
    isDefault: false,
    latitude: 40.4093,
    longitude: 49.8671,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
];

// Глобальный массив для хранения адресов в памяти
let mockAddresses: Address[] = [...defaultAddresses];

export const getAddresses = async (): Promise<Address[]> => {
  try {
    // Пытаемся загрузить из AsyncStorage
    const savedAddresses = await AsyncStorage.getItem('user_addresses');
    if (savedAddresses) {
      mockAddresses = JSON.parse(savedAddresses);
      return mockAddresses;
    }
  } catch (error) {

  }
  
  // Если нет сохраненных адресов, возвращаем дефолтные
  return mockAddresses;
};

// Синхронная версия для обратной совместимости
export const getAddressesSync = (): Address[] => {
  return mockAddresses;
};

export const addAddress = async (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
  const newAddress: Address = {
    ...address,
    category: address.category || '', // Убеждаемся, что category всегда есть
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Добавляем в массив
  mockAddresses.push(newAddress);
  
  // Сохраняем в AsyncStorage
  await saveAddressesToStorage();
  
  return newAddress;
};

// Функция для сохранения адресов в AsyncStorage
const saveAddressesToStorage = async () => {
  try {
    await AsyncStorage.setItem('user_addresses', JSON.stringify(mockAddresses));
  } catch (error) {

  }
};

export const updateAddress = async (id: string, updates: Partial<Address>): Promise<Address | null> => {
  const addressIndex = mockAddresses.findIndex(addr => addr.id === id);
  if (addressIndex === -1) return null;
  
  const updatedAddress = {
    ...mockAddresses[addressIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Обновляем в массиве
  mockAddresses[addressIndex] = updatedAddress;
  
  // Сохраняем в AsyncStorage
  await saveAddressesToStorage();
  
  return updatedAddress;
};

export const deleteAddress = async (id: string): Promise<boolean> => {
  const index = mockAddresses.findIndex(addr => addr.id === id);
  if (index === -1) return false;
  
  mockAddresses.splice(index, 1);
  
  // Сохраняем в AsyncStorage
  await saveAddressesToStorage();
  
  return true;
};

export const setDefaultAddress = async (id: string): Promise<boolean> => {
  const address = mockAddresses.find(addr => addr.id === id);
  if (!address) return false;
  
  // Сбрасываем только адреса той же категории как не по умолчанию
  mockAddresses.forEach(addr => {
    if (addr.category === address.category) {
      addr.isDefault = false;
    }
  });
  
  // Устанавливаем выбранный как по умолчанию
  address.isDefault = true;
  
  // Сохраняем в AsyncStorage
  await saveAddressesToStorage();
  
  return true;
}; 