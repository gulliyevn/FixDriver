import { Chat, Message } from '../types/chat';

class ChatService {
  private chats: Chat[] = [];
  private messages: { [chatId: string]: Message[] } = {};

  constructor() {
    console.log('💬 ChatService: инициализация сервиса чата');
    this.initializeMockData();
  }

  private initializeMockData() {
    const now = new Date();
    
    // Моковые чаты
    this.chats = [
      {
        id: '1',
        participantId: 'driver_1',
        participantName: 'Рашад Мамедов',
        participantAvatar: 'https://i.pravatar.cc/150?img=1',
        participantRole: 'driver',
        lastMessage: 'Уже еду к вам, буду через 3 минуты',
        lastMessageTime: new Date(now.getTime() - 2 * 60 * 1000),
        unreadCount: 1,
        isOnline: true,
        tripId: 'trip_1',
      },
      {
        id: '2',
        participantId: 'driver_2',
        participantName: 'Эльнур Джафаров',
        participantAvatar: 'https://i.pravatar.cc/150?img=2',
        participantRole: 'driver',
        lastMessage: 'Спасибо за поездку! Хорошего дня',
        lastMessageTime: new Date(now.getTime() - 30 * 60 * 1000),
        unreadCount: 0,
        isOnline: false,
        tripId: 'trip_2',
      },
      {
        id: '3',
        participantId: 'driver_3',
        participantName: 'Орхан Алиев',
        participantAvatar: 'https://i.pravatar.cc/150?img=3',
        participantRole: 'driver',
        lastMessage: 'Задерживаюсь на 5 минут из-за пробки',
        lastMessageTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        unreadCount: 2,
        isOnline: true,
        tripId: 'trip_3',
      },
      {
        id: '4',
        participantId: 'support',
        participantName: 'Поддержка FixDrive',
        participantAvatar: null,
        participantRole: 'support',
        lastMessage: 'Ваш вопрос был передан специалисту',
        lastMessageTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        unreadCount: 0,
        isOnline: true,
        tripId: null,
      },
    ];

    // Моковые сообщения для каждого чата
    this.messages = {
      '1': [
        {
          id: 'msg_1_1',
          chatId: '1',
          senderId: 'driver_1',
          senderName: 'Рашад Мамедов',
          content: 'Добрый день! Я ваш водитель на сегодня',
          timestamp: new Date(now.getTime() - 15 * 60 * 1000),
          type: 'text',
          isRead: true,
        },
        {
          id: 'msg_1_2',
          chatId: '1',
          senderId: 'me',
          senderName: 'Я',
          content: 'Здравствуйте! Когда будете?',
          timestamp: new Date(now.getTime() - 12 * 60 * 1000),
          type: 'text',
          isRead: true,
        },
        {
          id: 'msg_1_3',
          chatId: '1',
          senderId: 'driver_1',
          senderName: 'Рашад Мамедов',
          content: 'Уже еду к вам, буду через 3 минуты',
          timestamp: new Date(now.getTime() - 2 * 60 * 1000),
          type: 'text',
          isRead: false,
        },
      ],
      '2': [
        {
          id: 'msg_2_1',
          chatId: '2',
          senderId: 'driver_2',
          senderName: 'Эльнур Джафаров',
          content: 'Приехал, жду у подъезда',
          timestamp: new Date(now.getTime() - 45 * 60 * 1000),
          type: 'text',
          isRead: true,
        },
        {
          id: 'msg_2_2',
          chatId: '2',
          senderId: 'me',
          senderName: 'Я',
          content: 'Выхожу',
          timestamp: new Date(now.getTime() - 40 * 60 * 1000),
          type: 'text',
          isRead: true,
        },
        {
          id: 'msg_2_3',
          chatId: '2',
          senderId: 'driver_2',
          senderName: 'Эльнур Джафаров',
          content: 'Спасибо за поездку! Хорошего дня',
          timestamp: new Date(now.getTime() - 30 * 60 * 1000),
          type: 'text',
          isRead: true,
        },
      ],
      '3': [
        {
          id: 'msg_3_1',
          chatId: '3',
          senderId: 'driver_3',
          senderName: 'Орхан Алиев',
          content: 'Добрый вечер! Выезжаю к вам',
          timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
          type: 'text',
          isRead: true,
        },
        {
          id: 'msg_3_2',
          chatId: '3',
          senderId: 'driver_3',
          senderName: 'Орхан Алиев',
          content: 'Задерживаюсь на 5 минут из-за пробки',
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
          type: 'text',
          isRead: false,
        },
        {
          id: 'msg_3_3',
          chatId: '3',
          senderId: 'driver_3',
          senderName: 'Орхан Алиев',
          content: 'Уже близко, еще 2 минуты',
          timestamp: new Date(now.getTime() - 90 * 60 * 1000),
          type: 'text',
          isRead: false,
        },
      ],
      '4': [
        {
          id: 'msg_4_1',
          chatId: '4',
          senderId: 'me',
          senderName: 'Я',
          content: 'Здравствуйте, у меня вопрос по тарифам',
          timestamp: new Date(now.getTime() - 25 * 60 * 60 * 1000),
          type: 'text',
          isRead: true,
        },
        {
          id: 'msg_4_2',
          chatId: '4',
          senderId: 'support',
          senderName: 'Поддержка FixDrive',
          content: 'Здравствуйте! Опишите, пожалуйста, ваш вопрос подробнее',
          timestamp: new Date(now.getTime() - 24.5 * 60 * 60 * 1000),
          type: 'text',
          isRead: true,
        },
        {
          id: 'msg_4_3',
          chatId: '4',
          senderId: 'support',
          senderName: 'Поддержка FixDrive',
          content: 'Ваш вопрос был передан специалисту',
          timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          type: 'text',
          isRead: true,
        },
      ],
    };
  }

  // Получение списка чатов
  async getChats(userId: string): Promise<Chat[]> {
    console.log('📋 ChatService: получение списка чатов для пользователя', userId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.chats].sort((a, b) => 
          b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
        ));
      }, 300);
    });
  }

  // Получение сообщений чата
  async getMessages(chatId: string): Promise<Message[]> {
    console.log('💌 ChatService: получение сообщений для чата', chatId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.messages[chatId] || []);
      }, 200);
    });
  }

  // Отправка сообщения
  async sendMessage(chatId: string, content: string, senderId: string): Promise<Message> {
    console.log('📤 ChatService: отправка сообщения в чат', chatId, 'от', senderId);
    return new Promise((resolve) => {
      const message: Message = {
        id: `msg_${chatId}_${Date.now()}`,
        chatId,
        senderId,
        senderName: senderId === 'me' ? 'Я' : 'Водитель',
        content,
        timestamp: new Date(),
        type: 'text',
        isRead: false,
      };

      // Добавляем сообщение в чат
      if (!this.messages[chatId]) {
        this.messages[chatId] = [];
      }
      this.messages[chatId].push(message);

      // Обновляем последнее сообщение в чате
      const chat = this.chats.find(c => c.id === chatId);
      if (chat) {
        chat.lastMessage = content;
        chat.lastMessageTime = message.timestamp;
        if (senderId !== 'me') {
          chat.unreadCount += 1;
        }
      }

      setTimeout(() => resolve(message), 100);
    });
  }

  // Отметить сообщения как прочитанные
  async markMessagesAsRead(chatId: string): Promise<void> {
    return new Promise((resolve) => {
      const messages = this.messages[chatId];
      if (messages) {
        messages.forEach(msg => {
          if (msg.senderId !== 'me') {
            msg.isRead = true;
          }
        });
      }

      // Обнуляем счетчик непрочитанных в чате
      const chat = this.chats.find(c => c.id === chatId);
      if (chat) {
        chat.unreadCount = 0;
      }

      setTimeout(() => resolve(), 100);
    });
  }

  // Создание нового чата
  async createChat(participantId: string, participantName: string, tripId?: string): Promise<Chat> {
    return new Promise((resolve) => {
      const chat: Chat = {
        id: `chat_${Date.now()}`,
        participantId,
        participantName,
        participantAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        participantRole: 'driver',
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
        isOnline: Math.random() > 0.3, // 70% шанс быть онлайн
        tripId,
      };

      this.chats.unshift(chat);
      this.messages[chat.id] = [];

      setTimeout(() => resolve(chat), 200);
    });
  }

  // Получение общего количества непрочитанных сообщений
  getTotalUnreadCount(): number {
    return this.chats.reduce((total, chat) => total + chat.unreadCount, 0);
  }

  // Симуляция получения нового сообщения
  simulateIncomingMessage(chatId: string) {
    const randomMessages = [
      'Уже в пути к вам',
      'Буду через 5 минут',
      'Жду у подъезда',
      'Задерживаюсь на 2 минуты',
      'Приехал, где вас встретить?',
      'Спасибо за поездку!',
      'Хорошего дня!',
    ];

    const chat = this.chats.find(c => c.id === chatId);
    if (!chat) return;

    const message: Message = {
      id: `msg_${chatId}_${Date.now()}`,
      chatId,
      senderId: chat.participantId,
      senderName: chat.participantName,
      content: randomMessages[Math.floor(Math.random() * randomMessages.length)],
      timestamp: new Date(),
      type: 'text',
      isRead: false,
    };

    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
    }
    this.messages[chatId].push(message);

    // Обновляем чат
    chat.lastMessage = message.content;
    chat.lastMessageTime = message.timestamp;
    chat.unreadCount += 1;

    return message;
  }

  // Форматирование времени для отображения
  formatMessageTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return 'только что';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} мин`;
    } else if (diffHours < 24) {
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return 'вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  }
}

// Синглтон для использования во всем приложении
export const chatService = new ChatService();
export default ChatService;
