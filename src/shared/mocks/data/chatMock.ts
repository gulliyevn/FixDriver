/**
 * Mock Chat Data
 * 
 * Sample chats and messages for development and testing
 */

export const mockChats = [
  {
    id: 'chat_1',
    participant: {
      id: 'driver_1',
      name: 'John Smith',
      avatar: null,
      car: 'Toyota Camry',
      phone: 'A123БВ777',
      rating: '4.8',
    },
    lastMessage: {
      content: 'I\'ll be there in 5 minutes',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    unreadCount: 2,
    online: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'chat_2',
    participant: {
      id: 'driver_2',
      name: 'Sarah Johnson',
      avatar: null,
      car: 'Honda Civic',
      phone: 'B456ГД888',
      rating: '4.9',
    },
    lastMessage: {
      content: 'Thank you for the ride!',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    unreadCount: 0,
    online: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 'chat_3',
    participant: {
      id: 'driver_3',
      name: 'Mike Wilson',
      avatar: null,
      car: 'Nissan Altima',
      phone: 'C789ЕЖ999',
      rating: '4.7',
    },
    lastMessage: {
      content: 'Where are you?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    unreadCount: 1,
    online: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

export const mockMessages: Record<string, any[]> = {
  chat_1: [
    {
      id: 'msg_1',
      content: 'Hello! I\'m your driver for today.',
      senderId: 'driver_1',
      type: 'text',
      metadata: {},
      status: 'delivered',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: 'msg_2',
      content: 'Hi! I\'m waiting at the main entrance.',
      senderId: 'me',
      type: 'text',
      metadata: {},
      status: 'sent',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
    },
    {
      id: 'msg_3',
      content: 'I\'ll be there in 5 minutes',
      senderId: 'driver_1',
      type: 'text',
      metadata: {},
      status: 'delivered',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  chat_2: [
    {
      id: 'msg_4',
      content: 'Good morning! I\'m on my way.',
      senderId: 'driver_2',
      type: 'text',
      metadata: {},
      status: 'delivered',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 'msg_5',
      content: 'Perfect, thank you!',
      senderId: 'me',
      type: 'text',
      metadata: {},
      status: 'sent',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: 'msg_6',
      content: 'Thank you for the ride!',
      senderId: 'driver_2',
      type: 'text',
      metadata: {},
      status: 'delivered',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
  chat_3: [
    {
      id: 'msg_7',
      content: 'I\'m running a bit late, sorry!',
      senderId: 'driver_3',
      type: 'text',
      metadata: {},
      status: 'delivered',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
    {
      id: 'msg_8',
      content: 'No problem, take your time.',
      senderId: 'me',
      type: 'text',
      metadata: {},
      status: 'sent',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
    },
    {
      id: 'msg_9',
      content: 'Where are you?',
      senderId: 'driver_3',
      type: 'text',
      metadata: {},
      status: 'delivered',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ],
};
