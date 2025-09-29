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
  
  return newAddress;
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
  
  return updatedAddress;
};

export const deleteAddress = async (id: string): Promise<boolean> => {
  const index = mockAddresses.findIndex(addr => addr.id === id);
  if (index === -1) return false;
  
  mockAddresses.splice(index, 1);
  
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
  
  return true;
};
