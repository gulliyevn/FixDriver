export interface Address {
  id: string;
  title: string;
  address: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export const mockAddresses: Address[] = [
  {
    id: '1',
    title: 'Дом',
    address: 'ул. Ленина, 123, кв. 45',
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
    isDefault: false,
    latitude: 40.4093,
    longitude: 49.8671,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
];

export const getAddresses = (): Address[] => {
  return mockAddresses;
};

export const addAddress = (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Address => {
  const newAddress: Address = {
    ...address,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return newAddress;
};

export const updateAddress = (id: string, updates: Partial<Address>): Address | null => {
  const address = mockAddresses.find(addr => addr.id === id);
  if (!address) return null;
  
  return {
    ...address,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const deleteAddress = (id: string): boolean => {
  const index = mockAddresses.findIndex(addr => addr.id === id);
  if (index === -1) return false;
  
  mockAddresses.splice(index, 1);
  return true;
};

export const setDefaultAddress = (id: string): boolean => {
  const address = mockAddresses.find(addr => addr.id === id);
  if (!address) return false;
  
  // Сбрасываем все адреса как не по умолчанию
  mockAddresses.forEach(addr => addr.isDefault = false);
  
  // Устанавливаем выбранный как по умолчанию
  address.isDefault = true;
  return true;
}; 