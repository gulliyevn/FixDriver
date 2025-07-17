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

// Предустановленные варианты категорий для адресов
export const addressCategoryOptions: SelectOption[] = [
  { value: '', label: 'Выберите категорию' },
  { value: 'Дом', label: 'Дом', icon: 'home' },
  { value: 'Работа', label: 'Работа', icon: 'briefcase' },
  { value: 'Университет', label: 'Университет', icon: 'school' },
  { value: 'Торговый центр', label: 'Торговый центр', icon: 'cart' },
  { value: 'Больница', label: 'Больница', icon: 'medical' },
  { value: 'Спортзал', label: 'Спортзал', icon: 'fitness' },
  { value: 'Ресторан', label: 'Ресторан', icon: 'restaurant' },
  { value: 'Родители', label: 'Родители', icon: 'people' },
  { value: 'Дача', label: 'Дача', icon: 'leaf' },
  { value: 'Другой', label: 'Другой', icon: 'ellipsis-horizontal' },
];

// Начальные адреса по умолчанию
const defaultAddresses: Address[] = [
  {
    id: '1',
    title: 'Дом',
    address: 'ул. Ленина, 123, кв. 45',
    category: 'Дом',
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
    category: 'Работа',
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
    console.error('Error loading addresses from storage:', error);
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
    console.error('Error saving addresses to storage:', error);
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
  
  // Сбрасываем все адреса как не по умолчанию
  mockAddresses.forEach(addr => addr.isDefault = false);
  
  // Устанавливаем выбранный как по умолчанию
  address.isDefault = true;
  
  // Сохраняем в AsyncStorage
  await saveAddressesToStorage();
  
  return true;
}; 