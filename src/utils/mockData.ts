/**
 * Централизованный файл для всех мок данных проекта
 * Используется для разработки и тестирования
 * 
 * Структура:
 * - Пользователи (клиенты и водители)
 * - Заказы и поездки
 * - Чаты и сообщения
 * - Уведомления
 * - Пакеты услуг
 * - Расписание
 * - Дети (для клиентов)
 */

import { User, UserRole } from '../types/user';
import { Driver, DriverStats, DriverStatus } from '../types/driver';
import { Order, OrderStatus } from '../types/order';
import { Chat, Message } from '../types/chat';
import { Notification } from '../services/NotificationService';
import { Package } from '../types/package';

// ===== КОНСТАНТЫ =====
const MOCK_AVATARS = {
  CLIENT_1: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  CLIENT_2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  CLIENT_3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  DRIVER_1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  DRIVER_2: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  DRIVER_3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
};

const MOCK_LOCATIONS = {
  BAKU_CENTER: { latitude: 40.3777, longitude: 49.8920 },
  BAKU_NORTH: { latitude: 40.3953, longitude: 49.8512 },
  BAKU_EAST: { latitude: 40.4093, longitude: 49.8671 },
  BAKU_SOUTH: { latitude: 40.3777, longitude: 49.8920 },
};

// ===== МОК ПОЛЬЗОВАТЕЛИ (КЛИЕНТЫ) =====
export const mockUsers: User[] = [
  {
    id: 'client_1',
    email: 'anna.ivanova@example.com',
    name: 'Анна',
    surname: 'Иванова',
    role: UserRole.CLIENT,
    phone: '+994501234567',
    avatar: MOCK_AVATARS.CLIENT_1,
    rating: 4.8,
    createdAt: '2024-01-01T00:00:00Z',
    address: 'ул. Низами, 23, Баку',
  },
  {
    id: 'client_2',
    email: 'petr.sidorov@example.com',
    name: 'Петр',
    surname: 'Сидоров',
    role: UserRole.CLIENT,
    phone: '+994509876543',
    avatar: MOCK_AVATARS.CLIENT_2,
    rating: 4.6,
    createdAt: '2024-01-02T00:00:00Z',
    address: 'пр. Мира, 25, Баку',
  },
  {
    id: 'client_3',
    email: 'maria.kozlova@example.com',
    name: 'Мария',
    surname: 'Козлова',
    role: UserRole.CLIENT,
    phone: '+994505551234',
    avatar: MOCK_AVATARS.CLIENT_3,
    rating: 4.9,
    createdAt: '2024-01-03T00:00:00Z',
    address: 'ул. Советская, 7, Баку',
  },
];

// ===== МОК ВОДИТЕЛИ =====
export const mockDrivers: Driver[] = [
  {
    id: 'driver_1',
    email: 'alex.petrov@example.com',
    first_name: 'Алексей',
    last_name: 'Петров',
    phone_number: '+994501112233',
    license_number: 'AB123456',
    license_expiry_date: '2025-12-31',
    vehicle_brand: 'Toyota',
    vehicle_model: 'Camry',
    vehicle_number: '10-AA-123',
    vehicle_year: 2020,
    status: DriverStatus.ACTIVE,
    rating: 4.8,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
    isAvailable: true,
    avatar: MOCK_AVATARS.DRIVER_1,
    location: MOCK_LOCATIONS.BAKU_CENTER,
  },
  {
    id: 'driver_2',
    email: 'dmitry.smirnov@example.com',
    first_name: 'Дмитрий',
    last_name: 'Смирнов',
    phone_number: '+994504445566',
    license_number: 'CD789012',
    license_expiry_date: '2026-06-30',
    vehicle_brand: 'Honda',
    vehicle_model: 'Civic',
    vehicle_number: '10-BB-456',
    vehicle_year: 2019,
    status: DriverStatus.ACTIVE,
    rating: 4.6,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-15T09:15:00Z',
    isAvailable: true,
    avatar: MOCK_AVATARS.DRIVER_2,
    location: MOCK_LOCATIONS.BAKU_NORTH,
  },
  {
    id: 'driver_3',
    email: 'sergey.kozlov@example.com',
    first_name: 'Сергей',
    last_name: 'Козлов',
    phone_number: '+994507778899',
    license_number: 'EF345678',
    license_expiry_date: '2025-03-15',
    vehicle_brand: 'Ford',
    vehicle_model: 'Focus',
    vehicle_number: '10-CC-789',
    vehicle_year: 2021,
    status: DriverStatus.ACTIVE,
    rating: 4.9,
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-15T13:45:00Z',
    isAvailable: false,
    avatar: MOCK_AVATARS.DRIVER_3,
    location: MOCK_LOCATIONS.BAKU_EAST,
  },
];

// ===== МОК СТАТИСТИКА ВОДИТЕЛЕЙ =====
export const mockDriverStats: DriverStats[] = [
  {
    total_trips: 156,
    completed_trips: 150,
    cancelled_trips: 6,
    total_earnings: 12500.50,
    average_rating: 4.8,
    total_ratings: 142,
    online_hours_today: 8.5,
    online_hours_week: 45.2,
    online_hours_month: 180.5,
  },
  {
    total_trips: 89,
    completed_trips: 85,
    cancelled_trips: 4,
    total_earnings: 7200.75,
    average_rating: 4.6,
    total_ratings: 78,
    online_hours_today: 6.2,
    online_hours_week: 32.1,
    online_hours_month: 125.8,
  },
  {
    total_trips: 234,
    completed_trips: 228,
    cancelled_trips: 6,
    total_earnings: 18900.25,
    average_rating: 4.9,
    total_ratings: 215,
    online_hours_today: 10.1,
    online_hours_week: 58.7,
    online_hours_month: 245.3,
  },
];

// ===== МОК ЗАКАЗЫ =====
export const mockOrders: Order[] = [
  {
    id: 'order_1',
    clientId: 'client_1',
    driverId: 'driver_1',
    from: 'ул. Низами, 23, Баку',
    to: 'пр. Нефтяников, 45, Баку',
    departureTime: '2024-01-15T10:30:00Z',
    passenger: {
      name: 'Алиса Петрова',
      relationship: 'daughter',
      phone: '+994501234567',
    },
    route: [
      {
        id: 'route_1_1',
        address: 'ул. Низами, 23, Баку',
        coordinates: MOCK_LOCATIONS.BAKU_CENTER,
      },
      {
        id: 'route_1_2',
        address: 'пр. Нефтяников, 45, Баку',
        coordinates: MOCK_LOCATIONS.BAKU_EAST,
      },
    ],
    status: 'in_progress',
    price: 12.50,
    distance: 3.2,
    duration: 15,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:45:00Z',
  },
  {
    id: 'order_2',
    clientId: 'client_3',
    driverId: 'driver_2',
    from: 'ул. Рашида Бейбутова, 12, Баку',
    to: 'ул. Ататюрка, 78, Баку',
    departureTime: '2024-01-15T09:15:00Z',
    passenger: {
      name: 'Иван Петров',
      relationship: 'me',
      phone: '+994505551234',
    },
    route: [
      {
        id: 'route_2_1',
        address: 'ул. Рашида Бейбутова, 12, Баку',
        coordinates: MOCK_LOCATIONS.BAKU_NORTH,
      },
      {
        id: 'route_2_2',
        address: 'ул. Ататюрка, 78, Баку',
        coordinates: MOCK_LOCATIONS.BAKU_CENTER,
      },
    ],
    status: 'completed',
    price: 8.75,
    distance: 2.1,
    duration: 10,
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:25:00Z',
  },
];

// ===== МОК ЧАТЫ =====
export const mockChats: Chat[] = [
  {
    id: 'chat_1',
    clientId: 'client_1',
    driverId: 'driver_1',
    lastMessage: {
      id: 'msg_1',
      chatId: 'chat_1',
      senderId: 'driver_1',
      senderType: 'driver',
      content: 'Приеду через 5 минут',
      timestamp: '2024-01-15T10:40:00Z',
      type: 'text',
      isRead: false,
    },
    unreadCount: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:40:00Z',
  },
  {
    id: 'chat_2',
    clientId: 'client_2',
    driverId: 'driver_2',
    lastMessage: {
      id: 'msg_2',
      chatId: 'chat_2',
      senderId: 'driver_2',
      senderType: 'driver',
      content: 'Жду вас у подъезда',
      timestamp: '2024-01-15T09:20:00Z',
      type: 'text',
      isRead: true,
    },
    unreadCount: 0,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:20:00Z',
  },
];

// ===== МОК СООБЩЕНИЯ =====
export const mockMessages: Message[] = [
  {
    id: 'msg_1',
    chatId: 'chat_1',
    senderId: 'driver_1',
    senderType: 'driver',
    content: 'Приеду через 5 минут',
    timestamp: '2024-01-15T10:40:00Z',
    type: 'text',
    isRead: false,
  },
  {
    id: 'msg_2',
    chatId: 'chat_1',
    senderId: 'client_1',
    senderType: 'client',
    content: 'Хорошо, жду',
    timestamp: '2024-01-15T10:41:00Z',
    type: 'text',
    isRead: true,
  },
  {
    id: 'msg_3',
    chatId: 'chat_2',
    senderId: 'driver_2',
    senderType: 'driver',
    content: 'Жду вас у подъезда',
    timestamp: '2024-01-15T09:20:00Z',
    type: 'text',
    isRead: true,
  },
];

// ===== МОК УВЕДОМЛЕНИЯ =====
export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'client_1',
    title: 'Новый заказ',
    message: 'У вас новый заказ от клиента',
    type: 'order',
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'notif_2',
    userId: 'client_1',
    title: 'Платеж получен',
    message: 'Получен платеж на сумму 12.50 ₼',
    type: 'payment',
    isRead: true,
    createdAt: '2024-01-15T09:25:00Z',
  },
  {
    id: 'notif_3',
    userId: 'client_2',
    title: 'Водитель прибыл',
    message: 'Ваш водитель прибыл к месту посадки',
    type: 'driver',
    isRead: false,
    createdAt: '2024-01-15T11:00:00Z',
  },
];

// ===== МОК ПАКЕТЫ УСЛУГ =====
export const mockPackages: Package[] = [
  {
    id: 'pkg_1',
    name: 'Базовый пакет',
    description: '10 поездок в месяц',
    price: 50.00,
    tripsCount: 10,
    validityDays: 30,
    features: ['Безлимитные поездки', 'Приоритетная поддержка', 'Отмена без штрафа'],
  },
  {
    id: 'pkg_2',
    name: 'Премиум пакет',
    description: '30 поездок в месяц',
    price: 120.00,
    tripsCount: 30,
    validityDays: 30,
    features: ['Безлимитные поездки', 'Приоритетная поддержка', 'Отмена без штрафа', 'Премиум водители'],
    isPopular: true,
  },
  {
    id: 'pkg_3',
    name: 'Семейный пакет',
    description: '50 поездок в месяц для всей семьи',
    price: 200.00,
    tripsCount: 50,
    validityDays: 30,
    features: ['Безлимитные поездки', 'Приоритетная поддержка', 'Отмена без штрафа', 'Премиум водители', 'Детские кресла'],
  },
];

// ===== МОК РАСПИСАНИЕ =====
export const mockScheduleItems = [
  {
    id: 'schedule_1',
    date: '15 января',
    time: '08:00',
    driver: 'Алексей Петров',
    car: 'Toyota Camry',
    from: 'Дом',
    to: 'Работа',
    status: 'upcoming',
  },
  {
    id: 'schedule_2',
    date: '14 января',
    time: '18:00',
    driver: 'Дмитрий Смирнов',
    car: 'Honda Civic',
    from: 'Работа',
    to: 'Дом',
    status: 'completed',
  },
  {
    id: 'schedule_3',
    date: '13 января',
    time: '09:30',
    driver: 'Сергей Козлов',
    car: 'Ford Focus',
    from: 'Дом',
    to: 'Школа',
    status: 'cancelled',
  },
];

// ===== МОК ДЕТИ =====
export const mockChildren = [
  { 
    id: 'child_1', 
    name: 'Анна', 
    age: 12, 
    school: 'Школа №123',
    grade: '6 класс',
    address: 'ул. Низами, 23, Баку',
  },
  { 
    id: 'child_2', 
    name: 'Михаил', 
    age: 8, 
    school: 'Школа №456',
    grade: '2 класс',
    address: 'ул. Низами, 23, Баку',
  },
];

// Добавляем familyMembers для централизации
export const familyMembers = [
  { id: 'me', name: 'Я', icon: 'person-circle' },
  { id: 'daughter', name: 'Дочь', icon: 'flower' },
  { id: 'son', name: 'Сын', icon: 'football' },
  { id: 'wife', name: 'Жена', icon: 'heart' },
  { id: 'husband', name: 'Муж', icon: 'car-sport' },
];

// ===== УТИЛИТЫ ДЛЯ СОЗДАНИЯ МОКОВ =====

/**
 * Создает мок-пользователя с заданными параметрами
 */
export const createMockUser = (options: {
  email: string;
  authMethod?: 'google' | 'facebook' | 'apple';
  role?: UserRole;
  name?: string;
  surname?: string;
  phone?: string;
  address?: string;
}): User => {
  const { 
    email, 
    authMethod, 
    role = UserRole.CLIENT, 
    name, 
    surname, 
    phone, 
    address 
  } = options;

  let userName = name || 'Иван';
  let userSurname = surname || 'Иванов';
  let userAvatar: string | null = null;

  if (authMethod) {
    switch (authMethod) {
      case 'google':
        userName = 'Google';
        userSurname = 'User';
        userAvatar = MOCK_AVATARS.CLIENT_1;
        break;
      case 'facebook':
        userName = 'Facebook';
        userSurname = 'User';
        userAvatar = MOCK_AVATARS.CLIENT_2;
        break;
      case 'apple':
        userName = 'Apple';
        userSurname = 'User';
        userAvatar = null;
        break;
    }
  }

  return {
    id: authMethod ? `social_${Date.now()}` : `user_${Date.now()}`,
    email,
    name: userName,
    surname: userSurname,
    address: address || 'Баку, ул. Примерная, 1',
    role,
    phone: phone || '+994501234567',
    avatar: userAvatar,
    rating: 4.5,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Создает мок-водителя с заданными параметрами
 */
export const createMockDriver = (options: {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_number?: string;
}): Driver => {
  const {
    email,
    first_name,
    last_name,
    phone_number,
    vehicle_brand = 'Toyota',
    vehicle_model = 'Camry',
    vehicle_number = '10-XX-000',
  } = options;

  return {
    id: `driver_${Date.now()}`,
    email,
    first_name,
    last_name,
    phone_number,
    license_number: `AB${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`,
    license_expiry_date: '2025-12-31',
    vehicle_brand,
    vehicle_model,
    vehicle_number,
    vehicle_year: 2020,
    status: DriverStatus.ACTIVE,
    rating: 4.5 + Math.random() * 0.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    isAvailable: true,
    avatar: MOCK_AVATARS.DRIVER_1,
    location: MOCK_LOCATIONS.BAKU_CENTER,
  };
};

// ===== ЦЕНТРАЛИЗОВАННЫЙ ЭКСПОРТ =====
const mockData = {
  users: mockUsers,
  drivers: mockDrivers,
  driverStats: mockDriverStats,
  orders: mockOrders,
  chats: mockChats,
  messages: mockMessages,
  notifications: mockNotifications,
  packages: mockPackages,
  scheduleItems: mockScheduleItems,
  children: mockChildren,
  familyMembers: familyMembers,
  createMockUser,
  createMockDriver,
};

export default mockData; 