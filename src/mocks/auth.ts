import { User, UserRole, Client, Driver } from '../types/user';

// Моки пользователей для входа
export const mockUsers: (Client | Driver)[] = [
  {
    id: 'client_1',
    email: 'client@example.com',
    name: 'Анна',
    surname: 'Иванова',
    phone: '+994501234567',
    role: UserRole.CLIENT,
    avatar: 'https://via.placeholder.com/150',
    rating: 4.8,
    createdAt: '2024-01-01T00:00:00Z',
    address: 'ул. Низами, 23, Баку',
    children: [
      {
        id: 'child_1',
        name: 'Алиса Иванова',
        age: 8,
        school: 'Школа №15',
        address: 'ул. Низами, 23, Баку',
      }
    ],
    paymentMethods: [
      {
        id: 'card_1',
        type: 'card',
        last4: '1234',
        brand: 'Visa',
        isDefault: true,
      }
    ],
  } as Client,
  {
    id: 'driver_1',
    email: 'driver@example.com',
    name: 'Дмитрий',
    surname: 'Петров',
    phone: '+994509876543',
    role: UserRole.DRIVER,
    avatar: 'https://via.placeholder.com/150',
    rating: 4.9,
    createdAt: '2024-01-01T00:00:00Z',
    address: 'ул. Рашида Бейбутова, 45, Баку',
    vehicle: {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Белый',
      licensePlate: '10-AA-123',
    },
    isAvailable: true,
    currentLocation: {
      latitude: 40.3777,
      longitude: 49.8920,
    },
    car: 'Toyota Camry 2020',
    carInfo: 'Комфортный седан для перевозки детей',
    clientsPerDay: 15,
  } as Driver,
];

// Простые пароли для моков (в реальном приложении не должно быть)
const mockPasswords: Record<string, string> = {
  'client@example.com': 'password123',
  'driver@example.com': 'password123',
};

// Функция для поиска пользователя по email и паролю
export const findAuthUserByCredentials = (email: string, password: string): (Client | Driver) | null => {
  console.log('🔍 findAuthUserByCredentials called with:', { email, password });
  console.log('📋 Available mock users:', mockUsers.map(u => ({ email: u.email, role: u.role })));
  console.log('🔑 Available passwords:', Object.keys(mockPasswords));
  
  const user = mockUsers.find(user => user.email === email);
  console.log('👤 Found user:', user ? { email: user.email, role: user.role } : 'null');
  
  if (user && mockPasswords[email] === password) {
    console.log('✅ User and password match!');
    return user;
  }
  
  console.log('❌ No match found. User exists:', !!user, 'Password correct:', mockPasswords[email] === password);
  return null;
};

// Функция для поиска пользователя по email
export const findAuthUserByEmail = (email: string): (Client | Driver) | null => {
  return mockUsers.find(user => user.email === email) || null;
};

// Функция для создания мок пользователя для аутентификации
export const createAuthMockUser = (data: Partial<User>): (Client | Driver) => {
  const id = `user_${Date.now()}`;
  const now = new Date().toISOString();
  
  if (data.role === UserRole.DRIVER) {
    return {
      id,
      email: data.email || 'user@example.com',
      name: data.name || 'Пользователь',
      surname: data.surname || 'Тестовый',
      phone: data.phone || '+994501234567',
      role: UserRole.DRIVER,
      avatar: data.avatar || 'https://via.placeholder.com/150',
      rating: data.rating || 4.5,
      createdAt: data.createdAt || now,
      address: data.address || 'Баку, Азербайджан',
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        color: 'Белый',
        licensePlate: '10-AA-123',
      },
      isAvailable: true,
      car: 'Toyota Camry 2020',
      carInfo: 'Комфортный седан',
      clientsPerDay: 10,
    } as Driver;
  } else {
    return {
      id,
      email: data.email || 'user@example.com',
      name: data.name || 'Пользователь',
      surname: data.surname || 'Тестовый',
      phone: data.phone || '+994501234567',
      role: UserRole.CLIENT,
      avatar: data.avatar || 'https://via.placeholder.com/150',
      rating: data.rating || 4.5,
      createdAt: data.createdAt || now,
      address: data.address || 'Баку, Азербайджан',
      children: [],
      paymentMethods: [],
    } as Client;
  }
}; 