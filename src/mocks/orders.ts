import { Order } from '../types/order';
import { Chat, Message } from '../types/chat';

const MOCK_LOCATIONS = {
  BAKU_CENTER: { latitude: 40.3777, longitude: 49.8920 },
  BAKU_NORTH: { latitude: 40.3953, longitude: 49.8512 },
  BAKU_EAST: { latitude: 40.4093, longitude: 49.8671 },
  BAKU_SOUTH: { latitude: 40.3777, longitude: 49.8920 },
};

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
        coordinates: MOCK_LOCATIONS.BAKU_NORTH,
      },
    ],
    status: 'completed',
    price: 25.50,
    distance: 5.2,
    duration: 30,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'order_2',
    clientId: 'client_2',
    driverId: 'driver_2',
    from: 'пр. Мира, 25, Баку',
    to: 'ул. Советская, 7, Баку',
    departureTime: '2024-01-15T14:00:00Z',
    passenger: {
      name: 'Михаил Сидоров',
      relationship: 'son',
      phone: '+994509876543',
    },
    route: [
      {
        id: 'route_2_1',
        address: 'пр. Мира, 25, Баку',
        coordinates: MOCK_LOCATIONS.BAKU_EAST,
      },
      {
        id: 'route_2_2',
        address: 'ул. Советская, 7, Баку',
        coordinates: MOCK_LOCATIONS.BAKU_SOUTH,
      },
    ],
    status: 'in_progress',
    price: 18.75,
    distance: 3.8,
    duration: 25,
    createdAt: '2024-01-15T13:30:00Z',
    updatedAt: '2024-01-15T13:30:00Z',
  },
  {
    id: 'order_3',
    clientId: 'client_3',
    driverId: 'driver_3',
    from: 'ул. Советская, 7, Баку',
    to: 'ул. Низами, 23, Баку',
    departureTime: '2024-01-15T16:30:00Z',
    passenger: {
      name: 'Елена Козлова',
      relationship: 'daughter',
      phone: '+994505551234',
    },
    route: [
      {
        id: 'route_3_1',
        address: 'ул. Советская, 7, Баку',
        coordinates: MOCK_LOCATIONS.BAKU_SOUTH,
      },
      {
        id: 'route_3_2',
        address: 'ул. Низами, 23, Баку',
        coordinates: MOCK_LOCATIONS.BAKU_CENTER,
      },
    ],
    status: 'confirmed',
    price: 22.00,
    distance: 4.5,
    duration: 28,
    createdAt: '2024-01-15T15:00:00Z',
    updatedAt: '2024-01-15T15:00:00Z',
  },
];

// ===== МОК ЧАТЫ =====
export const mockChats: Chat[] = [
  {
    id: 'chat_1',
    clientId: 'client_1',
    driverId: 'driver_1',
    lastMessage: {
      id: 'msg_3',
      chatId: 'chat_1',
      senderId: 'client_1',
      senderType: 'client',
      content: 'Спасибо за поездку!',
      type: 'text',
      timestamp: '2024-01-15T11:05:00Z',
      isRead: true,
    },
    unreadCount: 0,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T11:05:00Z',
  },
  {
    id: 'chat_2',
    clientId: 'client_2',
    driverId: 'driver_2',
    lastMessage: {
      id: 'msg_4',
      chatId: 'chat_2',
      senderId: 'driver_2',
      senderType: 'driver',
      content: 'Где вас забрать?',
      type: 'text',
      timestamp: '2024-01-15T13:45:00Z',
      isRead: false,
    },
    unreadCount: 2,
    createdAt: '2024-01-15T13:30:00Z',
    updatedAt: '2024-01-15T13:45:00Z',
  },
  {
    id: 'chat_3',
    clientId: 'client_3',
    driverId: 'driver_3',
    lastMessage: {
      id: 'msg_5',
      chatId: 'chat_3',
      senderId: 'driver_3',
      senderType: 'driver',
      content: 'Буду через 5 минут',
      type: 'text',
      timestamp: '2024-01-15T16:25:00Z',
      isRead: false,
    },
    unreadCount: 1,
    createdAt: '2024-01-15T15:00:00Z',
    updatedAt: '2024-01-15T16:25:00Z',
  },
];

// ===== МОК СООБЩЕНИЯ =====
export const mockMessages: Message[] = [
  {
    id: 'msg_1',
    chatId: 'chat_1',
    senderId: 'driver_1',
    senderType: 'driver',
    content: 'Добрый день! Я подъехал к указанному адресу.',
    type: 'text',
    timestamp: '2024-01-15T10:25:00Z',
    isRead: true,
  },
  {
    id: 'msg_2',
    chatId: 'chat_1',
    senderId: 'client_1',
    senderType: 'client',
    content: 'Спасибо! Выхожу сейчас.',
    type: 'text',
    timestamp: '2024-01-15T10:26:00Z',
    isRead: true,
  },
  {
    id: 'msg_3',
    chatId: 'chat_1',
    senderId: 'client_1',
    senderType: 'client',
    content: 'Спасибо за поездку!',
    type: 'text',
    timestamp: '2024-01-15T11:05:00Z',
    isRead: true,
  },
  {
    id: 'msg_4',
    chatId: 'chat_2',
    senderId: 'driver_2',
    senderType: 'driver',
    content: 'Где вас забрать?',
    type: 'text',
    timestamp: '2024-01-15T13:45:00Z',
    isRead: false,
  },
  {
    id: 'msg_5',
    chatId: 'chat_3',
    senderId: 'driver_3',
    senderType: 'driver',
    content: 'Буду через 5 минут',
    type: 'text',
    timestamp: '2024-01-15T16:25:00Z',
    isRead: false,
  },
]; 