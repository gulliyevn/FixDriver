import { Notification } from '../services/NotificationService';
import { Package } from '../types/package';

// ===== МОК УВЕДОМЛЕНИЯ =====
export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: 'client_1',
    title: 'Новый водитель',
    message: 'Алексей Петров присоединился к сервису',
    type: 'driver',
    isRead: false,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'notif_2',
    userId: 'client_1',
    title: 'Поездка завершена',
    message: 'Поездка с Дмитрием Смирновым успешно завершена',
    type: 'trip',
    isRead: true,
    createdAt: '2024-01-15T09:45:00Z',
  },
  {
    id: 'notif_3',
    userId: 'client_1',
    title: 'Новое сообщение',
    message: 'У вас новое сообщение от водителя',
    type: 'system',
    isRead: false,
    createdAt: '2024-01-15T09:00:00Z',
  },
];

// ===== МОК ДЕТИ =====
export const mockChildren = [
  {
    id: 'child_1',
    name: 'Алиса Петрова',
    age: 8,
    school: 'Школа №15',
    grade: '2 класс',
    address: 'ул. Низами, 23, Баку',
    emergencyContact: {
      name: 'Анна Иванова',
      phone: '+994501234567',
      relationship: 'mother',
    },
  },
  {
    id: 'child_2',
    name: 'Михаил Сидоров',
    age: 12,
    school: 'Лицей №3',
    grade: '6 класс',
    address: 'пр. Мира, 25, Баку',
    emergencyContact: {
      name: 'Петр Сидоров',
      phone: '+994509876543',
      relationship: 'father',
    },
  },
  {
    id: 'child_3',
    name: 'Елена Козлова',
    age: 10,
    school: 'Гимназия №8',
    grade: '4 класс',
    address: 'ул. Советская, 7, Баку',
    emergencyContact: {
      name: 'Мария Козлова',
      phone: '+994505551234',
      relationship: 'mother',
    },
  },
];

// ===== МОК ПАКЕТЫ УСЛУГ =====
export const mockPackages: Package[] = [
  {
    id: 'package_1',
    name: 'Базовый пакет',
    description: '5 поездок в месяц',
    price: 100,
    tripsCount: 5,
    validityDays: 30,
    features: ['Базовое сопровождение', 'GPS отслеживание', 'Уведомления'],
  },
  {
    id: 'package_2',
    name: 'Стандартный пакет',
    description: '15 поездок в месяц',
    price: 250,
    tripsCount: 15,
    validityDays: 30,
    features: ['Приоритетное обслуживание', 'GPS отслеживание', 'Уведомления', 'Поддержка 24/7'],
  },
  {
    id: 'package_3',
    name: 'Премиум пакет',
    description: '30 поездок в месяц',
    price: 450,
    tripsCount: 30,
    validityDays: 30,
    features: ['VIP обслуживание', 'GPS отслеживание', 'Уведомления', 'Поддержка 24/7', 'Персональный менеджер'],
  },
];

// ===== МОК ДАННЫЕ ДЛЯ РЕГИСТРАЦИИ =====
export const mockRegistrationData = {
  relationshipOptions: [
    { value: 'mother', label: 'Мама' },
    { value: 'father', label: 'Папа' },
    { value: 'grandmother', label: 'Бабушка' },
    { value: 'grandfather', label: 'Дедушка' },
    { value: 'guardian', label: 'Опекун' },
    { value: 'other', label: 'Другое' },
  ],
  experienceOptions: [
    { value: '0-1', label: '0-1 год' },
    { value: '1-3', label: '1-3 года' },
    { value: '3-5', label: '3-5 лет' },
    { value: '5-10', label: '5-10 лет' },
    { value: '10+', label: 'Более 10 лет' },
  ],
};

// ===== МОК ДАННЫЕ ПОДДЕРЖКИ =====
export const mockSupportData = {
  quickQuestions: [
    {
      id: 'q1',
      question: 'Как отменить поездку?',
      answer: 'Вы можете отменить поездку в разделе "Мои поездки" не позднее чем за 2 часа до начала.',
    },
    {
      id: 'q2',
      question: 'Что делать, если водитель не приехал?',
      answer: 'Свяжитесь с поддержкой через чат или позвоните по номеру +994501234567.',
    },
    {
      id: 'q3',
      question: 'Как изменить данные ребенка?',
      answer: 'Перейдите в профиль ребенка в разделе "Мои дети" и нажмите "Редактировать".',
    },
  ],
};

// ===== МОК ДАННЫЕ ЗАРАБОТКА =====
export const mockEarningsData = {
  periods: [
    { key: 'today', value: 'today', label: 'Сегодня', icon: 'today' },
    { key: 'week', value: 'week', label: 'Неделя', icon: 'calendar-week' },
    { key: 'month', value: 'month', label: 'Месяц', icon: 'calendar' },
  ],
  earningsData: {
    today: {
      total: 1250.50,
      rides: 8,
      trips: 8,
      hours: 6.5,
      average: 156.31,
      chart: [120, 140, 180, 160, 200, 180, 220],
    },
    week: {
      total: 8750.25,
      rides: 45,
      trips: 45,
      hours: 42.3,
      average: 194.45,
      chart: [800, 1200, 900, 1100, 1300, 1400, 1250],
    },
    month: {
      total: 32500.75,
      rides: 156,
      trips: 156,
      hours: 180.5,
      average: 208.34,
      chart: [3000, 3500, 3200, 3800, 3600, 4000, 3800, 3200, 3500, 3800, 3600, 4000],
    },
  },
  quickStats: {
    totalEarnings: 32500.75,
    totalTrips: 156,
    averageRating: 4.8,
    onlineHours: 180.5,
  },
  recentRides: [
    {
      id: 'ride_1',
      date: '2024-01-15',
      time: '10:30',
      from: 'ул. Низами, 23',
      to: 'пр. Нефтяников, 45',
      earnings: 25.50,
      rating: 5,
    },
    {
      id: 'ride_2',
      date: '2024-01-15',
      time: '14:00',
      from: 'пр. Мира, 25',
      to: 'ул. Советская, 7',
      earnings: 18.75,
      rating: 4,
    },
  ],
};

// ===== МОК ФИЛЬТРЫ =====
export const mockFilters = {
  status: [
    { id: 'all', label: 'Все' },
    { id: 'online', label: 'Онлайн' },
    { id: 'offline', label: 'Офлайн' },
    { id: 'busy', label: 'Занят' },
  ],
  rating: [
    { id: 'all', label: 'Все рейтинги' },
    { id: '4.5+', label: '4.5+ звезд' },
    { id: '4.0+', label: '4.0+ звезд' },
    { id: '3.5+', label: '3.5+ звезд' },
  ],
  vehicle: [
    { id: 'all', label: 'Все автомобили' },
    { id: 'toyota', label: 'Toyota' },
    { id: 'honda', label: 'Honda' },
    { id: 'ford', label: 'Ford' },
  ],
}; 