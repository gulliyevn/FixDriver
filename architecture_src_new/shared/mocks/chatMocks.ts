import { Chat, ChatParticipant, ChatMessage } from '../../presentation/screens/common/ChatScreen/types/Chat';

export const mockParticipants: ChatParticipant[] = [
  {
    id: 'driver_1',
    name: 'Алексей',
    surname: 'Петров',
    phone: '+994501234567',
    car: 'Toyota Camry',
    rating: '4.8',
    online: true,
    avatar: undefined
  },
  {
    id: 'driver_2',
    name: 'Мария',
    surname: 'Иванова',
    phone: '+994507654321',
    car: 'Hyundai Elantra',
    rating: '4.9',
    online: false,
    avatar: undefined
  },
  {
    id: 'driver_3',
    name: 'Дмитрий',
    surname: 'Сидоров',
    phone: '+994509876543',
    car: 'Nissan Altima',
    rating: '4.7',
    online: true,
    avatar: undefined
  },
  {
    id: 'driver_4',
    name: 'Елена',
    surname: 'Козлова',
    phone: '+994501112233',
    car: 'Kia Optima',
    rating: '4.6',
    online: false,
    avatar: undefined
  },
  {
    id: 'driver_5',
    name: 'Сергей',
    surname: 'Морозов',
    phone: '+994504445566',
    car: 'Volkswagen Passat',
    rating: '4.9',
    online: true,
    avatar: undefined
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    content: 'Добро пожаловать! Я ваш водитель Алексей.',
    senderId: 'driver_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_2',
    content: 'Спасибо! Когда приедете?',
    senderId: 'me',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_3',
    content: 'Через 5 минут буду у входа.',
    senderId: 'driver_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_4',
    content: 'Хорошего дня!',
    senderId: 'driver_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: 'read',
    type: 'text'
  },
  {
    id: 'msg_5',
    content: 'До встречи завтра!',
    senderId: 'driver_3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    status: 'delivered',
    type: 'text'
  }
];

export const mockChats: Chat[] = [
  {
    id: 'chat_1',
    participant: mockParticipants[0],
    lastMessage: mockMessages[2],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isFavorite: true
  },
  {
    id: 'chat_2',
    participant: mockParticipants[1],
    lastMessage: mockMessages[3],
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isFavorite: false
  },
  {
    id: 'chat_3',
    participant: mockParticipants[2],
    lastMessage: mockMessages[4],
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isFavorite: false
  },
  {
    id: 'chat_4',
    participant: mockParticipants[3],
    lastMessage: {
      id: 'msg_6',
      content: 'Спасибо за поездку!',
      senderId: 'me',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      status: 'read',
      type: 'text'
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    isFavorite: true
  },
  {
    id: 'chat_5',
    participant: mockParticipants[4],
    lastMessage: {
      id: 'msg_7',
      content: 'Отличный сервис!',
      senderId: 'driver_5',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'read',
      type: 'text'
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
    isFavorite: false
  }
];
